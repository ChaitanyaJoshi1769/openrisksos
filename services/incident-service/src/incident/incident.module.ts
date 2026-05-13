import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { IncidentService } from './incident.service';
import { IncidentController } from './incident.controller';
import { IncidentResolver } from './incident.resolver';

@Module({
  imports: [PrismaModule],
  providers: [IncidentService, IncidentResolver],
  controllers: [IncidentController],
  exports: [IncidentService],
})
export class IncidentModule {}
