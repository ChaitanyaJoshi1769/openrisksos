import { Module } from '@nestjs/common';
import { RisksService } from './risks.service';
import { RisksResolver } from './risks.resolver';
import { RisksController } from './risks.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RisksController],
  providers: [RisksService, RisksResolver],
  exports: [RisksService],
})
export class RisksModule {}
