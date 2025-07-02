import express, { type Request, Response, NextFunction } from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { 
  validateRequest, 
  ipBlocking, 
  trackSuspiciousActivity, 
  sqlInjectionProtection, 
  xssProtection,
  csrfProtection,
  requestSizeLimiter,
  honeypot
} from "./security";

const app = express();

// Trust proxy for accurate IP detection in production
app.set('trust proxy', 1);

// Comprehensive security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", "https://images.unsplash.com", "data:"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  frameguard: { action: 'deny' },
  xssFilter: true,
}));

// Bot detection middleware
const botDetection = (req: Request, res: Response, next: NextFunction) => {
  const userAgent = req.get('User-Agent') || '';
  
  // Allow legitimate browsers including HeadlessChrome used by Replit
  const legitimateBrowsers = [
    /Mozilla.*Chrome/i,
    /Mozilla.*Firefox/i,
    /Mozilla.*Safari/i,
    /Mozilla.*Edge/i,
    /HeadlessChrome/i  // Allow Replit's HeadlessChrome
  ];
  
  const isLegitimate = legitimateBrowsers.some(pattern => pattern.test(userAgent));
  
  if (isLegitimate) {
    return next();
  }
  
  // Block obvious bots and malicious patterns
  const maliciousPatterns = [
    /bot(?!tom)|crawler|spider|scraper/i,
    /curl|wget|python|java|go-http/i,
    /phantom|selenium/i,
    /^$/,  // Empty user agent
    /masscan|nmap|nikto|sqlmap/i,
    /libwww|lwp-trivial|urllib/i
  ];
  
  const isMalicious = maliciousPatterns.some(pattern => pattern.test(userAgent));
  
  if (isMalicious) {
    log(`Blocked malicious user agent: ${userAgent}`, 'security');
    return res.status(403).json({ error: 'Access denied' });
  }
  
  next();
};

// DDoS protection with progressive rate limiting
const createProgressiveLimiter = (windowMs: number, maxRequests: number, skipSuccessfulRequests = false) => {
  return rateLimit({
    windowMs,
    max: maxRequests,
    message: { error: "Too many requests from this IP, please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests,
    keyGenerator: (req) => {
      return req.ip || req.connection.remoteAddress || 'unknown';
    },
    handler: (req, res) => {
      log(`Rate limit exceeded for IP: ${req.ip}`, 'security');
      res.status(429).json({ 
        error: "Too many requests from this IP, please try again later.",
        retryAfter: Math.round(windowMs / 1000)
      });
    }
  });
};

// Multiple rate limiting tiers - more lenient for development
const isDevelopment = process.env.NODE_ENV === 'development';
const strictLimiter = createProgressiveLimiter(1 * 60 * 1000, isDevelopment ? 100 : 30); // 100 in dev, 30 in prod
const generalLimiter = createProgressiveLimiter(15 * 60 * 1000, isDevelopment ? 500 : 200); // 500 in dev, 200 in prod
const cartLimiter = createProgressiveLimiter(5 * 60 * 1000, isDevelopment ? 50 : 15, true); // 50 in dev, 15 in prod
const searchLimiter = createProgressiveLimiter(1 * 60 * 1000, isDevelopment ? 30 : 10); // 30 in dev, 10 in prod

// Apply comprehensive security middleware stack
app.use(honeypot);             // Catch automated attacks with honeypots
app.use(ipBlocking);           // Block known malicious IPs
app.use(requestSizeLimiter);   // Limit request size to prevent DoS
app.use(validateRequest);      // Validate request format and headers
app.use(sqlInjectionProtection); // Prevent SQL injection attacks
app.use(xssProtection);        // Sanitize XSS attempts
app.use(csrfProtection);       // Prevent cross-site request forgery
app.use(botDetection);         // Block automated bots and scrapers
app.use(trackSuspiciousActivity); // Track and auto-block suspicious behavior
app.use(strictLimiter);        // Strict rate limiting (30/min)
app.use(generalLimiter);       // General rate limiting (200/15min)

// Route-specific rate limiting
app.use("/api/cart", cartLimiter);
app.use("/api/products/search", searchLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
