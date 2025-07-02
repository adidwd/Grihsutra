import { db } from "./db";
import { products, type InsertProduct } from "@shared/schema";

const sampleProducts: InsertProduct[] = [
  // Bedsheets (8 products)
  {
    name: "Premium Cotton Sheets",
    description: "100% Egyptian cotton, 800 thread count for ultimate comfort",
    price: "89.99",
    category: "bedsheets",
    material: "Cotton",
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    featured: true,
    inStock: true,
  },
  {
    name: "Navy Luxury Set",
    description: "Percale weave with cooling comfort technology",
    price: "109.99",
    category: "bedsheets",
    material: "Cotton",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    featured: false,
    inStock: true,
  },
  {
    name: "Blush Stripe Sheets",
    description: "Soft cotton blend, machine washable and durable",
    price: "69.99",
    category: "bedsheets",
    material: "Cotton Blend",
    imageUrl: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    featured: false,
    inStock: true,
  },
  {
    name: "Pure Linen Sheets",
    description: "100% European linen, naturally breathable and temperature regulating",
    price: "129.99",
    category: "bedsheets",
    material: "Linen",
    imageUrl: "https://images.unsplash.com/photo-1521783988139-89397d761dce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    featured: false,
    inStock: true,
  },
  {
    name: "Organic Cotton Set",
    description: "GOTS certified organic cotton, eco-friendly and hypoallergenic",
    price: "94.99",
    category: "bedsheets",
    material: "Organic Cotton",
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    featured: false,
    inStock: true,
  },
  {
    name: "Bamboo Silk Sheets",
    description: "Luxurious bamboo silk blend, naturally antimicrobial",
    price: "149.99",
    category: "bedsheets",
    material: "Bamboo Silk",
    imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    featured: true,
    inStock: true,
  },
  {
    name: "Microfiber Sheets",
    description: "Ultra-soft microfiber, wrinkle-resistant and easy care",
    price: "39.99",
    category: "bedsheets",
    material: "Microfiber",
    imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    featured: false,
    inStock: true,
  },
  {
    name: "Flannel Winter Sheets",
    description: "Cozy brushed flannel for warmth and comfort",
    price: "79.99",
    category: "bedsheets",
    material: "Flannel",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    featured: false,
    inStock: true,
  },

  // Pillow Covers (6 products)
  {
    name: "Geometric Pillow Covers",
    description: "Modern geometric patterns on premium fabric blend",
    price: "24.99",
    category: "pillow-covers",
    material: "Cotton Blend",
    imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    featured: true,
    inStock: true,
  },
  {
    name: "Silk Pillowcase",
    description: "100% mulberry silk, gentle on hair and skin",
    price: "49.99",
    category: "pillow-covers",
    material: "Silk",
    imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    featured: true,
    inStock: true,
  },
  {
    name: "Linen Pillow Shams",
    description: "Natural linen with envelope closure, set of 2",
    price: "34.99",
    category: "pillow-covers",
    material: "Linen",
    imageUrl: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    featured: false,
    inStock: true,
  },
  {
    name: "Velvet Accent Pillows",
    description: "Luxurious velvet texture with hidden zipper",
    price: "39.99",
    category: "pillow-covers",
    material: "Velvet",
    imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    featured: false,
    inStock: true,
  },
  {
    name: "Embroidered Cushion Covers",
    description: "Hand-embroidered designs on soft cotton",
    price: "29.99",
    category: "pillow-covers",
    material: "Cotton",
    imageUrl: "https://images.unsplash.com/photo-1521783988139-89397d761dce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    featured: false,
    inStock: true,
  },
  {
    name: "Memory Foam Pillow Set",
    description: "Cooling gel memory foam with bamboo cover",
    price: "59.99",
    category: "pillow-covers",
    material: "Bamboo",
    imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    featured: false,
    inStock: true,
  },

  // Table Covers (6 products)
  {
    name: "Linen Table Runner",
    description: "Natural linen table runner with sophisticated style",
    price: "39.99",
    category: "table-covers",
    material: "Linen",
    imageUrl: "https://images.unsplash.com/photo-1600494603989-9650cf6ddd3d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    featured: true,
    inStock: true,
  },
  {
    name: "Elegant Tablecloth",
    description: "Premium cotton tablecloth with stain resistance",
    price: "54.99",
    category: "table-covers",
    material: "Cotton",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    featured: false,
    inStock: true,
  },
  {
    name: "Placemat Set",
    description: "Woven placemats with matching napkins, set of 6",
    price: "29.99",
    category: "table-covers",
    material: "Cotton Blend",
    imageUrl: "https://images.unsplash.com/photo-1540932239986-30128078f3c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    featured: false,
    inStock: true,
  },
  {
    name: "Waterproof Table Cover",
    description: "Durable waterproof material with elegant design",
    price: "44.99",
    category: "table-covers",
    material: "Vinyl",
    imageUrl: "https://images.unsplash.com/photo-1521783988139-89397d761dce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    featured: false,
    inStock: true,
  },
  {
    name: "Holiday Table Runner",
    description: "Festive patterns perfect for special occasions",
    price: "34.99",
    category: "table-covers",
    material: "Cotton",
    imageUrl: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    featured: false,
    inStock: true,
  },
  {
    name: "Dining Table Protector",
    description: "Clear protective cover with non-slip backing",
    price: "24.99",
    category: "table-covers",
    material: "Clear Vinyl",
    imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    featured: false,
    inStock: true,
  },
];

export async function seedDatabase() {
  console.log("Seeding database with sample products...");
  
  // Check if products already exist
  const existingProducts = await db.select().from(products);
  if (existingProducts.length > 0) {
    console.log("Database already seeded, skipping...");
    return;
  }

  // Insert all products
  await db.insert(products).values(sampleProducts);
  
  console.log(`Seeded ${sampleProducts.length} products successfully!`);
}

// Run the seeding function
seedDatabase().catch(console.error);