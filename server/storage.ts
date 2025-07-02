import { products, cartItems, type Product, type InsertProduct, type CartItem, type InsertCartItem, type CartItemWithProduct } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  // Products
  getAllProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Cart
  getCartItems(sessionId: string): Promise<CartItemWithProduct[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(sessionId: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  private currentProductId: number;
  private currentCartItemId: number;

  constructor() {
    this.products = new Map();
    this.cartItems = new Map();
    this.currentProductId = 1;
    this.currentCartItemId = 1;
    this.seedProducts();
  }

  private seedProducts() {
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

    sampleProducts.forEach(product => {
      this.createProduct(product);
    });
  }

  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.category === category);
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(product => product.featured);
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(product =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.material.toLowerCase().includes(lowercaseQuery)
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { ...insertProduct, id };
    this.products.set(id, product);
    return product;
  }

  async getCartItems(sessionId: string): Promise<CartItemWithProduct[]> {
    const items = Array.from(this.cartItems.values()).filter(item => item.sessionId === sessionId);
    const itemsWithProducts: CartItemWithProduct[] = [];
    
    for (const item of items) {
      const product = this.products.get(item.productId);
      if (product) {
        itemsWithProducts.push({ ...item, product });
      }
    }
    
    return itemsWithProducts;
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItem = Array.from(this.cartItems.values()).find(
      item => item.productId === insertItem.productId && item.sessionId === insertItem.sessionId
    );

    if (existingItem) {
      // Update quantity
      existingItem.quantity += insertItem.quantity;
      this.cartItems.set(existingItem.id, existingItem);
      return existingItem;
    } else {
      // Create new cart item
      const id = this.currentCartItemId++;
      const cartItem: CartItem = { ...insertItem, id };
      this.cartItems.set(id, cartItem);
      return cartItem;
    }
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const item = this.cartItems.get(id);
    if (item) {
      item.quantity = quantity;
      this.cartItems.set(id, item);
      return item;
    }
    return undefined;
  }

  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(sessionId: string): Promise<boolean> {
    const itemsToRemove = Array.from(this.cartItems.values()).filter(item => item.sessionId === sessionId);
    itemsToRemove.forEach(item => this.cartItems.delete(item.id));
    return true;
  }
}

export class DatabaseStorage implements IStorage {
  async getAllProducts(): Promise<Product[]> {
    return await db.select().from(products);
  }

  async getProductById(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product || undefined;
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.category, category));
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return await db.select().from(products).where(eq(products.featured, true));
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowercaseQuery = query.toLowerCase();
    const allProducts = await db.select().from(products);
    return allProducts.filter(product =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.material.toLowerCase().includes(lowercaseQuery)
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const [product] = await db
      .insert(products)
      .values(insertProduct)
      .returning();
    return product;
  }

  async getCartItems(sessionId: string): Promise<CartItemWithProduct[]> {
    const items = await db
      .select({
        id: cartItems.id,
        productId: cartItems.productId,
        quantity: cartItems.quantity,
        sessionId: cartItems.sessionId,
        product: products
      })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .where(eq(cartItems.sessionId, sessionId));
    
    return items;
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItems = await db
      .select()
      .from(cartItems)
      .where(and(
        eq(cartItems.productId, insertItem.productId),
        eq(cartItems.sessionId, insertItem.sessionId)
      ));

    const existingItem = existingItems[0];

    if (existingItem) {
      // Update quantity
      const [updatedItem] = await db
        .update(cartItems)
        .set({ quantity: existingItem.quantity + insertItem.quantity })
        .where(eq(cartItems.id, existingItem.id))
        .returning();
      return updatedItem;
    } else {
      // Create new cart item
      const [cartItem] = await db
        .insert(cartItems)
        .values(insertItem)
        .returning();
      return cartItem;
    }
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const [updatedItem] = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return updatedItem || undefined;
  }

  async removeFromCart(id: number): Promise<boolean> {
    const result = await db.delete(cartItems).where(eq(cartItems.id, id));
    return (result.rowCount || 0) > 0;
  }

  async clearCart(sessionId: string): Promise<boolean> {
    await db.delete(cartItems).where(eq(cartItems.sessionId, sessionId));
    return true;
  }
}

// Use database storage instead of memory storage
export const storage = new DatabaseStorage();
