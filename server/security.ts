import { Request, Response, NextFunction } from "express";
import { log } from "./vite";

// In-memory store for tracking suspicious activities
const suspiciousIPs = new Map<string, { attempts: number, lastAttempt: number, blockedUntil?: number }>();
const blockedIPs = new Set<string>();

// Request validation middleware
export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const contentType = req.get('Content-Type');
  
  // Block requests with suspicious content types
  if (req.method === 'POST' || req.method === 'PUT') {
    if (!contentType || !contentType.includes('application/json')) {
      if (req.path.startsWith('/api/')) {
        log(`Blocked request with invalid content type: ${contentType}`, 'security');
        return res.status(400).json({ error: 'Invalid content type' });
      }
    }
  }
  
  // Check for suspicious request patterns
  const suspiciousHeaders = [
    'x-forwarded-for',
    'x-real-ip',
    'x-originating-ip'
  ];
  
  let hasMultipleForwardedHeaders = 0;
  suspiciousHeaders.forEach(header => {
    if (req.get(header)) hasMultipleForwardedHeaders++;
  });
  
  if (hasMultipleForwardedHeaders > 1) {
    log(`Suspicious forwarded headers detected from ${req.ip}`, 'security');
  }
  
  next();
};

// IP blocking middleware
export const ipBlocking = (req: Request, res: Response, next: NextFunction) => {
  const clientIP = req.ip || 'unknown';
  
  // Check if IP is permanently blocked
  if (blockedIPs.has(clientIP)) {
    log(`Blocked request from banned IP: ${clientIP}`, 'security');
    return res.status(403).json({ error: 'Access denied' });
  }
  
  // Check temporary blocks
  const suspiciousData = suspiciousIPs.get(clientIP);
  if (suspiciousData?.blockedUntil && Date.now() < suspiciousData.blockedUntil) {
    log(`Blocked request from temporarily banned IP: ${clientIP}`, 'security');
    return res.status(403).json({ 
      error: 'Access temporarily denied',
      retryAfter: Math.ceil((suspiciousData.blockedUntil - Date.now()) / 1000)
    });
  }
  
  next();
};

// Track failed requests and suspicious activity
export const trackSuspiciousActivity = (req: Request, res: Response, next: NextFunction) => {
  const clientIP = req.ip || 'unknown';
  
  res.on('finish', () => {
    // Track 4xx and 5xx responses as potentially suspicious
    if (res.statusCode >= 400) {
      const current = suspiciousIPs.get(clientIP) || { attempts: 0, lastAttempt: 0 };
      current.attempts++;
      current.lastAttempt = Date.now();
      
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      // Temporary block after more failed requests in development
      const tempBlockThreshold = isDevelopment ? 25 : 10;
      const permanentBlockThreshold = isDevelopment ? 100 : 50;
      
      if (current.attempts >= tempBlockThreshold && Date.now() - current.lastAttempt < 5 * 60 * 1000) {
        current.blockedUntil = Date.now() + (isDevelopment ? 5 * 60 * 1000 : 30 * 60 * 1000); // 5 min in dev, 30 min in prod
        log(`Temporarily blocking IP ${clientIP} for suspicious activity`, 'security');
      }
      
      // Permanent block after more failed requests in development
      if (current.attempts >= permanentBlockThreshold) {
        if (!isDevelopment || clientIP !== '127.0.0.1') { // Don't permanently block localhost in dev
          blockedIPs.add(clientIP);
          log(`Permanently blocking IP ${clientIP} for repeated violations`, 'security');
        }
      }
      
      suspiciousIPs.set(clientIP, current);
    } else if (res.statusCode < 400) {
      // Reset counter on successful requests
      const current = suspiciousIPs.get(clientIP);
      if (current) {
        current.attempts = Math.max(0, current.attempts - 1);
        if (current.attempts === 0) {
          suspiciousIPs.delete(clientIP);
        } else {
          suspiciousIPs.set(clientIP, current);
        }
      }
    }
  });
  
  next();
};

// SQL injection protection
export const sqlInjectionProtection = (req: Request, res: Response, next: NextFunction) => {
  const sqlPatterns = [
    /(\bunion\b.*\bselect\b)|(\bselect\b.*\bunion\b)/i,
    /(\bdrop\b.*\btable\b)|(\btable\b.*\bdrop\b)/i,
    /(\binsert\b.*\binto\b)|(\binto\b.*\binsert\b)/i,
    /(\bdelete\b.*\bfrom\b)|(\bfrom\b.*\bdelete\b)/i,
    /(\bupdate\b.*\bset\b)|(\bset\b.*\bupdate\b)/i,
    /(\bor\b.*1\s*=\s*1)|(\band\b.*1\s*=\s*1)/i,
    /(\bor\b.*\btrue\b)|(\band\b.*\bfalse\b)/i,
    /('.*;\s*--)|('.*;\s*#)/i,
    /(\bexec\b)|(\bexecute\b)|(\bsp_\w+)/i
  ];
  
  const checkForSQLInjection = (obj: any, path = ''): boolean => {
    if (typeof obj === 'string') {
      return sqlPatterns.some(pattern => pattern.test(obj));
    }
    
    if (typeof obj === 'object' && obj !== null) {
      for (const [key, value] of Object.entries(obj)) {
        if (checkForSQLInjection(value, `${path}.${key}`)) {
          return true;
        }
      }
    }
    
    return false;
  };
  
  // Check query parameters
  if (checkForSQLInjection(req.query)) {
    log(`SQL injection attempt detected in query params from ${req.ip}`, 'security');
    return res.status(400).json({ error: 'Invalid request parameters' });
  }
  
  // Check request body
  if (req.body && checkForSQLInjection(req.body)) {
    log(`SQL injection attempt detected in request body from ${req.ip}`, 'security');
    return res.status(400).json({ error: 'Invalid request data' });
  }
  
  next();
};

// XSS protection
export const xssProtection = (req: Request, res: Response, next: NextFunction) => {
  const xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<img[^>]+src[^>]*>/gi,
    /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi
  ];
  
  const sanitizeString = (str: string): string => {
    let sanitized = str;
    xssPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '');
    });
    return sanitized;
  };
  
  const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
      const original = obj;
      const sanitized = sanitizeString(obj);
      if (original !== sanitized) {
        log(`XSS attempt detected and sanitized from ${req.ip}`, 'security');
      }
      return sanitized;
    }
    
    if (typeof obj === 'object' && obj !== null) {
      const sanitized: any = Array.isArray(obj) ? [] : {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitizeObject(value);
      }
      return sanitized;
    }
    
    return obj;
  };
  
  // Sanitize query parameters
  req.query = sanitizeObject(req.query);
  
  // Sanitize request body
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  
  next();
};

// Clean up old entries every hour
setInterval(() => {
  const now = Date.now();
  const oneHourAgo = now - 60 * 60 * 1000;
  
  for (const [ip, data] of Array.from(suspiciousIPs.entries())) {
    if (data.lastAttempt < oneHourAgo && (!data.blockedUntil || data.blockedUntil < now)) {
      suspiciousIPs.delete(ip);
    }
  }
}, 60 * 60 * 1000);

// CSRF protection
export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  // Skip CSRF for GET requests and safe methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }
  
  const origin = req.get('Origin');
  const referer = req.get('Referer');
  const host = req.get('Host');
  
  // Allow requests from the same origin
  const allowedOrigins = [
    `http://${host}`,
    `https://${host}`,
    `http://localhost:5000`,
    `https://localhost:5000`
  ];
  
  if (origin && allowedOrigins.includes(origin)) {
    return next();
  }
  
  if (referer) {
    const refererHost = new URL(referer).host;
    if (refererHost === host || refererHost === 'localhost:5000') {
      return next();
    }
  }
  
  log(`CSRF attempt blocked from ${req.ip}, origin: ${origin}, referer: ${referer}`, 'security');
  return res.status(403).json({ error: 'Cross-site request blocked' });
};

// Request size limiting
export const requestSizeLimiter = (req: Request, res: Response, next: NextFunction) => {
  const contentLength = parseInt(req.get('Content-Length') || '0');
  const maxSize = 1024 * 1024; // 1MB limit
  
  if (contentLength > maxSize) {
    log(`Request size limit exceeded: ${contentLength} bytes from ${req.ip}`, 'security');
    return res.status(413).json({ error: 'Request too large' });
  }
  
  next();
};

// Honeypot middleware to catch automated attacks
export const honeypot = (req: Request, res: Response, next: NextFunction) => {
  // Check for common automated attack patterns
  const suspiciousEndpoints = [
    '/wp-admin',
    '/admin',
    '/login',
    '/wp-login.php',
    '/.env',
    '/config',
    '/phpMyAdmin',
    '/phpmyadmin',
    '/mysql',
    '/database',
    '/backup',
    '/shell',
    '/cmd',
    '/system'
  ];
  
  if (suspiciousEndpoints.some(endpoint => req.path.toLowerCase().includes(endpoint))) {
    log(`Honeypot triggered by automated attack from ${req.ip} to ${req.path}`, 'security');
    
    // Add to permanent block list
    blockedIPs.add(req.ip || 'unknown');
    
    // Return fake response to waste attacker's time
    return res.status(200).json({ status: 'success', message: 'Access granted' });
  }
  
  next();
};

export { blockedIPs, suspiciousIPs };