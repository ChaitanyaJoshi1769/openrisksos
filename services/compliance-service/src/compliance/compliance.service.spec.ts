import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ComplianceService } from './compliance.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFrameworkDto, FrameworkType, ControlStatus, ControlFrequency, CreateControlDto } from './dto';

describe('ComplianceService', () => {
  let service: ComplianceService;
  let prisma: PrismaService;
  const tenantId = 'tenant-123';

  const mockPrisma = {
    complianceFramework: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    complianceControl: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    evidence: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    controlTest: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComplianceService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<ComplianceService>(ComplianceService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('Framework Operations', () => {
    it('should create a framework', async () => {
      const input: CreateFrameworkDto = {
        name: 'ISO 27001',
        type: FrameworkType.ISO27001,
        description: 'Information Security Management',
      };

      const mockFramework = {
        id: 'framework-123',
        ...input,
        tenantId,
        controls: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockPrisma.complianceFramework.create.mockResolvedValue(mockFramework);

      const result = await service.createFramework(tenantId, input);

      expect(result).toEqual(mockFramework);
      expect(mockPrisma.complianceFramework.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: input.name,
          type: input.type,
          tenantId,
        }),
        include: { controls: true },
      });
    });

    it('should get frameworks with pagination', async () => {
      const mockFrameworks = [
        {
          id: 'framework-1',
          name: 'ISO 27001',
          type: FrameworkType.ISO27001,
          tenantId,
          controls: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
        },
      ];

      mockPrisma.complianceFramework.findMany.mockResolvedValue(mockFrameworks);
      mockPrisma.complianceFramework.count.mockResolvedValue(1);

      const result = await service.getFrameworks(tenantId, { limit: 50, offset: 0 });

      expect(result.data).toEqual(mockFrameworks);
      expect(result.total).toBe(1);
    });

    it('should get framework by id', async () => {
      const mockFramework = {
        id: 'framework-123',
        name: 'ISO 27001',
        type: FrameworkType.ISO27001,
        tenantId,
        controls: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockPrisma.complianceFramework.findUnique.mockResolvedValue(mockFramework);

      const result = await service.getFrameworkById(tenantId, 'framework-123');

      expect(result).toEqual(mockFramework);
    });

    it('should throw if framework not found', async () => {
      mockPrisma.complianceFramework.findUnique.mockResolvedValue(null);

      await expect(service.getFrameworkById(tenantId, 'nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Control Operations', () => {
    it('should create a control', async () => {
      const input: CreateControlDto = {
        frameworkId: 'framework-123',
        controlId: 'A.5.1.1',
        title: 'Access Control',
        frequency: ControlFrequency.QUARTERLY,
      };

      mockPrisma.complianceFramework.findUnique.mockResolvedValue({
        id: 'framework-123',
        tenantId,
      });

      const mockControl = {
        id: 'control-123',
        ...input,
        tenantId,
        status: ControlStatus.NOT_STARTED,
        maturityLevel: 0,
        framework: {},
        evidence: [],
        tests: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockPrisma.complianceControl.create.mockResolvedValue(mockControl);

      const result = await service.createControl(tenantId, input);

      expect(result).toEqual(mockControl);
      expect(mockPrisma.complianceControl.create).toHaveBeenCalled();
    });

    it('should throw if framework not found', async () => {
      const input: CreateControlDto = {
        frameworkId: 'nonexistent',
        controlId: 'A.5.1.1',
        title: 'Access Control',
        frequency: ControlFrequency.QUARTERLY,
      };

      mockPrisma.complianceFramework.findUnique.mockResolvedValue(null);

      await expect(service.createControl(tenantId, input)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should update control status', async () => {
      const mockControl = {
        id: 'control-123',
        status: ControlStatus.NOT_STARTED,
        tenantId,
        framework: {},
        evidence: [],
        tests: [],
      };

      mockPrisma.complianceControl.findUnique.mockResolvedValue(mockControl);
      mockPrisma.complianceControl.update.mockResolvedValue({
        ...mockControl,
        status: ControlStatus.COMPLIANT,
      });

      const result = await service.updateControlStatus(
        tenantId,
        'control-123',
        ControlStatus.COMPLIANT,
      );

      expect(result.status).toBe(ControlStatus.COMPLIANT);
    });
  });

  describe('Evidence Operations', () => {
    it('should create evidence', async () => {
      const input = {
        controlId: 'control-123',
        title: 'Policy Document',
        description: 'Access Control Policy',
        type: 'policy',
      };

      mockPrisma.complianceControl.findUnique.mockResolvedValue({
        id: 'control-123',
        tenantId,
      });

      const mockEvidence = {
        id: 'evidence-123',
        ...input,
        tenantId,
        control: {},
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockPrisma.evidence.create.mockResolvedValue(mockEvidence);

      const result = await service.createEvidence(tenantId, input);

      expect(result).toEqual(mockEvidence);
    });
  });

  describe('Compliance Status', () => {
    it('should calculate compliance percentage', async () => {
      const controls = [
        { status: ControlStatus.COMPLIANT },
        { status: ControlStatus.COMPLIANT },
        { status: ControlStatus.NON_COMPLIANT },
        { status: ControlStatus.IN_PROGRESS },
      ];

      mockPrisma.complianceFramework.count.mockResolvedValue(2);
      mockPrisma.complianceControl.findMany.mockResolvedValue(controls);

      const result = await service.getComplianceStatus(tenantId);

      expect(result.totalControls).toBe(4);
      expect(result.compliantControls).toBe(2);
      expect(result.nonCompliantControls).toBe(1);
      expect(result.compliancePercentage).toBe(50);
    });
  });
});
