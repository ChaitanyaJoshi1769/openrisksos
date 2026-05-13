import express, { Express, Request, Response, NextFunction } from 'express';
import httpProxy from 'http-proxy';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

const serviceRoutes = {
  risk: process.env.RISK_SERVICE_URL || 'http://localhost:3001',
  compliance: process.env.COMPLIANCE_SERVICE_URL || 'http://localhost:3002',
  incident: process.env.INCIDENT_SERVICE_URL || 'http://localhost:3003',
  audit: process.env.AUDIT_SERVICE_URL || 'http://localhost:3004',
  vendor: process.env.VENDOR_SERVICE_URL || 'http://localhost:3005',
};

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-ID', 'X-Request-ID'],
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request ID middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  req.id = req.headers['x-request-id'] as string || uuidv4();
  res.setHeader('X-Request-ID', req.id);
  next();
});

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${req.id}] ${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });
  next();
});

// Rate limiting per tenant
const createTenantRateLimiter = () => {
  const limits = new Map<string, { count: number; resetTime: number }>();

  return (req: Request, res: Response, next: NextFunction) => {
    const tenantId = req.headers['x-tenant-id'] as string || 'anonymous';
    const limit = 1000; // requests per 15 minutes
    const windowMs = 15 * 60 * 1000;
    const now = Date.now();

    if (!limits.has(tenantId)) {
      limits.set(tenantId, { count: 0, resetTime: now + windowMs });
    }

    const entry = limits.get(tenantId)!;

    if (now > entry.resetTime) {
      entry.count = 0;
      entry.resetTime = now + windowMs;
    }

    entry.count++;

    res.setHeader('X-RateLimit-Limit', limit);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, limit - entry.count));
    res.setHeader('X-RateLimit-Reset', new Date(entry.resetTime).toISOString());

    if (entry.count > limit) {
      return res.status(429).json({
        statusCode: 429,
        message: 'Too many requests',
        retryAfter: Math.ceil((entry.resetTime - now) / 1000),
      });
    }

    next();
  };
};

app.use(createTenantRateLimiter());

// Global rate limiter (IP-based)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5000,
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalLimiter);

// User database (in-memory for MVP, replace with real DB)
const users: Record<string, { email: string; password: string; tenantId: string }> = {
  'user@company.com': {
    email: 'user@company.com',
    password: 'password123',
    tenantId: 'tenant-123',
  },
};

// Authentication endpoint
app.post('/api/v1/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password, tenantId } = req.body;

    if (!email || !password || !tenantId) {
      return res.status(400).json({
        statusCode: 400,
        message: 'Email, password, and tenantId are required',
        timestamp: new Date().toISOString(),
      });
    }

    const user = users[email];

    if (!user || user.password !== password || user.tenantId !== tenantId) {
      return res.status(401).json({
        statusCode: 401,
        message: 'Invalid credentials',
        timestamp: new Date().toISOString(),
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        email: user.email,
        tenantId: user.tenantId,
        iat: Date.now(),
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      statusCode: 200,
      message: 'Login successful',
      token,
      user: {
        email: user.email,
        tenantId: user.tenantId,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
      timestamp: new Date().toISOString(),
    });
  }
});

// Token verification endpoint
app.post('/api/v1/auth/verify', (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        statusCode: 401,
        message: 'Missing or invalid authorization header',
        timestamp: new Date().toISOString(),
      });
    }

    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      res.json({
        statusCode: 200,
        message: 'Token is valid',
        user: {
          email: decoded.email,
          tenantId: decoded.tenantId,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      return res.status(401).json({
        statusCode: 401,
        message: 'Invalid or expired token',
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      statusCode: 500,
      message: 'Internal server error',
      timestamp: new Date().toISOString(),
    });
  }
});

// Tenant validation middleware (skip for auth endpoints)
app.use((req: Request, res: Response, next: NextFunction) => {
  const tenantId = req.headers['x-tenant-id'] as string;

  if (!tenantId && req.path !== '/health' && !req.path.startsWith('/api/v1/auth')) {
    return res.status(400).json({
      statusCode: 400,
      message: 'X-Tenant-ID header is required',
      timestamp: new Date().toISOString(),
    });
  }

  next();
});

// Create proxy instances
const createProxy = (target: string) => {
  const proxy = httpProxy.createProxyServer({
    target,
    changeOrigin: true,
    timeout: 30000,
    proxyTimeout: 30000,
  });

  proxy.on('error', (err, req, res) => {
    console.error(`[${req.id}] Proxy error:`, err.message);
    res.status(503).json({
      statusCode: 503,
      message: 'Service unavailable',
      timestamp: new Date().toISOString(),
    });
  });

  return proxy;
};

const proxies = {
  risk: createProxy(serviceRoutes.risk),
  compliance: createProxy(serviceRoutes.compliance),
  incident: createProxy(serviceRoutes.incident),
  audit: createProxy(serviceRoutes.audit),
  vendor: createProxy(serviceRoutes.vendor),
};

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      risk: serviceRoutes.risk,
      compliance: serviceRoutes.compliance,
      incident: serviceRoutes.incident,
      audit: serviceRoutes.audit,
      vendor: serviceRoutes.vendor,
    },
  });
});

// API version endpoint
app.get('/api/v1/info', (req: Request, res: Response) => {
  res.json({
    name: 'OpenRiskOS API Gateway',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth_login: 'POST /api/v1/auth/login',
      auth_verify: 'POST /api/v1/auth/verify',
      risks: '/api/v1/risks',
      compliance: '/api/v1/compliance',
      incidents: '/api/v1/incidents',
      audits: '/api/v1/audits',
      vendors: '/api/v1/vendors',
    },
  });
});

// Service routing
// Risk Service
app.use('/api/v1/risks', proxies.risk);
app.use('/graphql/risk', proxies.risk);

// Compliance Service
app.use('/api/v1/compliance', proxies.compliance);
app.use('/graphql/compliance', proxies.compliance);

// Incident Service
app.use('/api/v1/incidents', proxies.incident);
app.use('/graphql/incident', proxies.incident);

// Audit Service
app.use('/api/v1/audits', proxies.audit);
app.use('/graphql/audit', proxies.audit);

// Vendor Service
app.use('/api/v1/vendors', proxies.vendor);
app.use('/graphql/vendor', proxies.vendor);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    statusCode: 404,
    message: 'Not Found',
    path: req.path,
    timestamp: new Date().toISOString(),
  });
});

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(`[${req.id}] Error:`, err);

  res.status(err.statusCode || 500).json({
    statusCode: err.statusCode || 500,
    message: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString(),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
});

// Start server
app.listen(port, () => {
  console.log(`API Gateway listening on port ${port}`);
  console.log('Services:');
  Object.entries(serviceRoutes).forEach(([name, url]) => {
    console.log(`  ${name}: ${url}`);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      id: string;
    }
  }
}
