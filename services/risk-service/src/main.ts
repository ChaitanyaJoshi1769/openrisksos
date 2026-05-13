import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Enable CORS
  app.enableCors({
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  });

  // Request logging middleware would go here
  // Health check endpoint
  app.get('/health', () => ({ status: 'ok' }));

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`🎯 Risk Service listening on port ${port}`);
}

bootstrap().catch((err) => {
  console.error('Failed to start Risk Service:', err);
  process.exit(1);
});
