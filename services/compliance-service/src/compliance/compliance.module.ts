import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { ComplianceService } from './compliance.service';
import { ComplianceController } from './compliance.controller';
import { ComplianceResolver } from './compliance.resolver';

@Module({
  imports: [PrismaModule],
  providers: [ComplianceService, ComplianceResolver],
  controllers: [ComplianceController],
  exports: [ComplianceService],
})
export class ComplianceModule {}
