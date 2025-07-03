import type { Express, Request, Response, NextFunction } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCartItemSchema } from "@shared/schema";
import { blockedIPs, suspiciousIPs } from "./security";
import { z } from "zod";

function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Products API
  app.get("/api/products", async (_req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/featured", async (_req, res) => {
    try {
      const products = await storage.getFeaturedProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured products" });
    }
  });

  app.get("/api/products/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const products = await storage.getProductsByCategory(category);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products by category" });
    }
  });

  app.get("/api/products/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== "string") {
        return res.status(400).json({ message: "Search query is required" });
      }
      const products = await storage.searchProducts(q);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to search products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      const product = await storage.getProductById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Cart API
  app.get("/api/cart", async (req, res) => {
    try {
      let sessionId = req.headers["x-session-id"] as string;
      if (!sessionId) {
        sessionId = generateSessionId();
        res.setHeader("x-session-id", sessionId);
      }
      const cartItems = await storage.getCartItems(sessionId);
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      let sessionId = req.headers["x-session-id"] as string;
      if (!sessionId) {
        sessionId = generateSessionId();
        res.setHeader("x-session-id", sessionId);
      }

      const validatedData = insertCartItemSchema.parse({
        ...req.body,
        sessionId,
      });

      // Verify product exists
      const product = await storage.getProductById(validatedData.productId);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const cartItem = await storage.addToCart(validatedData);
      res.status(201).json(cartItem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid cart item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add item to cart" });
    }
  });

  app.put("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;

      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid cart item ID" });
      }

      if (typeof quantity !== "number" || quantity < 1) {
        return res.status(400).json({ message: "Quantity must be a positive number" });
      }

      const updatedItem = await storage.updateCartItem(id, quantity);
      if (!updatedItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }

      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid cart item ID" });
      }

      const success = await storage.removeFromCart(id);
      if (!success) {
        return res.status(404).json({ message: "Cart item not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to remove item from cart" });
    }
  });

  app.delete("/api/cart", async (req, res) => {
    try {
      const sessionId = req.headers["x-session-id"] as string;
      if (!sessionId) {
        return res.status(400).json({ message: "Session ID required" });
      }

      await storage.clearCart(sessionId);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to clear cart" });
    }
  });

  // Security monitoring endpoint (for admin use)
  app.get("/api/security/status", (req, res) => {
    const securityStatus = {
      blockedIPs: {
        count: blockedIPs.size,
        list: Array.from(blockedIPs).slice(0, 10) // Show first 10 for privacy
      },
      suspiciousIPs: {
        count: suspiciousIPs.size,
        recentActivity: Array.from(suspiciousIPs.entries())
          .filter(([_, data]) => Date.now() - data.lastAttempt < 24 * 60 * 60 * 1000) // Last 24 hours
          .map(([ip, data]) => ({
            ip: ip.substring(0, ip.lastIndexOf('.')) + '.***', // Mask last octet for privacy
            attempts: data.attempts,
            lastAttempt: new Date(data.lastAttempt).toISOString(),
            blockedUntil: data.blockedUntil ? new Date(data.blockedUntil).toISOString() : null
          }))
          .slice(0, 20)
      },
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    };
    
    res.json(securityStatus);
  });

  // Admin authentication routes
  app.post('/api/admin/login', express.json(), async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: 'Username and password required' });
      }

      const admin = await storage.validateAdmin(username, password);
      if (!admin) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const sessionId = await storage.createAdminSession(admin.id);
      
      res.json({
        success: true,
        sessionId,
        admin: {
          id: admin.id,
          username: admin.username,
          email: admin.email,
          lastLogin: admin.lastLogin,
        }
      });
    } catch (error) {
      console.error('Admin login error:', error);
      res.status(500).json({ error: 'Login failed' });
    }
  });

  app.post('/api/admin/logout', async (req, res) => {
    const adminSession = req.headers['admin-session'] as string;
    if (adminSession) {
      await storage.deleteAdminSession(adminSession);
    }
    res.json({ success: true });
  });

  // Admin middleware
  const requireAdmin = async (req: any, res: any, next: any) => {
    const adminSession = req.headers['admin-session'] as string;
    if (!adminSession) {
      return res.status(401).json({ error: 'Admin authentication required' });
    }

    const admin = await storage.validateAdminSession(adminSession);
    if (!admin) {
      return res.status(401).json({ error: 'Invalid admin session' });
    }

    req.admin = admin;
    next();
  };

  // Admin-only product management routes
  app.put('/api/admin/products/:id', requireAdmin, express.json(), async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const productData = req.body;
      
      const updatedProduct = await storage.updateProduct(productId, productData);
      if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      res.json(updatedProduct);
    } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({ error: 'Failed to update product' });
    }
  });

  app.delete('/api/admin/products/:id', requireAdmin, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const success = await storage.deleteProduct(productId);
      
      if (!success) {
        return res.status(404).json({ error: 'Product not found' });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error('Delete product error:', error);
      res.status(500).json({ error: 'Failed to delete product' });
    }
  });

  app.post('/api/admin/products', requireAdmin, express.json(), async (req, res) => {
    try {
      const productData = req.body;
      const newProduct = await storage.createProduct(productData);
      res.status(201).json(newProduct);
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  });

  // Protected security endpoint
  app.get('/api/admin/security/status', requireAdmin, (req, res) => {
    const securityStatus = {
      blockedIPs: {
        count: blockedIPs.size,
        list: Array.from(blockedIPs).slice(0, 10)
      },
      suspiciousIPs: {
        count: suspiciousIPs.size,
        recentActivity: Array.from(suspiciousIPs.entries())
          .filter(([_, data]) => Date.now() - data.lastAttempt < 24 * 60 * 60 * 1000)
          .map(([ip, data]) => ({
            ip: ip.substring(0, ip.lastIndexOf('.')) + '.***',
            attempts: data.attempts,
            lastAttempt: new Date(data.lastAttempt).toISOString(),
            blockedUntil: data.blockedUntil ? new Date(data.blockedUntil).toISOString() : null
          }))
          .slice(0, 20)
      },
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    };
    
    res.json(securityStatus);
  });

  const httpServer = createServer(app);
  return httpServer;
}
