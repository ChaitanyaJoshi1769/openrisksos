import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { IncidentService } from './incident.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateIncidentDto,
  IncidentType,
  IncidentSeverity,
  IncidentStatus,
  CreateTimelineDto,
  TimelineEventType,
  CreateCorrectiveActionDto,
  ActionType,
  ActionStatus,
} from './dto';

describe('IncidentService', () => {
  let service: IncidentService;
  let prisma: PrismaService;
  const tenantId = 'tenant-123';

  const mockPrisma = {
    incident: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    timeline: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    correctiveAction: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IncidentService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<IncidentService>(IncidentService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('Incident Operations', () => {
    it('should create an incident', async () => {
      const input: CreateIncidentDto = {
        title: 'Data Breach Detected',
        description: 'Unauthorized access to customer database',
        type: IncidentType.DATA_BREACH,
        severity: IncidentSeverity.CRITICAL,
        detectedAt: new Date().toISOString(),
        estimatedAffectedRecords: 5000,
      };

      const mockIncident = {
        id: 'incident-123',
        ...input,
        tenantId,
        status: IncidentStatus.OPEN,
        timelines: [],
        correctiveActions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockPrisma.incident.create.mockResolvedValue(mockIncident);

      const result = await service.createIncident(tenantId, input);

      expect(result).toEqual(mockIncident);
      expect(mockPrisma.incident.create).toHaveBeenCalled();
    });

    it('should get incidents with filtering', async () => {
      const mockIncidents = [
        {
          id: 'incident-1',
          title: 'Test Incident',
          type: IncidentType.SECURITY,
          severity: IncidentSeverity.HIGH,
          tenantId,
          status: IncidentStatus.INVESTIGATING,
          timelines: [],
          correctiveActions: [],
        },
      ];

      mockPrisma.incident.findMany.mockResolvedValue(mockIncidents);
      mockPrisma.incident.count.mockResolvedValue(1);

      const result = await service.getIncidents(tenantId, { limit: 50, offset: 0 });

      expect(result.data).toEqual(mockIncidents);
      expect(result.total).toBe(1);
    });

    it('should get incident by id', async () => {
      const mockIncident = {
        id: 'incident-123',
        title: 'Test Incident',
        tenantId,
        timelines: [],
        correctiveActions: [],
        deletedAt: null,
      };

      mockPrisma.incident.findUnique.mockResolvedValue(mockIncident);

      const result = await service.getIncidentById(tenantId, 'incident-123');

      expect(result).toEqual(mockIncident);
    });

    it('should throw if incident not found', async () => {
      mockPrisma.incident.findUnique.mockResolvedValue(null);

      await expect(service.getIncidentById(tenantId, 'nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should update incident status', async () => {
      const mockIncident = {
        id: 'incident-123',
        status: IncidentStatus.OPEN,
        tenantId,
        timelines: [],
        correctiveActions: [],
        deletedAt: null,
      };

      mockPrisma.incident.findUnique.mockResolvedValue(mockIncident);
      mockPrisma.incident.update.mockResolvedValue({
        ...mockIncident,
        status: IncidentStatus.INVESTIGATING,
      });

      const result = await service.updateIncidentStatus(
        tenantId,
        'incident-123',
        IncidentStatus.INVESTIGATING,
      );

      expect(result.status).toBe(IncidentStatus.INVESTIGATING);
    });
  });

  describe('Timeline Operations', () => {
    it('should create timeline entry', async () => {
      const input: CreateTimelineDto = {
        incidentId: 'incident-123',
        eventType: TimelineEventType.DETECTION,
        description: 'Suspicious activity detected',
        occurredAt: new Date().toISOString(),
      };

      mockPrisma.incident.findUnique.mockResolvedValue({
        id: 'incident-123',
        tenantId,
      });

      const mockTimeline = {
        id: 'timeline-123',
        ...input,
        tenantId,
        incident: {},
        createdAt: new Date(),
        deletedAt: null,
      };

      mockPrisma.timeline.create.mockResolvedValue(mockTimeline);

      const result = await service.createTimeline(tenantId, input);

      expect(result).toEqual(mockTimeline);
    });

    it('should get incident timeline ordered by occurrence', async () => {
      const mockTimelines = [
        { id: '1', eventType: 'detection', occurredAt: new Date('2026-05-13T08:00:00') },
        { id: '2', eventType: 'investigation', occurredAt: new Date('2026-05-13T09:00:00') },
      ];

      mockPrisma.incident.findUnique.mockResolvedValue({ id: 'incident-123', tenantId });
      mockPrisma.timeline.findMany.mockResolvedValue(mockTimelines);

      const result = await service.getIncidentTimeline(tenantId, 'incident-123');

      expect(result).toEqual(mockTimelines);
      expect(result[0].occurredAt < result[1].occurredAt).toBe(true);
    });
  });

  describe('Corrective Action Operations', () => {
    it('should create corrective action', async () => {
      const input: CreateCorrectiveActionDto = {
        incidentId: 'incident-123',
        type: ActionType.IMMEDIATE,
        title: 'Isolate Affected Systems',
        description: 'Immediately isolate compromised servers',
        dueDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
      };

      mockPrisma.incident.findUnique.mockResolvedValue({
        id: 'incident-123',
        tenantId,
      });

      const mockAction = {
        id: 'action-123',
        ...input,
        tenantId,
        status: ActionStatus.OPEN,
        incident: {},
        createdAt: new Date(),
        deletedAt: null,
      };

      mockPrisma.correctiveAction.create.mockResolvedValue(mockAction);

      const result = await service.createCorrectiveAction(tenantId, input);

      expect(result).toEqual(mockAction);
    });

    it('should complete corrective action', async () => {
      const mockAction = {
        id: 'action-123',
        status: ActionStatus.IN_PROGRESS,
        tenantId,
        incident: {},
        deletedAt: null,
      };

      mockPrisma.correctiveAction.findUnique.mockResolvedValue(mockAction);
      mockPrisma.correctiveAction.update.mockResolvedValue({
        ...mockAction,
        status: ActionStatus.COMPLETED,
      });

      const result = await service.completeCorrectiveAction(tenantId, 'action-123');

      expect(result.status).toBe(ActionStatus.COMPLETED);
    });
  });

  describe('Incident Analytics', () => {
    it('should calculate incident statistics', async () => {
      const incidents = [
        { status: IncidentStatus.OPEN, severity: IncidentSeverity.CRITICAL },
        { status: IncidentStatus.OPEN, severity: IncidentSeverity.HIGH },
        { status: IncidentStatus.INVESTIGATING, severity: IncidentSeverity.MEDIUM },
        { status: IncidentStatus.RESOLVED, severity: IncidentSeverity.LOW },
        { status: IncidentStatus.CLOSED, severity: IncidentSeverity.INFO },
      ];

      mockPrisma.incident.findMany.mockResolvedValue(incidents);

      const result = await service.getIncidentStats(tenantId);

      expect(result.total).toBe(5);
      expect(result.bySeverity.critical).toBe(1);
      expect(result.bySeverity.high).toBe(1);
      expect(result.byStatus.open).toBe(1);
      expect(result.openCount).toBe(2); // open + investigating
      expect(result.resolvedCount).toBe(2); // resolved + closed
    });

    it('should find overdue actions', async () => {
      const pastDate = new Date(Date.now() - 86400000); // Yesterday
      const mockActions = [
        { id: '1', dueDate: pastDate, status: ActionStatus.OPEN },
        { id: '2', dueDate: pastDate, status: ActionStatus.IN_PROGRESS },
      ];

      mockPrisma.correctiveAction.findMany.mockResolvedValue(mockActions);

      const result = await service.getOverdueActions(tenantId);

      expect(result.length).toBe(2);
      expect(result[0].dueDate).toEqual(pastDate);
    });
  });
});
