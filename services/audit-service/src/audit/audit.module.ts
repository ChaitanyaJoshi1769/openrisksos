import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { AuditResolver } from './audit.resolver';

@Module({
  imports: [PrismaModule],
  providers: [AuditService, AuditResolver],
  controllers: [AuditController],
  exports: [AuditService],
})
export class AuditModule {}
