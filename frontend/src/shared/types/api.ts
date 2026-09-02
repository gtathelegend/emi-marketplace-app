export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
}

export interface ProductVariantSummary {
  id: string;
  sku: string;
  title: string;
  colorName: string;
  colorHex: string;
  storage: string;
  price: number;
  mrp: number;
  stockQuantity: number;
}

export interface ProductListItem {
  id: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  description: string;
  basePrice: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  brand: Brand;
  category: Category;
  primaryImage?: string | null;
  defaultVariant?: ProductVariantSummary | null;
}

export interface ProductImageDetail {
  id: string;
  url: string;
  altText: string;
  displayOrder: number;
  isPrimary: boolean;
}

export interface ProductSpecificationDetail {
  id: string;
  groupName: string;
  key: string;
  value: string;
  displayOrder: number;
}

export interface EMIProviderSummary {
  id: string;
  name: string;
  code: string;
  logoUrl?: string | null;
}

export interface EMIPlanDetail {
  id: string;
  tenureMonths: number;
  interestRate: number;
  processingFee: number;
  cashbackAmount: number;
  minDownPayment: number;
  isZeroCost: boolean;
  provider: EMIProviderSummary;
}

export interface ProductVariantDetail {
  id: string;
  sku: string;
  title: string;
  colorName: string;
  colorHex: string;
  storage: string;
  price: number;
  mrp: number;
  stockQuantity: number;
  isDefault: boolean;
  images: ProductImageDetail[];
  specifications: ProductSpecificationDetail[];
  emiPlans: EMIPlanDetail[];
}

export interface ProductDetail {
  id: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  description: string;
  basePrice: number;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  brand: Brand;
  category: Category;
  variants: ProductVariantDetail[];
}

export interface CreateApplicationPayload {
  variantId: string;
  emiPlanId: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    panDemo?: string;
  };
}

export interface ContractSnapshot {
  productName: string;
  variantName: string;
  providerName: string;
  sku: string;
  principalAmount: number;
  interestRate: number;
  tenureMonths: number;
  monthlyAmount: number;
  cashbackAmount: number;
  totalPayable: number;
}

export interface ApplicationResult {
  id: string;
  applicationNumber: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  appliedAt: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
  };
  contractSnapshot: ContractSnapshot;
  productReference?: { title: string; slug: string } | null;
  providerReference?: { name: string; code: string; logoUrl?: string | null } | null;
}

export interface ProductQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  brand?: string;
  category?: string;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc';
}
