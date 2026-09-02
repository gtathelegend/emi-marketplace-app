import { productRepository, ProductQueryOptions } from '../repositories/product.repository.js';
import { NotFoundError } from '../errors/AppError.js';

export class ProductService {
  public async getPublicProducts(options: ProductQueryOptions) {
    const { items, total } = await productRepository.findManyPublic(options);

    const formattedItems = items.map((product) => {
      // Find default variant or fallback to first variant
      const defaultVariant = product.variants.find((v) => v.isDefault) || product.variants[0];
      const primaryImage = defaultVariant?.images[0]?.url || null;

      return {
        id: product.id,
        title: product.title,
        slug: product.slug,
        subtitle: product.subtitle,
        description: product.description,
        basePrice: product.basePrice.toNumber(),
        rating: product.rating,
        reviewCount: product.reviewCount,
        createdAt: product.createdAt,
        brand: product.brand,
        category: product.category,
        primaryImage,
        defaultVariant: defaultVariant
          ? {
              id: defaultVariant.id,
              sku: defaultVariant.sku,
              title: defaultVariant.title,
              colorName: defaultVariant.colorName,
              colorHex: defaultVariant.colorHex,
              storage: defaultVariant.storage,
              price: defaultVariant.price.toNumber(),
              mrp: defaultVariant.mrp.toNumber(),
              stockQuantity: defaultVariant.stockQuantity,
            }
          : null,
      };
    });

    const totalPages = Math.ceil(total / options.limit) || 1;

    return {
      items: formattedItems,
      pagination: {
        page: options.page,
        limit: options.limit,
        total,
        totalPages,
      },
    };
  }

  public async getPublicProductBySlug(slug: string) {
    const product = await productRepository.findBySlugPublic(slug);

    if (!product) {
      throw new NotFoundError(`Product with slug '${slug}' not found`, 'PRODUCT_NOT_FOUND');
    }

    const formattedVariants = product.variants.map((variant) => ({
      id: variant.id,
      sku: variant.sku,
      title: variant.title,
      colorName: variant.colorName,
      colorHex: variant.colorHex,
      storage: variant.storage,
      price: variant.price.toNumber(),
      mrp: variant.mrp.toNumber(),
      stockQuantity: variant.stockQuantity,
      isDefault: variant.isDefault,
      images: variant.images,
      specifications: variant.specifications.map((s) => ({
        id: s.id,
        groupName: s.groupName,
        key: s.key,
        value: s.value,
        displayOrder: s.displayOrder,
      })),
      emiPlans: variant.emiPlans.map((plan) => ({
        id: plan.id,
        tenureMonths: plan.tenureMonths,
        interestRate: plan.interestRate.toNumber(),
        processingFee: plan.processingFee.toNumber(),
        cashbackAmount: plan.cashbackAmount.toNumber(),
        minDownPayment: plan.minDownPayment.toNumber(),
        isZeroCost: plan.isZeroCost,
        provider: plan.provider,
      })),
    }));

    return {
      id: product.id,
      title: product.title,
      slug: product.slug,
      subtitle: product.subtitle,
      description: product.description,
      basePrice: product.basePrice.toNumber(),
      rating: product.rating,
      reviewCount: product.reviewCount,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      brand: product.brand,
      category: product.category,
      variants: formattedVariants,
    };
  }
}

export const productService = new ProductService();
