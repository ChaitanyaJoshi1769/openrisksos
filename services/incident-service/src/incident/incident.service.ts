import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateIncidentDto,
  UpdateIncidentDto,
  CreateTimelineDto,
  CreateCorrectiveActionDto,
  IncidentFilterDto,
  IncidentStatus,
} from './dto';

@Injectable()
export class IncidentService {
  constructor(private readonly prisma: PrismaService) {}

  // Incident Operations
  async createIncident(tenantId: string, input: CreateIncidentDto) {
    return this.prisma.incident.create({
      data: {
        ...input,
        tenantId,
        timelines: {
          create: [],
        },
        correctiveActions: {
          create: [],
        },
      },
      include: { timelines: true, correctiveActions: true },
    });
  }

  async getIncidents(tenantId: string, filter: IncidentFilterDto) {
    const where = {
      tenantId,
      deletedAt: null,
      ...(filter.status && { status: filter.status }),
      ...(filter.severity && { severity: filter.severity }),
      ...(filter.type && { type: filter.type }),
      ...(filter.assignedTo && { assignedTo: filter.assignedTo }),
      ...(filter.reportedBy && { reportedBy: filter.reportedBy }),
      ...(filter.search && {
        OR: [
          { title: { contains: filter.search, mode: 'insensitive' } },
          { description: { contains: filter.search, mode: 'insensitive' } },
        ],
      }),
    };

    const [incidents, total] = await Promise.all([
      this.prisma.incident.findMany({
        where,
        include: { timelines: true, correctiveActions: true },
        take: filter.limit,
        skip: filter.offset,
        orderBy: { [filter.sortBy]: filter.sortOrder },
      }),
      this.prisma.incident.count({ where }),
    ]);

    return { data: incidents, total, limit: filter.limit, offset: filter.offset };
  }

  async getIncidentById(tenantId: string, id: string) {
    const incident = await this.prisma.incident.findUnique({
      where: { id },
      include: { timelines: true, correctiveActions: true },
    });

    if (!incident || incident.tenantId !== tenantId || incident.deletedAt) {
      throw new NotFoundException(`Incident ${id} not found`);
    }

    return incident;
  }

  async updateIncident(tenantId: string, id: string, input: UpdateIncidentDto) {
    await this.getIncidentById(tenantId, id);

    return this.prisma.incident.update({
      where: { id },
      data: input,
      include: { timelines: true, correctiveActions: true },
    });
  }

  async updateIncidentStatus(tenantId: string, id: string, status: IncidentStatus) {
    await this.getIncidentById(tenantId, id);

    return this.prisma.incident.update({
      where: { id },
      data: { status },
      include: { timelines: true, correctiveActions: true },
    });
  }

  async deleteIncident(tenantId: string, id: string) {
    const incident = await this.getIncidentById(tenantId, id);

    return this.prisma.incident.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // Timeline Operations
  async createTimeline(tenantId: string, input: CreateTimelineDto) {
    const incident = await this.getIncidentById(tenantId, input.incidentId);

    return this.prisma.timeline.create({
      data: {
        ...input,
        tenantId,
      },
      include: { incident: true },
    });
  }

  async getIncidentTimeline(tenantId: string, incidentId: string) {
    await this.getIncidentById(tenantId, incidentId);

    return this.prisma.timeline.findMany({
      where: {
        tenantId,
        incidentId,
        deletedAt: null,
      },
      orderBy: { occurredAt: 'asc' },
    });
  }

  async deleteTimeline(tenantId: string, id: string) {
    const timeline = await this.prisma.timeline.findUnique({ where: { id } });

    if (!timeline || timeline.tenantId !== tenantId || timeline.deletedAt) {
      throw new NotFoundException(`Timeline entry ${id} not found`);
    }

    return this.prisma.timeline.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // Corrective Action Operations
  async createCorrectiveAction(tenantId: string, input: CreateCorrectiveActionDto) {
    const incident = await this.getIncidentById(tenantId, input.incidentId);

    return this.prisma.correctiveAction.create({
      data: {
        ...input,
        tenantId,
      },
      include: { incident: true },
    });
  }

  async getIncidentCorrectiveActions(tenantId: string, incidentId: string) {
    await this.getIncidentById(tenantId, incidentId);

    return this.prisma.correctiveAction.findMany({
      where: {
        tenantId,
        incidentId,
        deletedAt: null,
      },
      orderBy: { dueDate: 'asc' },
    });
  }

  async updateCorrectiveAction(
    tenantId: string,
    id: string,
    input: Partial<CreateCorrectiveActionDto>,
  ) {
    const action = await this.prisma.correctiveAction.findUnique({ where: { id } });

    if (!action || action.tenantId !== tenantId || action.deletedAt) {
      throw new NotFoundException(`Corrective action ${id} not found`);
    }

    return this.prisma.correctiveAction.update({
      where: { id },
      data: input,
      include: { incident: true },
    });
  }

  async completeCorrectiveAction(tenantId: string, id: string) {
    const action = await this.prisma.correctiveAction.findUnique({ where: { id } });

    if (!action || action.tenantId !== tenantId || action.deletedAt) {
      throw new NotFoundException(`Corrective action ${id} not found`);
    }

    return this.prisma.correctiveAction.update({
      where: { id },
      data: { status: 'completed' },
      include: { incident: true },
    });
  }

  async deleteCorrectiveAction(tenantId: string, id: string) {
    const action = await this.prisma.correctiveAction.findUnique({ where: { id } });

    if (!action || action.tenantId !== tenantId || action.deletedAt) {
      throw new NotFoundException(`Corrective action ${id} not found`);
    }

    return this.prisma.correctiveAction.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // Incident Analytics
  async getIncidentStats(tenantId: string) {
    const incidents = await this.prisma.incident.findMany({
      where: { tenantId, deletedAt: null },
      select: { status: true, severity: true },
    });

    const total = incidents.length;
    const bySeverity = {
      critical: incidents.filter((i) => i.severity === 'critical').length,
      high: incidents.filter((i) => i.severity === 'high').length,
      medium: incidents.filter((i) => i.severity === 'medium').length,
      low: incidents.filter((i) => i.severity === 'low').length,
      info: incidents.filter((i) => i.severity === 'info').length,
    };

    const byStatus = {
      open: incidents.filter((i) => i.status === 'open').length,
      investigating: incidents.filter((i) => i.status === 'investigating').length,
      containment: incidents.filter((i) => i.status === 'containment').length,
      resolved: incidents.filter((i) => i.status === 'resolved').length,
      closed: incidents.filter((i) => i.status === 'closed').length,
    };

    return {
      total,
      bySeverity,
      byStatus,
      openCount: byStatus.open + byStatus.investigating,
      resolvedCount: byStatus.resolved + byStatus.closed,
    };
  }

  async getOverdueActions(tenantId: string) {
    const now = new Date();

    return this.prisma.correctiveAction.findMany({
      where: {
        tenantId,
        deletedAt: null,
        dueDate: { lt: now },
        status: { not: 'completed' },
      },
      include: { incident: true },
      orderBy: { dueDate: 'asc' },
    });
  }
}
