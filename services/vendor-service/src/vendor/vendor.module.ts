import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import { VendorResolver } from './vendor.resolver';

@Module({
  imports: [PrismaModule],
  providers: [VendorService, VendorResolver],
  controllers: [VendorController],
  exports: [VendorService],
})
export class VendorModule {}
