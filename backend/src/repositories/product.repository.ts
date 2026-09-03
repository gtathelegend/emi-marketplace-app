import { Prisma } from '@prisma/client';
import { prisma } from '../config/prisma.js';

export interface ProductQueryOptions {
  page: number;
  limit: number;
  search?: string;
  brand?: string;
  category?: string;
  sort: 'newest' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';
}

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

export class ProductRepository {
  private cache = new Map<string, CacheEntry<any>>();
  private readonly TTL_MS = 60 * 1000; // 60 seconds

  private get db() {
    return prisma;
  }

  public clearCache(): void {
    this.cache.clear();
  }

  private async fetchManyFromDb(options: ProductQueryOptions) {
    const { page, limit, search, brand, category, sort } = options;
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      isPublished: true,
    };

    if (brand) {
      where.brand = {
        OR: [
          { slug: brand },
          { name: { equals: brand, mode: 'insensitive' } },
        ],
      };
    }

    if (category) {
      where.category = {
        OR: [
          { slug: category },
          { name: { equals: category, mode: 'insensitive' } },
        ],
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { subtitle: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { brand: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: 'desc' };

    switch (sort) {
      case 'price_asc':
        orderBy = { basePrice: 'asc' };
        break;
      case 'price_desc':
        orderBy = { basePrice: 'desc' };
        break;
      case 'name_asc':
        orderBy = { title: 'asc' };
        break;
      case 'name_desc':
        orderBy = { title: 'desc' };
        break;
      case 'newest':
      default:
        orderBy = { createdAt: 'desc' };
        break;
    }

    const [items, total] = await Promise.all([
      this.db.product.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          subtitle: true,
          description: true,
          basePrice: true,
          rating: true,
          reviewCount: true,
          createdAt: true,
          brand: {
            select: {
              id: true,
              name: true,
              slug: true,
              logoUrl: true,
            },
          },
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          variants: {
            where: { isActive: true },
            select: {
              id: true,
              sku: true,
              title: true,
              colorName: true,
              colorHex: true,
              storage: true,
              price: true,
              mrp: true,
              stockQuantity: true,
              isDefault: true,
              images: {
                where: { isPrimary: true },
                take: 1,
                select: {
                  url: true,
                  altText: true,
                },
              },
            },
          },
        },
      }),
      this.db.product.count({ where }),
    ]);

    return { items, total };
  }

  private async fetchBySlugFromDb(slug: string) {
    return this.db.product.findFirst({
      where: {
        slug,
        isPublished: true,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        subtitle: true,
        description: true,
        basePrice: true,
        rating: true,
        reviewCount: true,
        createdAt: true,
        updatedAt: true,
        brand: {
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
            description: true,
          },
        },
        variants: {
          where: { isActive: true },
          select: {
            id: true,
            sku: true,
            title: true,
            colorName: true,
            colorHex: true,
            storage: true,
            price: true,
            mrp: true,
            stockQuantity: true,
            isDefault: true,
            images: {
              orderBy: { displayOrder: 'asc' },
              select: {
                id: true,
                url: true,
                altText: true,
                displayOrder: true,
                isPrimary: true,
              },
            },
            specifications: {
              orderBy: { displayOrder: 'asc' },
              select: {
                id: true,
                groupName: true,
                key: true,
                value: true,
                displayOrder: true,
              },
            },
            emiPlans: {
              where: { isActive: true },
              select: {
                id: true,
                tenureMonths: true,
                interestRate: true,
                processingFee: true,
                cashbackAmount: true,
                minDownPayment: true,
                isZeroCost: true,
                provider: {
                  select: {
                    id: true,
                    name: true,
                    code: true,
                    logoUrl: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  public async findManyPublic(options: ProductQueryOptions): Promise<Awaited<ReturnType<ProductRepository['fetchManyFromDb']>>> {
    const cacheKey = `findMany:${JSON.stringify(options)}`;
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }

    const result = await this.fetchManyFromDb(options);
    this.cache.set(cacheKey, { data: result, expiresAt: Date.now() + this.TTL_MS });
    return result;
  }

  public async findBySlugPublic(slug: string): Promise<Awaited<ReturnType<ProductRepository['fetchBySlugFromDb']>>> {
    const cacheKey = `findBySlug:${slug}`;
    const cached = this.cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return cached.data;
    }

    const product = await this.fetchBySlugFromDb(slug);
    if (product) {
      this.cache.set(cacheKey, { data: product, expiresAt: Date.now() + this.TTL_MS });
    }

    return product;
  }
}

export const productRepository = new ProductRepository();
