-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AdminRole" AS ENUM ('ADMIN', 'SUPER_ADMIN');

-- CreateTable
CREATE TABLE "brands" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "logoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "subtitle" VARCHAR(255),
    "description" TEXT NOT NULL,
    "basePrice" DECIMAL(10,2) NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 4.5,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variants" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sku" VARCHAR(100) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "colorName" VARCHAR(50),
    "colorHex" VARCHAR(10),
    "storage" VARCHAR(50),
    "price" DECIMAL(10,2) NOT NULL,
    "mrp" DECIMAL(10,2) NOT NULL,
    "stockQuantity" INTEGER NOT NULL DEFAULT 10,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_images" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altText" VARCHAR(255),
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_specifications" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "groupName" VARCHAR(100) NOT NULL DEFAULT 'General',
    "key" VARCHAR(100) NOT NULL,
    "value" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_specifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emi_providers" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "logoUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emi_providers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emi_plans" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "tenureMonths" INTEGER NOT NULL,
    "interestRate" DECIMAL(5,2) NOT NULL,
    "processingFee" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "cashbackAmount" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "minDownPayment" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "isZeroCost" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emi_plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emi_applications" (
    "id" TEXT NOT NULL,
    "applicationNumber" VARCHAR(50) NOT NULL,
    "variantId" TEXT NOT NULL,
    "emiPlanId" TEXT NOT NULL,
    "customerName" VARCHAR(150) NOT NULL,
    "customerEmail" VARCHAR(255) NOT NULL,
    "customerPhone" VARCHAR(20) NOT NULL,
    "panNumberDemo" VARCHAR(10) NOT NULL,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "productNameSnapshot" VARCHAR(255) NOT NULL,
    "variantSnapshot" VARCHAR(255) NOT NULL,
    "providerNameSnapshot" VARCHAR(100) NOT NULL,
    "skuSnapshot" VARCHAR(100) NOT NULL,
    "principalAmount" DECIMAL(10,2) NOT NULL,
    "interestRateSnapshot" DECIMAL(5,2) NOT NULL,
    "tenureMonthsSnapshot" INTEGER NOT NULL,
    "monthlyAmountSnapshot" DECIMAL(10,2) NOT NULL,
    "cashbackSnapshot" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "totalPayableSnapshot" DECIMAL(10,2) NOT NULL,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emi_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fullName" VARCHAR(150) NOT NULL,
    "role" "AdminRole" NOT NULL DEFAULT 'ADMIN',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "adminUserId" TEXT,
    "action" VARCHAR(100) NOT NULL,
    "entityType" VARCHAR(50) NOT NULL,
    "entityId" VARCHAR(100) NOT NULL,
    "beforeState" JSONB,
    "afterState" JSONB,
    "ipAddress" VARCHAR(45),
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "brands_name_key" ON "brands"("name");
CREATE UNIQUE INDEX "brands_slug_key" ON "brands"("slug");
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");
CREATE INDEX "idx_product_slug" ON "products"("slug");
CREATE INDEX "idx_product_cat_brand_published" ON "products"("categoryId", "brandId", "isPublished");
CREATE UNIQUE INDEX "product_variants_sku_key" ON "product_variants"("sku");
CREATE INDEX "idx_variant_product_active" ON "product_variants"("productId", "isActive");
CREATE INDEX "idx_variant_sku" ON "product_variants"("sku");
CREATE INDEX "idx_image_variant_order" ON "product_images"("variantId", "displayOrder");
CREATE INDEX "idx_spec_variant_order" ON "product_specifications"("variantId", "displayOrder");
CREATE UNIQUE INDEX "uq_variant_spec_key" ON "product_specifications"("variantId", "key");
CREATE UNIQUE INDEX "emi_providers_name_key" ON "emi_providers"("name");
CREATE UNIQUE INDEX "emi_providers_code_key" ON "emi_providers"("code");
CREATE INDEX "idx_provider_code_active" ON "emi_providers"("code", "isActive");
CREATE INDEX "idx_plan_variant_provider_active" ON "emi_plans"("variantId", "providerId", "isActive");
CREATE UNIQUE INDEX "emi_applications_applicationNumber_key" ON "emi_applications"("applicationNumber");
CREATE INDEX "idx_app_number" ON "emi_applications"("applicationNumber");
CREATE INDEX "idx_app_status_date" ON "emi_applications"("status", "appliedAt");
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");
CREATE INDEX "idx_audit_admin_date" ON "audit_logs"("adminUserId", "createdAt");
CREATE INDEX "idx_audit_entity" ON "audit_logs"("entityType", "entityId");

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "products" ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "product_specifications" ADD CONSTRAINT "product_specifications_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "emi_plans" ADD CONSTRAINT "emi_plans_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "emi_plans" ADD CONSTRAINT "emi_plans_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "emi_providers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "emi_applications" ADD CONSTRAINT "emi_applications_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "product_variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "emi_applications" ADD CONSTRAINT "emi_applications_emiPlanId_fkey" FOREIGN KEY ("emiPlanId") REFERENCES "emi_plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_adminUserId_fkey" FOREIGN KEY ("adminUserId") REFERENCES "admin_users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
