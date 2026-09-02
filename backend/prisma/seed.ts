import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting FinEmi Marketplace database seed...');

  // 1. Seed Brands
  const apple = await prisma.brand.upsert({
    where: { slug: 'apple' },
    update: {},
    create: {
      name: 'Apple',
      slug: 'apple',
      logoUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=200&q=80',
    },
  });

  const samsung = await prisma.brand.upsert({
    where: { slug: 'samsung' },
    update: {},
    create: {
      name: 'Samsung',
      slug: 'samsung',
      logoUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=200&q=80',
    },
  });

  const sony = await prisma.brand.upsert({
    where: { slug: 'sony' },
    update: {},
    create: {
      name: 'Sony',
      slug: 'sony',
      logoUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=200&q=80',
    },
  });

  // 2. Seed Categories
  const smartphones = await prisma.category.upsert({
    where: { slug: 'smartphones' },
    update: {},
    create: {
      name: 'Smartphones',
      slug: 'smartphones',
      description: 'Flagship mobile devices with high-speed processors and advanced camera systems.',
    },
  });

  const laptops = await prisma.category.upsert({
    where: { slug: 'laptops' },
    update: {},
    create: {
      name: 'Laptops',
      slug: 'laptops',
      description: 'High-performance computers for productivity, creative work, and software engineering.',
    },
  });

  const audio = await prisma.category.upsert({
    where: { slug: 'audio' },
    update: {},
    create: {
      name: 'Audio',
      slug: 'audio',
      description: 'Premium wireless headphones and sound gear with active noise cancellation.',
    },
  });

  // 3. Seed EMI Providers
  const hdfc = await prisma.eMIProvider.upsert({
    where: { code: 'HDFC_BANK' },
    update: {},
    create: {
      name: 'HDFC Bank',
      code: 'HDFC_BANK',
      logoUrl: 'https://assets.1fi.in/banks/hdfc.svg',
      isActive: true,
    },
  });

  const icici = await prisma.eMIProvider.upsert({
    where: { code: 'ICICI_BANK' },
    update: {},
    create: {
      name: 'ICICI Bank',
      code: 'ICICI_BANK',
      logoUrl: 'https://assets.1fi.in/banks/icici.svg',
      isActive: true,
    },
  });

  const onefi = await prisma.eMIProvider.upsert({
    where: { code: 'ONEFI_CREDIT' },
    update: {},
    create: {
      name: '1Fi Credit',
      code: 'ONEFI_CREDIT',
      logoUrl: 'https://assets.1fi.in/banks/1fi.svg',
      isActive: true,
    },
  });

  // Helper to upsert a product with variants, images, specs, and EMI plans
  // Product 1: iPhone 15 Pro
  const iphone15Pro = await prisma.product.upsert({
    where: { slug: 'apple-iphone-15-pro' },
    update: {},
    create: {
      title: 'Apple iPhone 15 Pro',
      slug: 'apple-iphone-15-pro',
      subtitle: 'Forged in titanium. Powered by A17 Pro.',
      description: 'iPhone 15 Pro features a Grade 5 titanium design, A17 Pro chip with 6-core GPU, Customizable Action Button, and a powerful 48MP camera system with 3x optical zoom.',
      basePrice: 134900.00,
      rating: 4.8,
      reviewCount: 142,
      isPublished: true,
      brandId: apple.id,
      categoryId: smartphones.id,
    },
  });

  // Variant 1.1: Natural Titanium 128GB
  const vIphoneNat128 = await prisma.productVariant.upsert({
    where: { sku: 'IP15P-128-NAT' },
    update: {},
    create: {
      productId: iphone15Pro.id,
      sku: 'IP15P-128-NAT',
      title: 'iPhone 15 Pro (Natural Titanium, 128GB)',
      colorName: 'Natural Titanium',
      colorHex: '#888783',
      storage: '128GB',
      price: 134900.00,
      mrp: 144900.00,
      stockQuantity: 15,
      isDefault: true,
      isActive: true,
    },
  });

  // Variant 1.2: Blue Titanium 256GB
  const vIphoneBlu256 = await prisma.productVariant.upsert({
    where: { sku: 'IP15P-256-BLU' },
    update: {},
    create: {
      productId: iphone15Pro.id,
      sku: 'IP15P-256-BLU',
      title: 'iPhone 15 Pro (Blue Titanium, 256GB)',
      colorName: 'Blue Titanium',
      colorHex: '#2f3b4c',
      storage: '256GB',
      price: 144900.00,
      mrp: 154900.00,
      stockQuantity: 10,
      isDefault: false,
      isActive: true,
    },
  });

  // Product 2: Samsung Galaxy S24 Ultra
  const s24Ultra = await prisma.product.upsert({
    where: { slug: 'samsung-galaxy-s24-ultra' },
    update: {},
    create: {
      title: 'Samsung Galaxy S24 Ultra',
      slug: 'samsung-galaxy-s24-ultra',
      subtitle: 'Galaxy AI is here. Epic, just like that.',
      description: 'Galaxy S24 Ultra features a durable titanium frame, built-in S Pen, Snapdragon 8 Gen 3 for Galaxy, and an extraordinary 200MP camera system with Quad Telephoto zoom.',
      basePrice: 129999.00,
      rating: 4.7,
      reviewCount: 98,
      isPublished: true,
      brandId: samsung.id,
      categoryId: smartphones.id,
    },
  });

  const vS24Gray256 = await prisma.productVariant.upsert({
    where: { sku: 'S24U-256-GRY' },
    update: {},
    create: {
      productId: s24Ultra.id,
      sku: 'S24U-256-GRY',
      title: 'Galaxy S24 Ultra (Titanium Gray, 256GB)',
      colorName: 'Titanium Gray',
      colorHex: '#717378',
      storage: '256GB',
      price: 129999.00,
      mrp: 134999.00,
      stockQuantity: 12,
      isDefault: true,
      isActive: true,
    },
  });

  const vS24Black512 = await prisma.productVariant.upsert({
    where: { sku: 'S24U-512-BLK' },
    update: {},
    create: {
      productId: s24Ultra.id,
      sku: 'S24U-512-BLK',
      title: 'Galaxy S24 Ultra (Titanium Black, 512GB)',
      colorName: 'Titanium Black',
      colorHex: '#222325',
      storage: '512GB',
      price: 139999.00,
      mrp: 144999.00,
      stockQuantity: 8,
      isDefault: false,
      isActive: true,
    },
  });

  // Product 3: MacBook Air M3
  const macbookAir = await prisma.product.upsert({
    where: { slug: 'apple-macbook-air-m3' },
    update: {},
    create: {
      title: 'Apple MacBook Air M3',
      slug: 'apple-macbook-air-m3',
      subtitle: 'Lean. Mean. M3 machine.',
      description: 'The 13-inch MacBook Air with M3 chip is ultra-portable, delivers up to 18 hours of battery life, supports two external displays, and features Liquid Retina display.',
      basePrice: 114900.00,
      rating: 4.9,
      reviewCount: 64,
      isPublished: true,
      brandId: apple.id,
      categoryId: laptops.id,
    },
  });

  const vMacMid256 = await prisma.productVariant.upsert({
    where: { sku: 'MBA-M3-256-MID' },
    update: {},
    create: {
      productId: macbookAir.id,
      sku: 'MBA-M3-256-MID',
      title: 'MacBook Air M3 (Midnight, 8GB RAM, 256GB SSD)',
      colorName: 'Midnight',
      colorHex: '#1e242b',
      storage: '256GB',
      price: 114900.00,
      mrp: 119900.00,
      stockQuantity: 20,
      isDefault: true,
      isActive: true,
    },
  });

  const vMacStl512 = await prisma.productVariant.upsert({
    where: { sku: 'MBA-M3-512-STL' },
    update: {},
    create: {
      productId: macbookAir.id,
      sku: 'MBA-M3-512-STL',
      title: 'MacBook Air M3 (Starlight, 16GB RAM, 512GB SSD)',
      colorName: 'Starlight',
      colorHex: '#e3d7c7',
      storage: '512GB',
      price: 134900.00,
      mrp: 139900.00,
      stockQuantity: 14,
      isDefault: false,
      isActive: true,
    },
  });

  // Product 4: Sony WH-1000XM5
  const sonyHeadphones = await prisma.product.upsert({
    where: { slug: 'sony-wh-1000xm5' },
    update: {},
    create: {
      title: 'Sony WH-1000XM5 Wireless Headphones',
      slug: 'sony-wh-1000xm5',
      subtitle: 'Your world. Nothing else.',
      description: 'Industry-leading noise canceling with two processors and 8 microphones. Magnificent sound quality engineered with the new Integrated Processor V1.',
      basePrice: 29990.00,
      rating: 4.6,
      reviewCount: 210,
      isPublished: true,
      brandId: sony.id,
      categoryId: audio.id,
    },
  });

  const vSonySilver = await prisma.productVariant.upsert({
    where: { sku: 'WH1000XM5-SLV' },
    update: {},
    create: {
      productId: sonyHeadphones.id,
      sku: 'WH1000XM5-SLV',
      title: 'Sony WH-1000XM5 (Silver)',
      colorName: 'Silver',
      colorHex: '#d8d8d8',
      storage: 'N/A',
      price: 29990.00,
      mrp: 34990.00,
      stockQuantity: 25,
      isDefault: true,
      isActive: true,
    },
  });

  const vSonyBlack = await prisma.productVariant.upsert({
    where: { sku: 'WH1000XM5-BLK' },
    update: {},
    create: {
      productId: sonyHeadphones.id,
      sku: 'WH1000XM5-BLK',
      title: 'Sony WH-1000XM5 (Black)',
      colorName: 'Black',
      colorHex: '#181818',
      storage: 'N/A',
      price: 29990.00,
      mrp: 34990.00,
      stockQuantity: 18,
      isDefault: false,
      isActive: true,
    },
  });

  // Seed Product Images
  const sampleImages = [
    { variantId: vIphoneNat128.id, url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80', altText: 'iPhone 15 Pro Natural Titanium Front View', displayOrder: 1, isPrimary: true },
    { variantId: vIphoneNat128.id, url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', altText: 'iPhone 15 Pro Camera Lens Detail', displayOrder: 2, isPrimary: false },
    { variantId: vIphoneBlu256.id, url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80', altText: 'iPhone 15 Pro Blue Titanium Back View', displayOrder: 1, isPrimary: true },
    
    { variantId: vS24Gray256.id, url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80', altText: 'Samsung Galaxy S24 Ultra Titanium Gray Display', displayOrder: 1, isPrimary: true },
    { variantId: vS24Black512.id, url: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80', altText: 'Samsung Galaxy S24 Ultra Black Pen View', displayOrder: 1, isPrimary: true },
    
    { variantId: vMacMid256.id, url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80', altText: 'MacBook Air M3 Open View', displayOrder: 1, isPrimary: true },
    { variantId: vMacStl512.id, url: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80', altText: 'MacBook Air M3 Starlight Side Profile', displayOrder: 1, isPrimary: true },
    
    { variantId: vSonySilver.id, url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80', altText: 'Sony WH-1000XM5 Silver Studio View', displayOrder: 1, isPrimary: true },
    { variantId: vSonyBlack.id, url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', altText: 'Sony WH-1000XM5 Black Studio View', displayOrder: 1, isPrimary: true },
  ];

  for (const img of sampleImages) {
    const existing = await prisma.productImage.findFirst({
      where: { variantId: img.variantId, displayOrder: img.displayOrder },
    });
    if (!existing) {
      await prisma.productImage.create({ data: img });
    }
  }

  // Seed Product Specifications
  const specs = [
    { variantId: vIphoneNat128.id, groupName: 'Display', key: 'Screen Size', value: '6.1 inches Super Retina XDR OLED', displayOrder: 1 },
    { variantId: vIphoneNat128.id, groupName: 'Performance', key: 'Processor', value: 'Apple A17 Pro (3nm)', displayOrder: 2 },
    { variantId: vIphoneNat128.id, groupName: 'Camera', key: 'Main Camera', value: '48MP Main + 12MP Ultra Wide + 12MP Telephoto', displayOrder: 3 },
    { variantId: vIphoneNat128.id, groupName: 'Battery', key: 'Battery Life', value: 'Up to 23 hours video playback', displayOrder: 4 },

    { variantId: vS24Gray256.id, groupName: 'Display', key: 'Screen Size', value: '6.8 inches Dynamic AMOLED 2X', displayOrder: 1 },
    { variantId: vS24Gray256.id, groupName: 'Performance', key: 'Processor', value: 'Snapdragon 8 Gen 3 for Galaxy', displayOrder: 2 },
    { variantId: vS24Gray256.id, groupName: 'Camera', key: 'Main Camera', value: '200MP Main + 50MP Periscope + 12MP Ultra Wide', displayOrder: 3 },

    { variantId: vMacMid256.id, groupName: 'Display', key: 'Screen Size', value: '13.6 inches Liquid Retina', displayOrder: 1 },
    { variantId: vMacMid256.id, groupName: 'Performance', key: 'Chipset', value: 'Apple M3 chip (8-core CPU, 8-core GPU)', displayOrder: 2 },
    { variantId: vMacMid256.id, groupName: 'Memory', key: 'Unified Memory', value: '8GB Unified RAM', displayOrder: 3 },

    { variantId: vSonySilver.id, groupName: 'Audio', key: 'Noise Cancelling', value: 'Industry-leading Auto NC Optimizer', displayOrder: 1 },
    { variantId: vSonySilver.id, groupName: 'Battery', key: 'Playtime', value: 'Up to 30 hours continuous playback', displayOrder: 2 },
  ];

  for (const s of specs) {
    await prisma.productSpecification.upsert({
      where: { uq_variant_spec_key: { variantId: s.variantId, key: s.key } },
      update: { value: s.value, groupName: s.groupName, displayOrder: s.displayOrder },
      create: s,
    });
  }

  // Seed EMI Plans for variants (3–6 plans per variant)
  const variants = [vIphoneNat128, vIphoneBlu256, vS24Gray256, vS24Black512, vMacMid256, vMacStl512, vSonySilver, vSonyBlack];
  const providers = [hdfc, icici, onefi];

  for (const variant of variants) {
    const plansToCreate = [
      { tenureMonths: 6, interestRate: 0.00, isZeroCost: true, cashbackAmount: 3000.00, processingFee: 199.00, providerId: hdfc.id },
      { tenureMonths: 12, interestRate: 0.00, isZeroCost: true, cashbackAmount: 1500.00, processingFee: 299.00, providerId: hdfc.id },
      { tenureMonths: 24, interestRate: 14.50, isZeroCost: false, cashbackAmount: 0.00, processingFee: 499.00, providerId: hdfc.id },
      
      { tenureMonths: 6, interestRate: 0.00, isZeroCost: true, cashbackAmount: 2500.00, processingFee: 199.00, providerId: icici.id },
      { tenureMonths: 12, interestRate: 13.50, isZeroCost: false, cashbackAmount: 1000.00, processingFee: 199.00, providerId: icici.id },
      
      { tenureMonths: 3, interestRate: 0.00, isZeroCost: true, cashbackAmount: 2000.00, processingFee: 0.00, providerId: onefi.id },
      { tenureMonths: 9, interestRate: 12.00, isZeroCost: false, cashbackAmount: 500.00, processingFee: 99.00, providerId: onefi.id },
    ];

    for (const plan of plansToCreate) {
      const existing = await prisma.eMIPlan.findFirst({
        where: {
          variantId: variant.id,
          providerId: plan.providerId,
          tenureMonths: plan.tenureMonths,
          isZeroCost: plan.isZeroCost,
        },
      });

      if (!existing) {
        await prisma.eMIPlan.create({
          data: {
            variantId: variant.id,
            providerId: plan.providerId,
            tenureMonths: plan.tenureMonths,
            interestRate: plan.interestRate,
            isZeroCost: plan.isZeroCost,
            cashbackAmount: plan.cashbackAmount,
            processingFee: plan.processingFee,
            isActive: true,
          },
        });
      }
    }
  }

  // Seed Admin User
  // Password hash for 'Admin@12345'
  const defaultAdminPasswordHash = '$2a$12$R.9t9X4nS8W2j8y2r.y5p.eK5v9c1zX4k7W0f1v2u3t4r5s6q7w8e';
  
  await prisma.adminUser.upsert({
    where: { email: 'admin@1fi.in' },
    update: {},
    create: {
      email: 'admin@1fi.in',
      passwordHash: defaultAdminPasswordHash,
      fullName: 'FinEmi Master Admin',
      role: 'SUPER_ADMIN',
      isActive: true,
    },
  });

  console.log('✅ FinEmi Marketplace database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
