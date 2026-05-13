import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { getAppConfig } from './config/app.config';

async function bootstrap() {
  const config = getAppConfig();
  const logger = new Logger('OpenRiskOS Audit Service');

  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', config.nodeEnv === 'development' ? 'debug' : 'verbose'],
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Global exception filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global interceptors
  app.useGlobalInterceptors(new LoggingInterceptor());

  // Enable CORS
  app.enableCors({
    origin: config.corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Tenant-ID', 'X-API-Key'],
  });

  // Health check endpoints
  app.get('/health', () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'audit-service',
    version: '0.1.0',
  }));

  app.get('/healthz', () => ({ ok: true }));

  await app.listen(config.port);

  logger.log(`✅ Audit Service started successfully`);
  logger.log(`🚀 Listening on port ${config.port}`);
  logger.log(`📍 Environment: ${config.nodeEnv}`);
  logger.log(`🔌 GraphQL: http://localhost:${config.port}/graphql`);
  logger.log(`📚 API Base: http://localhost:${config.port}/api/v1`);
}

bootstrap().catch((err) => {
  console.error('❌ Failed to start Audit Service:', err);
  process.exit(1);
});
