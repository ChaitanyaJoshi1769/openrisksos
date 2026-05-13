export interface AppConfig {
  port: number;
  nodeEnv: string;
  logLevel: string;
  corsOrigins: string[];
  jwtSecret: string;
  databaseUrl: string;
  redisUrl: string;
}

export function getAppConfig(): AppConfig {
  return {
    port: parseInt(process.env.PORT || '3002', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    logLevel: process.env.LOG_LEVEL || 'debug',
    corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:3000').split(','),
    jwtSecret: process.env.JWT_SECRET || 'dev-secret-key',
    databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/openrisksos',
    redisUrl: process.env.REDIS_URL || 'redis://localhost:6379',
  };
}
