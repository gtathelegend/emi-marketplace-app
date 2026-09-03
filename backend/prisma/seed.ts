import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting FinEmi Marketplace expanded database seed (ultra-fast bulk)...');

  // 1. Seed Brands
  const brandData = [
    { name: 'Apple', slug: 'apple', logoUrl: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=200&q=80' },
    { name: 'Samsung', slug: 'samsung', logoUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=200&q=80' },
    { name: 'Sony', slug: 'sony', logoUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=200&q=80' },
    { name: 'Google', slug: 'google', logoUrl: 'https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&w=200&q=80' },
    { name: 'OnePlus', slug: 'oneplus', logoUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=200&q=80' },
    { name: 'Dell', slug: 'dell', logoUrl: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=200&q=80' },
    { name: 'Lenovo', slug: 'lenovo', logoUrl: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=200&q=80' },
    { name: 'Bose', slug: 'bose', logoUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80' },
  ];

  const brandMap = new Map<string, string>();
  for (const b of brandData) {
    const res = await prisma.brand.upsert({
      where: { slug: b.slug },
      update: { name: b.name, logoUrl: b.logoUrl },
      create: b,
    });
    brandMap.set(b.slug, res.id);
  }

  // 2. Seed Categories
  const categoryData = [
    { name: 'Smartphones', slug: 'smartphones', description: 'Flagship mobile devices with high-speed processors and advanced camera systems.' },
    { name: 'Laptops', slug: 'laptops', description: 'High-performance computers for productivity, creative work, and software engineering.' },
    { name: 'Audio', slug: 'audio', description: 'Premium wireless headphones and sound gear with active noise cancellation.' },
    { name: 'Tablets', slug: 'tablets', description: 'Versatile touchscreen tablets for work, creative sketching, and entertainment.' },
    { name: 'Smartwatches', slug: 'smartwatches', description: 'Fitness tracking and smart notifications right on your wrist.' },
    { name: 'Televisions', slug: 'tvs', description: 'Ultra-high definition Smart TVs with immersive audio and OLED/QLED displays.' },
    { name: 'Gaming', slug: 'gaming', description: 'Next-gen gaming consoles and high-performance hardware.' },
  ];

  const categoryMap = new Map<string, string>();
  for (const c of categoryData) {
    const res = await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description },
      create: c,
    });
    categoryMap.set(c.slug, res.id);
  }

  // 3. Seed EMI Providers
  const providerData = [
    { name: 'HDFC Bank', code: 'HDFC_BANK', logoUrl: '/brand/hdfc.svg' },
    { name: 'ICICI Bank', code: 'ICICI_BANK', logoUrl: '/brand/icici.svg' },
    { name: '1Fi Credit', code: 'ONEFI_CREDIT', logoUrl: '/brand/1fi.svg' },
    { name: 'Axis Bank', code: 'AXIS_BANK', logoUrl: '/brand/axis.svg' },
  ];

  const providerMap = new Map<string, string>();
  for (const p of providerData) {
    const res = await prisma.eMIProvider.upsert({
      where: { code: p.code },
      update: { name: p.name, logoUrl: p.logoUrl, isActive: true },
      create: { ...p, isActive: true },
    });
    providerMap.set(p.code, res.id);
  }

  // 4. Product Catalog Definition
  const productsToSeed = [
    {
      title: 'Apple iPhone 15 Pro',
      slug: 'apple-iphone-15-pro',
      subtitle: 'Forged in titanium. Powered by A17 Pro.',
      description: 'iPhone 15 Pro features a Grade 5 titanium design, A17 Pro chip with 6-core GPU, Customizable Action Button, and a powerful 48MP camera system with 3x optical zoom.',
      basePrice: 134900.00,
      rating: 4.8,
      reviewCount: 142,
      brandSlug: 'apple',
      categorySlug: 'smartphones',
      variants: [
        {
          sku: 'IP15P-128-NAT',
          title: 'iPhone 15 Pro (Natural Titanium, 128GB)',
          colorName: 'Natural Titanium',
          colorHex: '#888783',
          storage: '128GB',
          price: 134900.00,
          mrp: 144900.00,
          stockQuantity: 15,
          isDefault: true,
          images: [
            { url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80', altText: 'iPhone 15 Pro Natural Titanium Front', isPrimary: true },
            { url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', altText: 'iPhone 15 Pro Camera Lens Detail', isPrimary: false },
          ],
          specs: [
            { groupName: 'Display', key: 'Screen Size', value: '6.1 inches Super Retina XDR OLED' },
            { groupName: 'Performance', key: 'Processor', value: 'Apple A17 Pro (3nm)' },
            { groupName: 'Camera', key: 'Main Camera', value: '48MP Main + 12MP Ultra Wide + 12MP Telephoto' },
            { groupName: 'Battery', key: 'Battery Life', value: 'Up to 23 hours video playback' },
          ],
        },
        {
          sku: 'IP15P-256-BLU',
          title: 'iPhone 15 Pro (Blue Titanium, 256GB)',
          colorName: 'Blue Titanium',
          colorHex: '#2f3b4c',
          storage: '256GB',
          price: 144900.00,
          mrp: 154900.00,
          stockQuantity: 10,
          isDefault: false,
          images: [
            { url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80', altText: 'iPhone 15 Pro Blue Titanium Back', isPrimary: true },
          ],
          specs: [
            { groupName: 'Display', key: 'Screen Size', value: '6.1 inches Super Retina XDR OLED' },
            { groupName: 'Performance', key: 'Processor', value: 'Apple A17 Pro (3nm)' },
          ],
        },
        {
          sku: 'IP15P-512-BLK',
          title: 'iPhone 15 Pro (Black Titanium, 512GB)',
          colorName: 'Black Titanium',
          colorHex: '#1d1d1f',
          storage: '512GB',
          price: 164900.00,
          mrp: 174900.00,
          stockQuantity: 8,
          isDefault: false,
          images: [
            { url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80', altText: 'iPhone 15 Pro Black Titanium', isPrimary: true },
          ],
          specs: [
            { groupName: 'Display', key: 'Screen Size', value: '6.1 inches Super Retina XDR OLED' },
            { groupName: 'Performance', key: 'Processor', value: 'Apple A17 Pro (3nm)' },
          ],
        },
      ],
    },
    {
      title: 'Samsung Galaxy S24 Ultra',
      slug: 'samsung-galaxy-s24-ultra',
      subtitle: 'Galaxy AI is here. Epic, just like that.',
      description: 'Galaxy S24 Ultra features a durable titanium frame, built-in S Pen, Snapdragon 8 Gen 3 for Galaxy, and an extraordinary 200MP camera system with Quad Telephoto zoom.',
      basePrice: 129999.00,
      rating: 4.7,
      reviewCount: 98,
      brandSlug: 'samsung',
      categorySlug: 'smartphones',
      variants: [
        {
          sku: 'S24U-256-GRY',
          title: 'Galaxy S24 Ultra (Titanium Gray, 256GB)',
          colorName: 'Titanium Gray',
          colorHex: '#717378',
          storage: '256GB',
          price: 129999.00,
          mrp: 134999.00,
          stockQuantity: 12,
          isDefault: true,
          images: [
            { url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80', altText: 'Galaxy S24 Ultra Titanium Gray Display', isPrimary: true },
          ],
          specs: [
            { groupName: 'Display', key: 'Screen Size', value: '6.8 inches Dynamic AMOLED 2X' },
            { groupName: 'Performance', key: 'Processor', value: 'Snapdragon 8 Gen 3 for Galaxy' },
            { groupName: 'Camera', key: 'Main Camera', value: '200MP Main + 50MP Periscope + 12MP Ultra Wide' },
          ],
        },
        {
          sku: 'S24U-512-BLK',
          title: 'Galaxy S24 Ultra (Titanium Black, 512GB)',
          colorName: 'Titanium Black',
          colorHex: '#222325',
          storage: '512GB',
          price: 139999.00,
          mrp: 144999.00,
          stockQuantity: 8,
          isDefault: false,
          images: [
            { url: 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80', altText: 'Galaxy S24 Ultra Titanium Black', isPrimary: true },
          ],
          specs: [
            { groupName: 'Display', key: 'Screen Size', value: '6.8 inches Dynamic AMOLED 2X' },
            { groupName: 'Performance', key: 'Processor', value: 'Snapdragon 8 Gen 3 for Galaxy' },
          ],
        },
      ],
    },
    {
      title: 'Google Pixel 9',
      slug: 'google-pixel-9',
      subtitle: 'Gemini AI integrated. Advanced camera experience.',
      description: 'Google Pixel 9 features Tensor G4 processor, 6.3-inch Actua display, advanced dual camera system with AI editing tools, and all-day battery life.',
      basePrice: 79999.00,
      rating: 4.6,
      reviewCount: 76,
      brandSlug: 'google',
      categorySlug: 'smartphones',
      variants: [
        {
          sku: 'PIX9-128-OBS',
          title: 'Google Pixel 9 (Obsidian Black, 128GB)',
          colorName: 'Obsidian Black',
          colorHex: '#262626',
          storage: '128GB',
          price: 79999.00,
          mrp: 84999.00,
          stockQuantity: 18,
          isDefault: true,
          images: [
            { url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80', altText: 'Google Pixel 9 Obsidian Front View', isPrimary: true },
          ],
          specs: [
            { groupName: 'Display', key: 'Screen Size', value: '6.3 inches Actua OLED (120Hz)' },
            { groupName: 'Performance', key: 'Chipset', value: 'Google Tensor G4' },
            { groupName: 'Camera', key: 'Rear Camera', value: '50MP Wide + 48MP Ultrawide' },
          ],
        },
        {
          sku: 'PIX9-256-HAZ',
          title: 'Google Pixel 9 (Hazel Green, 256GB)',
          colorName: 'Hazel Green',
          colorHex: '#727a74',
          storage: '256GB',
          price: 89999.00,
          mrp: 94999.00,
          stockQuantity: 14,
          isDefault: false,
          images: [
            { url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=800&q=80', altText: 'Google Pixel 9 Hazel Back View', isPrimary: true },
          ],
          specs: [
            { groupName: 'Display', key: 'Screen Size', value: '6.3 inches Actua OLED (120Hz)' },
            { groupName: 'Performance', key: 'Chipset', value: 'Google Tensor G4' },
          ],
        },
      ],
    },
    {
      title: 'OnePlus 13',
      slug: 'oneplus-13',
      subtitle: 'Extreme performance with Hasselblad camera system.',
      description: 'OnePlus 13 delivers Snapdragon 8 Elite processor, 2K 120Hz ProXDR display, 100W SUPERVOOC charging, and 50MP triple Hasselblad camera.',
      basePrice: 64999.00,
      rating: 4.7,
      reviewCount: 88,
      brandSlug: 'oneplus',
      categorySlug: 'smartphones',
      variants: [
        {
          sku: 'OP13-256-BLK',
          title: 'OnePlus 13 (Obsidian Black, 256GB)',
          colorName: 'Obsidian Black',
          colorHex: '#1f2022',
          storage: '256GB',
          price: 64999.00,
          mrp: 69999.00,
          stockQuantity: 20,
          isDefault: true,
          images: [
            { url: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80', altText: 'OnePlus 13 Black View', isPrimary: true },
          ],
          specs: [
            { groupName: 'Display', key: 'Screen Size', value: '6.82 inches 2K AMOLED (120Hz)' },
            { groupName: 'Performance', key: 'Processor', value: 'Snapdragon 8 Elite' },
            { groupName: 'Charging', key: 'Fast Charge', value: '100W SUPERVOOC' },
          ],
        },
        {
          sku: 'OP13-512-GRN',
          title: 'OnePlus 13 (Emerald Green, 512GB)',
          colorName: 'Emerald Green',
          colorHex: '#1e4034',
          storage: '512GB',
          price: 74999.00,
          mrp: 79999.00,
          stockQuantity: 12,
          isDefault: false,
          images: [
            { url: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&w=800&q=80', altText: 'OnePlus 13 Emerald Green', isPrimary: true },
          ],
          specs: [
            { groupName: 'Display', key: 'Screen Size', value: '6.82 inches 2K AMOLED (120Hz)' },
          ],
        },
      ],
    },
    {
      title: 'Apple MacBook Air M3',
      slug: 'apple-macbook-air-m3',
      subtitle: 'Lean. Mean. M3 machine.',
      description: 'The 13-inch MacBook Air with M3 chip is ultra-portable, delivers up to 18 hours of battery life, supports two external displays, and features Liquid Retina display.',
      basePrice: 114900.00,
      rating: 4.9,
      reviewCount: 64,
      brandSlug: 'apple',
      categorySlug: 'laptops',
      variants: [
        {
          sku: 'MBA-M3-256-MID',
          title: 'MacBook Air M3 (Midnight, 8GB RAM, 256GB SSD)',
          colorName: 'Midnight',
          colorHex: '#1e242b',
          storage: '256GB',
          price: 114900.00,
          mrp: 119900.00,
          stockQuantity: 20,
          isDefault: true,
          images: [
            { url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80', altText: 'MacBook Air M3 Open View', isPrimary: true },
          ],
          specs: [
            { groupName: 'Display', key: 'Screen Size', value: '13.6 inches Liquid Retina' },
            { groupName: 'Performance', key: 'Chipset', value: 'Apple M3 chip (8-core CPU, 8-core GPU)' },
            { groupName: 'Memory', key: 'Unified Memory', value: '8GB Unified RAM' },
          ],
        },
        {
          sku: 'MBA-M3-512-STL',
          title: 'MacBook Air M3 (Starlight, 16GB RAM, 512GB SSD)',
          colorName: 'Starlight',
          colorHex: '#e3d7c7',
          storage: '512GB',
          price: 134900.00,
          mrp: 139900.00,
          stockQuantity: 14,
          isDefault: false,
          images: [
            { url: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80', altText: 'MacBook Air M3 Starlight Profile', isPrimary: true },
          ],
          specs: [
            { groupName: 'Display', key: 'Screen Size', value: '13.6 inches Liquid Retina' },
            { groupName: 'Memory', key: 'Unified Memory', value: '16GB Unified RAM' },
          ],
        },
      ],
    },
    {
      title: 'Dell XPS 14',
      slug: 'dell-xps-14',
      subtitle: 'Iconic design with Intel Core Ultra processor.',
      description: 'Dell XPS 14 features a CNC machined aluminum body, 14.5-inch 3.2K OLED touch display, Intel Core Ultra 7 processor, and NVIDIA GeForce RTX graphics.',
      basePrice: 169990.00,
      rating: 4.7,
      reviewCount: 52,
      brandSlug: 'dell',
      categorySlug: 'laptops',
      variants: [
        {
          sku: 'XPS14-512-SLV',
          title: 'Dell XPS 14 (Platinum Silver, 16GB RAM, 512GB SSD)',
          colorName: 'Platinum Silver',
          colorHex: '#c0c0c0',
          storage: '512GB',
          price: 169990.00,
          mrp: 179990.00,
          stockQuantity: 10,
          isDefault: true,
          images: [
            { url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80', altText: 'Dell XPS 14 Front Display', isPrimary: true },
          ],
          specs: [
            { groupName: 'Display', key: 'Screen Size', value: '14.5 inches 3.2K OLED Touch' },
            { groupName: 'Processor', key: 'CPU', value: 'Intel Core Ultra 7 155H' },
            { groupName: 'Graphics', key: 'GPU', value: 'NVIDIA GeForce RTX 4050' },
          ],
        },
        {
          sku: 'XPS14-1TB-GRF',
          title: 'Dell XPS 14 (Graphite Black, 32GB RAM, 1TB SSD)',
          colorName: 'Graphite Black',
          colorHex: '#2d2d2d',
          storage: '1TB',
          price: 199990.00,
          mrp: 209990.00,
          stockQuantity: 6,
          isDefault: false,
          images: [
            { url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80', altText: 'Dell XPS 14 Graphite Keyboard', isPrimary: true },
          ],
          specs: [
            { groupName: 'Display', key: 'Screen Size', value: '14.5 inches 3.2K OLED Touch' },
            { groupName: 'Memory', key: 'RAM', value: '32GB LPDDR5x' },
          ],
        },
      ],
    },
    {
      title: 'Lenovo Yoga Slim 7i',
      slug: 'lenovo-yoga-slim-7',
      subtitle: 'Ultra-thin AI-boosted laptop for creators.',
      description: 'Lenovo Yoga Slim 7i features Intel Core Ultra 5 processor, 14-inch OLED display, aluminum chassis, rapid charge capability, and Military-grade durability.',
      basePrice: 84990.00,
      rating: 4.6,
      reviewCount: 41,
      brandSlug: 'lenovo',
      categorySlug: 'laptops',
      variants: [
        {
          sku: 'YOGA7-512-GRY',
          title: 'Lenovo Yoga Slim 7i (Luna Grey, 16GB RAM, 512GB SSD)',
          colorName: 'Luna Grey',
          colorHex: '#6b6e70',
          storage: '512GB',
          price: 84990.00,
          mrp: 94990.00,
          stockQuantity: 16,
          isDefault: true,
          images: [
            { url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80', altText: 'Lenovo Yoga Slim 7i Angle View', isPrimary: true },
          ],
          specs: [
            { groupName: 'Display', key: 'Screen Size', value: '14.0 inches WUXGA OLED' },
            { groupName: 'Processor', key: 'CPU', value: 'Intel Core Ultra 5 125H' },
            { groupName: 'Battery', key: 'Battery Life', value: 'Up to 14 hours' },
          ],
        },
        {
          sku: 'YOGA7-1TB-GRY',
          title: 'Lenovo Yoga Slim 7i (Luna Grey, 16GB RAM, 1TB SSD)',
          colorName: 'Luna Grey',
          colorHex: '#6b6e70',
          storage: '1TB',
          price: 99990.00,
          mrp: 109990.00,
          stockQuantity: 10,
          isDefault: false,
          images: [
            { url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80', altText: 'Lenovo Yoga Slim 7i Top View', isPrimary: true },
          ],
          specs: [
            { groupName: 'Display', key: 'Screen Size', value: '14.0 inches WUXGA OLED' },
          ],
        },
      ],
    },
    {
      title: 'Sony WH-1000XM5 Wireless Headphones',
      slug: 'sony-wh-1000xm5',
      subtitle: 'Your world. Nothing else.',
      description: 'Industry-leading noise canceling with two processors and 8 microphones. Magnificent sound quality engineered with the new Integrated Processor V1.',
      basePrice: 29990.00,
      rating: 4.6,
      reviewCount: 210,
      brandSlug: 'sony',
      categorySlug: 'audio',
      variants: [
        {
          sku: 'WH1000XM5-SLV',
          title: 'Sony WH-1000XM5 (Silver)',
          colorName: 'Silver',
          colorHex: '#d8d8d8',
          storage: 'N/A',
          price: 29990.00,
          mrp: 34990.00,
          stockQuantity: 25,
          isDefault: true,
          images: [
            { url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80', altText: 'Sony WH-1000XM5 Silver Studio View', isPrimary: true },
          ],
          specs: [
            { groupName: 'Audio', key: 'Noise Cancelling', value: 'Industry-leading Auto NC Optimizer' },
            { groupName: 'Battery', key: 'Playtime', value: 'Up to 30 hours continuous playback' },
          ],
        },
        {
          sku: 'WH1000XM5-BLK',
          title: 'Sony WH-1000XM5 (Black)',
          colorName: 'Black',
          colorHex: '#181818',
          storage: 'N/A',
          price: 29990.00,
          mrp: 34990.00,
          stockQuantity: 18,
          isDefault: false,
          images: [
            { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', altText: 'Sony WH-1000XM5 Black Studio View', isPrimary: true },
          ],
          specs: [
            { groupName: 'Audio', key: 'Noise Cancelling', value: 'Industry-leading Auto NC Optimizer' },
          ],
        },
      ],
    },
    {
      title: 'Bose QuietComfort Ultra Headphones',
      slug: 'bose-quietcomfort-ultra',
      subtitle: 'World-class noise cancellation with immersive spatial audio.',
      description: 'Bose QuietComfort Ultra headphones deliver breakthrough spatial audio, custom-tuned noise cancellation, and up to 24 hours of battery life.',
      basePrice: 35900.00,
      rating: 4.8,
      reviewCount: 115,
      brandSlug: 'bose',
      categorySlug: 'audio',
      variants: [
        {
          sku: 'QCULT-BLK',
          title: 'Bose QuietComfort Ultra (Black)',
          colorName: 'Black',
          colorHex: '#121212',
          storage: 'N/A',
          price: 35900.00,
          mrp: 39900.00,
          stockQuantity: 15,
          isDefault: true,
          images: [
            { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80', altText: 'Bose QC Ultra Black View', isPrimary: true },
          ],
          specs: [
            { groupName: 'Audio', key: 'Audio Tech', value: 'Bose Immersive Audio & CustomTune' },
            { groupName: 'Connectivity', key: 'Bluetooth', value: 'Bluetooth 5.3' },
            { groupName: 'Battery', key: 'Runtime', value: 'Up to 24 hours' },
          ],
        },
        {
          sku: 'QCULT-WHT',
          title: 'Bose QuietComfort Ultra (White Smoke)',
          colorName: 'White Smoke',
          colorHex: '#e5e5e0',
          storage: 'N/A',
          price: 35900.00,
          mrp: 39900.00,
          stockQuantity: 10,
          isDefault: false,
          images: [
            { url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80', altText: 'Bose QC Ultra White Smoke', isPrimary: true },
          ],
          specs: [
            { groupName: 'Audio', key: 'Audio Tech', value: 'Bose Immersive Audio & CustomTune' },
          ],
        },
      ],
    },
    {
      title: 'Apple iPad Air M2',
      slug: 'apple-ipad-air-m2',
      subtitle: 'Fresh Air. Powered by Apple M2 chip.',
      description: 'iPad Air 11-inch with M2 chip features Liquid Retina display, Apple Pencil Pro support, landscape front camera, and superfast Wi-Fi 6E connectivity.',
      basePrice: 59900.00,
      rating: 4.8,
      reviewCount: 79,
      brandSlug: 'apple',
      categorySlug: 'tablets',
      variants: [
        {
          sku: 'IPADAIR-128-SPG',
          title: 'iPad Air M2 (Space Grey, 128GB)',
          colorName: 'Space Grey',
          colorHex: '#4b4c4e',
          storage: '128GB',
          price: 59900.00,
          mrp: 64900.00,
          stockQuantity: 22,
          isDefault: true,
          images: [
            { url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80', altText: 'iPad Air Space Grey Display', isPrimary: true },
          ],
          specs: [
            { groupName: 'Display', key: 'Screen Size', value: '11-inch Liquid Retina Display' },
            { groupName: 'Performance', key: 'Chipset', value: 'Apple M2 (8-core CPU, 10-core GPU)' },
            { groupName: 'Accessories', key: 'Pencil Support', value: 'Apple Pencil Pro & USB-C' },
          ],
        },
        {
          sku: 'IPADAIR-256-BLU',
          title: 'iPad Air M2 (Blue, 256GB)',
          colorName: 'Blue',
          colorHex: '#8193a8',
          storage: '256GB',
          price: 69900.00,
          mrp: 74900.00,
          stockQuantity: 14,
          isDefault: false,
          images: [
            { url: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80', altText: 'iPad Air Blue Angle View', isPrimary: true },
          ],
          specs: [
            { groupName: 'Display', key: 'Screen Size', value: '11-inch Liquid Retina Display' },
          ],
        },
      ],
    },
    {
      title: 'Samsung Galaxy Tab S9',
      slug: 'samsung-galaxy-tab-s9',
      subtitle: 'Dynamic AMOLED 2X display with inbox S Pen.',
      description: 'Galaxy Tab S9 features IP68 water resistance, Snapdragon 8 Gen 2 for Galaxy, quad speakers tuned by AKG, and long battery life.',
      basePrice: 67999.00,
      rating: 4.7,
      reviewCount: 63,
      brandSlug: 'samsung',
      categorySlug: 'tablets',
      variants: [
        {
          sku: 'TABS9-128-GRF',
          title: 'Galaxy Tab S9 (Graphite, 128GB)',
          colorName: 'Graphite',
          colorHex: '#3a3b3c',
          storage: '128GB',
          price: 67999.00,
          mrp: 72999.00,
          stockQuantity: 18,
          isDefault: true,
          images: [
            { url: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=80', altText: 'Galaxy Tab S9 Graphite Front View', isPrimary: true },
          ],
          specs: [
            { groupName: 'Display', key: 'Screen Size', value: '11.0 inches Dynamic AMOLED 2X' },
            { groupName: 'Performance', key: 'Processor', value: 'Snapdragon 8 Gen 2 for Galaxy' },
            { groupName: 'Durability', key: 'Water Resistance', value: 'IP68 Dust & Water Resistant' },
          ],
        },
        {
          sku: 'TABS9-256-BEI',
          title: 'Galaxy Tab S9 (Beige, 256GB)',
          colorName: 'Beige',
          colorHex: '#d8cbb8',
          storage: '256GB',
          price: 76999.00,
          mrp: 81999.00,
          stockQuantity: 11,
          isDefault: false,
          images: [
            { url: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=80', altText: 'Galaxy Tab S9 Beige Back View', isPrimary: true },
          ],
          specs: [
            { groupName: 'Display', key: 'Screen Size', value: '11.0 inches Dynamic AMOLED 2X' },
          ],
        },
      ],
    },
    {
      title: 'Apple Watch Series 9',
      slug: 'apple-watch-series-9',
      subtitle: 'Smarter. Brighter. Mightier. Featuring Double Tap.',
      description: 'Apple Watch Series 9 powered by S9 SiP, featuring Double Tap gesture control, brighter 2000-nit display, faster on-device Siri processing, and advanced health sensors.',
      basePrice: 41900.00,
      rating: 4.8,
      reviewCount: 94,
      brandSlug: 'apple',
      categorySlug: 'smartwatches',
      variants: [
        {
          sku: 'AWS9-41-MID',
          title: 'Apple Watch Series 9 (Midnight, 41mm GPS)',
          colorName: 'Midnight',
          colorHex: '#1c2128',
          storage: '64GB',
          price: 41900.00,
          mrp: 44900.00,
          stockQuantity: 20,
          isDefault: true,
          images: [
            { url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80', altText: 'Apple Watch Series 9 Midnight', isPrimary: true },
          ],
          specs: [
            { groupName: 'Display', key: 'Brightness', value: 'Always-On Retina up to 2000 nits' },
            { groupName: 'Processor', key: 'Chip', value: 'S9 SiP with 4-core Neural Engine' },
            { groupName: 'Sensors', key: 'Health Tracking', value: 'ECG, Blood Oxygen, Temperature Sensing' },
          ],
        },
        {
          sku: 'AWS9-45-SLV',
          title: 'Apple Watch Series 9 (Silver, 45mm GPS)',
          colorName: 'Silver',
          colorHex: '#e0e0e0',
          storage: '64GB',
          price: 44900.00,
          mrp: 47900.00,
          stockQuantity: 15,
          isDefault: false,
          images: [
            { url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80', altText: 'Apple Watch Series 9 Silver', isPrimary: true },
          ],
          specs: [
            { groupName: 'Display', key: 'Brightness', value: 'Always-On Retina up to 2000 nits' },
          ],
        },
      ],
    },
    {
      title: 'Samsung Galaxy Watch 6',
      slug: 'samsung-galaxy-watch-6',
      subtitle: 'Advanced sleep coaching and personalized HR zones.',
      description: 'Galaxy Watch 6 features a 20% larger display, slimmer bezel, Sapphire Crystal glass, advanced body composition analysis, heart rate alert, and ECG tracking.',
      basePrice: 26999.00,
      rating: 4.6,
      reviewCount: 71,
      brandSlug: 'samsung',
      categorySlug: 'smartwatches',
      variants: [
        {
          sku: 'GW6-40-BLK',
          title: 'Galaxy Watch 6 (Graphite, 40mm Bluetooth)',
          colorName: 'Graphite',
          colorHex: '#252525',
          storage: '16GB',
          price: 26999.00,
          mrp: 29999.00,
          stockQuantity: 24,
          isDefault: true,
          images: [
            { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80', altText: 'Galaxy Watch 6 Graphite', isPrimary: true },
          ],
          specs: [
            { groupName: 'Display', key: 'Screen Size', value: '1.3 inches Super AMOLED' },
            { groupName: 'Fitness', key: 'Sensors', value: 'BioActive Sensor (HR + BIA + ECG)' },
          ],
        },
        {
          sku: 'GW6-44-SLV',
          title: 'Galaxy Watch 6 (Silver, 44mm Bluetooth)',
          colorName: 'Silver',
          colorHex: '#cccccc',
          storage: '16GB',
          price: 29999.00,
          mrp: 32999.00,
          stockQuantity: 16,
          isDefault: false,
          images: [
            { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80', altText: 'Galaxy Watch 6 Silver', isPrimary: true },
          ],
          specs: [
            { groupName: 'Display', key: 'Screen Size', value: '1.5 inches Super AMOLED' },
          ],
        },
      ],
    },
    {
      title: 'Sony Bravia XR 55" 4K Google TV',
      slug: 'sony-bravia-xr-4k',
      subtitle: 'Cognitive Processor XR with OLED contrast.',
      description: 'Sony Bravia XR 55-inch 4K HDR OLED TV features Cognitive Processor XR, Acoustic Surface Audio+, XR OLED Contrast Pro, and Google TV integration.',
      basePrice: 149990.00,
      rating: 4.9,
      reviewCount: 38,
      brandSlug: 'sony',
      categorySlug: 'tvs',
      variants: [
        {
          sku: 'BRAVIA55-4K-BLK',
          title: 'Sony Bravia XR (55-Inch 4K OLED)',
          colorName: 'Black',
          colorHex: '#111111',
          storage: '32GB',
          price: 149990.00,
          mrp: 169990.00,
          stockQuantity: 8,
          isDefault: true,
          images: [
            { url: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80', altText: 'Sony Bravia XR 55 Inch TV Front View', isPrimary: true },
          ],
          specs: [
            { groupName: 'Display', key: 'Panel Type', value: '55-inch 4K HDR OLED (120Hz)' },
            { groupName: 'Audio', key: 'Sound Output', value: '50W Acoustic Surface Audio+' },
            { groupName: 'Gaming', key: 'HDMI 2.1', value: '4K/120fps, VRR, ALLM' },
          ],
        },
        {
          sku: 'BRAVIA65-4K-BLK',
          title: 'Sony Bravia XR (65-Inch 4K OLED)',
          colorName: 'Black',
          colorHex: '#111111',
          storage: '32GB',
          price: 199990.00,
          mrp: 229990.00,
          stockQuantity: 5,
          isDefault: false,
          images: [
            { url: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=800&q=80', altText: 'Sony Bravia XR 65 Inch TV Front View', isPrimary: true },
          ],
          specs: [
            { groupName: 'Display', key: 'Panel Type', value: '65-inch 4K HDR OLED (120Hz)' },
          ],
        },
      ],
    },
    {
      title: 'Sony PlayStation 5 Slim Console',
      slug: 'sony-playstation-5-console',
      subtitle: 'Play Has No Limits. Slimmer design with 1TB SSD.',
      description: 'The PS5 Slim console unleashes new gaming possibilities with ultra-high speed SSD, haptic feedback on DualSense wireless controller, 3D Audio, and 4K gaming.',
      basePrice: 54990.00,
      rating: 4.9,
      reviewCount: 180,
      brandSlug: 'sony',
      categorySlug: 'gaming',
      variants: [
        {
          sku: 'PS5-SLIM-DISC',
          title: 'PlayStation 5 Slim (Disc Edition, 1TB SSD)',
          colorName: 'White',
          colorHex: '#f0f0f0',
          storage: '1TB',
          price: 54990.00,
          mrp: 59990.00,
          stockQuantity: 18,
          isDefault: true,
          images: [
            { url: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80', altText: 'PlayStation 5 Slim Disc Edition', isPrimary: true },
          ],
          specs: [
            { groupName: 'Storage', key: 'Internal Storage', value: '1TB Ultra-High Speed Custom NVMe SSD' },
            { groupName: 'Graphics', key: 'Resolution', value: 'Up to 4K 120Hz with HDR' },
            { groupName: 'Controller', key: 'Included', value: '1x DualSense Wireless Controller' },
          ],
        },
        {
          sku: 'PS5-SLIM-DIG',
          title: 'PlayStation 5 Slim (Digital Edition, 1TB SSD)',
          colorName: 'White',
          colorHex: '#f0f0f0',
          storage: '1TB',
          price: 44990.00,
          mrp: 49990.00,
          stockQuantity: 12,
          isDefault: false,
          images: [
            { url: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=800&q=80', altText: 'PlayStation 5 Slim Digital Edition', isPrimary: true },
          ],
          specs: [
            { groupName: 'Storage', key: 'Internal Storage', value: '1TB Ultra-High Speed Custom NVMe SSD' },
          ],
        },
      ],
    },
  ];

  // Helper template for EMI plans per variant
  const getPlanTemplates = (variantId: string) => [
    { variantId, providerId: providerMap.get('HDFC_BANK')!, tenureMonths: 3, interestRate: 0.00, isZeroCost: true, cashbackAmount: 2000.00, processingFee: 0.00, isActive: true },
    { variantId, providerId: providerMap.get('HDFC_BANK')!, tenureMonths: 6, interestRate: 0.00, isZeroCost: true, cashbackAmount: 3000.00, processingFee: 199.00, isActive: true },
    { variantId, providerId: providerMap.get('HDFC_BANK')!, tenureMonths: 12, interestRate: 0.00, isZeroCost: true, cashbackAmount: 1500.00, processingFee: 299.00, isActive: true },
    { variantId, providerId: providerMap.get('HDFC_BANK')!, tenureMonths: 24, interestRate: 14.50, isZeroCost: false, cashbackAmount: 0.00, processingFee: 499.00, isActive: true },

    { variantId, providerId: providerMap.get('ICICI_BANK')!, tenureMonths: 6, interestRate: 0.00, isZeroCost: true, cashbackAmount: 2500.00, processingFee: 199.00, isActive: true },
    { variantId, providerId: providerMap.get('ICICI_BANK')!, tenureMonths: 9, interestRate: 0.00, isZeroCost: true, cashbackAmount: 1200.00, processingFee: 249.00, isActive: true },
    { variantId, providerId: providerMap.get('ICICI_BANK')!, tenureMonths: 18, interestRate: 13.50, isZeroCost: false, cashbackAmount: 1000.00, processingFee: 299.00, isActive: true },

    { variantId, providerId: providerMap.get('ONEFI_CREDIT')!, tenureMonths: 3, interestRate: 0.00, isZeroCost: true, cashbackAmount: 1500.00, processingFee: 0.00, isActive: true },
    { variantId, providerId: providerMap.get('ONEFI_CREDIT')!, tenureMonths: 6, interestRate: 0.00, isZeroCost: true, cashbackAmount: 2000.00, processingFee: 99.00, isActive: true },
    { variantId, providerId: providerMap.get('ONEFI_CREDIT')!, tenureMonths: 12, interestRate: 12.00, isZeroCost: false, cashbackAmount: 500.00, processingFee: 149.00, isActive: true },

    { variantId, providerId: providerMap.get('AXIS_BANK')!, tenureMonths: 6, interestRate: 0.00, isZeroCost: true, cashbackAmount: 2000.00, processingFee: 199.00, isActive: true },
    { variantId, providerId: providerMap.get('AXIS_BANK')!, tenureMonths: 12, interestRate: 13.00, isZeroCost: false, cashbackAmount: 1000.00, processingFee: 299.00, isActive: true },
  ];

  const allVariantIds: string[] = [];
  const imagesToInsert: any[] = [];
  const specsToInsert: any[] = [];

  for (const pData of productsToSeed) {
    const brandId = brandMap.get(pData.brandSlug)!;
    const categoryId = categoryMap.get(pData.categorySlug)!;

    const product = await prisma.product.upsert({
      where: { slug: pData.slug },
      update: {
        title: pData.title,
        subtitle: pData.subtitle,
        description: pData.description,
        basePrice: pData.basePrice,
        rating: pData.rating,
        reviewCount: pData.reviewCount,
        isPublished: true,
        brandId,
        categoryId,
      },
      create: {
        title: pData.title,
        slug: pData.slug,
        subtitle: pData.subtitle,
        description: pData.description,
        basePrice: pData.basePrice,
        rating: pData.rating,
        reviewCount: pData.reviewCount,
        isPublished: true,
        brandId,
        categoryId,
      },
    });

    for (const vData of pData.variants) {
      const variant = await prisma.productVariant.upsert({
        where: { sku: vData.sku },
        update: {
          title: vData.title,
          colorName: vData.colorName,
          colorHex: vData.colorHex,
          storage: vData.storage,
          price: vData.price,
          mrp: vData.mrp,
          stockQuantity: vData.stockQuantity,
          isDefault: vData.isDefault,
          isActive: true,
          productId: product.id,
        },
        create: {
          productId: product.id,
          sku: vData.sku,
          title: vData.title,
          colorName: vData.colorName,
          colorHex: vData.colorHex,
          storage: vData.storage,
          price: vData.price,
          mrp: vData.mrp,
          stockQuantity: vData.stockQuantity,
          isDefault: vData.isDefault,
          isActive: true,
        },
      });

      allVariantIds.push(variant.id);

      // Collect images
      let imgOrder = 1;
      for (const img of vData.images) {
        imagesToInsert.push({
          variantId: variant.id,
          url: img.url,
          altText: img.altText,
          displayOrder: imgOrder,
          isPrimary: img.isPrimary,
        });
        imgOrder++;
      }

      // Collect specs
      let specOrder = 1;
      for (const spec of vData.specs) {
        specsToInsert.push({
          variantId: variant.id,
          groupName: spec.groupName,
          key: spec.key,
          value: spec.value,
          displayOrder: specOrder,
        });
        specOrder++;
      }
    }
  }

  // Fetch existing images to prevent duplication
  const existingImages = await prisma.productImage.findMany({
    select: { variantId: true, displayOrder: true },
  });
  const existingImgSet = new Set(existingImages.map((i) => `${i.variantId}_${i.displayOrder}`));
  const filteredImages = imagesToInsert.filter((i) => !existingImgSet.has(`${i.variantId}_${i.displayOrder}`));

  if (filteredImages.length > 0) {
    await prisma.productImage.createMany({ data: filteredImages, skipDuplicates: true });
  }

  // Fetch existing specs to prevent duplication
  const existingSpecs = await prisma.productSpecification.findMany({
    select: { variantId: true, key: true },
  });
  const existingSpecSet = new Set(existingSpecs.map((s) => `${s.variantId}_${s.key}`));
  const filteredSpecs = specsToInsert.filter((s) => !existingSpecSet.has(`${s.variantId}_${s.key}`));

  if (filteredSpecs.length > 0) {
    await prisma.productSpecification.createMany({ data: filteredSpecs, skipDuplicates: true });
  }

  // Fetch existing EMI plans to prevent duplication
  console.log('⚡ Checking & seeding EMI plans for all variants...');
  const existingPlans = await prisma.eMIPlan.findMany({
    select: { variantId: true, providerId: true, tenureMonths: true, isZeroCost: true },
  });
  const existingPlanSet = new Set(
    existingPlans.map((p) => `${p.variantId}_${p.providerId}_${p.tenureMonths}_${p.isZeroCost}`)
  );

  const plansToInsert: any[] = [];
  for (const variantId of allVariantIds) {
    const templates = getPlanTemplates(variantId);
    for (const t of templates) {
      const key = `${t.variantId}_${t.providerId}_${t.tenureMonths}_${t.isZeroCost}`;
      if (!existingPlanSet.has(key)) {
        plansToInsert.push(t);
        existingPlanSet.add(key);
      }
    }
  }

  if (plansToInsert.length > 0) {
    await prisma.eMIPlan.createMany({ data: plansToInsert, skipDuplicates: true });
  }

  // 5. Seed Master Admin User
  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync('Admin@12345', salt);

  await prisma.adminUser.upsert({
    where: { email: 'admin@1fi.in' },
    update: { passwordHash },
    create: {
      email: 'admin@1fi.in',
      passwordHash,
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
