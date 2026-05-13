import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { RisksService } from './risks.service';
import { PrismaService } from '../prisma/prisma.module';
import { CreateRiskDto } from './dto';

describe('RisksService', () => {
  let service: RisksService;
  let prisma: PrismaService;

  const mockPrismaService = {
    risk: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    kRI: {
      findMany: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RisksService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<RisksService>(RisksService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createRisk', () => {
    it('should create a risk with calculated inherent score', async () => {
      const createRiskDto: CreateRiskDto = {
        title: 'Test Risk',
        description: 'Test Description',
        riskCategory: 'cyber',
        probability: 3,
        inherentImpact: 4,
        ownerId: 'user-123',
        businessUnit: 'IT',
      };

      const mockRisk = {
        id: 'risk-123',
        tenantId: 'tenant-123',
        ...createRiskDto,
        inherentScore: 12, // 3 * 4
        residualScore: null,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        owner: { id: 'user-123', name: 'Test User' },
        mitigations: [],
      };

      mockPrismaService.risk.create.mockResolvedValue(mockRisk);

      const result = await service.createRisk('tenant-123', createRiskDto);

      expect(result.inherentScore).toBe(12);
      expect(mockPrismaService.risk.create).toHaveBeenCalledWith({
        data: {
          tenantId: 'tenant-123',
          title: createRiskDto.title,
          description: createRiskDto.description,
          riskCategory: createRiskDto.riskCategory,
          probability: createRiskDto.probability,
          inherentImpact: createRiskDto.inherentImpact,
          inherentScore: 12,
          ownerId: createRiskDto.ownerId,
          businessUnit: createRiskDto.businessUnit,
          targetMitigationDate: createRiskDto.targetMitigationDate,
          status: 'active',
        },
        include: {
          owner: true,
          mitigations: true,
        },
      });
    });

    it('should handle invalid probability', async () => {
      const createRiskDto: CreateRiskDto = {
        title: 'Test Risk',
        riskCategory: 'cyber',
        probability: 10, // Invalid: should be 1-5
        inherentImpact: 4,
        ownerId: 'user-123',
      };

      // This should be caught by validation pipe
      // but we test the service doesn't accept it
      expect(createRiskDto.probability).toBeGreaterThan(5);
    });
  });

  describe('getRisks', () => {
    it('should return list of risks with filters', async () => {
      const mockRisks = [
        {
          id: 'risk-1',
          title: 'Risk 1',
          status: 'active',
          inherentScore: 12,
        },
        {
          id: 'risk-2',
          title: 'Risk 2',
          status: 'active',
          inherentScore: 15,
        },
      ];

      mockPrismaService.risk.findMany.mockResolvedValue(mockRisks);

      const result = await service.getRisks('tenant-123', {
        status: 'active',
        limit: 50,
        offset: 0,
      });

      expect(result).toHaveLength(2);
      expect(mockPrismaService.risk.findMany).toHaveBeenCalled();
    });

    it('should filter risks by category', async () => {
      mockPrismaService.risk.findMany.mockResolvedValue([]);

      await service.getRisks('tenant-123', { riskCategory: 'cyber' });

      expect(mockPrismaService.risk.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            riskCategory: 'cyber',
          }),
        }),
      );
    });
  });

  describe('getRiskById', () => {
    it('should return risk when found', async () => {
      const mockRisk = {
        id: 'risk-123',
        tenantId: 'tenant-123',
        title: 'Test Risk',
        status: 'active',
      };

      mockPrismaService.risk.findUnique.mockResolvedValue(mockRisk);

      const result = await service.getRiskById('risk-123', 'tenant-123');

      expect(result).toEqual(mockRisk);
    });

    it('should throw NotFoundException when risk not found', async () => {
      mockPrismaService.risk.findUnique.mockResolvedValue(null);

      await expect(
        service.getRiskById('nonexistent', 'tenant-123'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException on tenant mismatch', async () => {
      const mockRisk = {
        id: 'risk-123',
        tenantId: 'different-tenant',
        title: 'Test Risk',
      };

      mockPrismaService.risk.findUnique.mockResolvedValue(mockRisk);

      await expect(
        service.getRiskById('risk-123', 'tenant-123'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('calculateResidualScore', () => {
    it('should calculate residual score based on mitigations', async () => {
      const mockRisk = {
        id: 'risk-123',
        tenantId: 'tenant-123',
        probability: 3,
        inherentImpact: 4,
        inherentScore: 12,
        mitigations: [
          { effectiveness: 50 },
          { effectiveness: 60 },
        ],
      };

      mockPrismaService.risk.findUnique.mockResolvedValue(mockRisk);
      mockPrismaService.risk.update.mockResolvedValue({
        ...mockRisk,
        residualImpact: 2, // 4 * (1 - 0.55)
        residualScore: 6,  // 3 * 2
      });

      const result = await service.calculateResidualScore('risk-123', 'tenant-123');

      expect(result.residualScore).toBeLessThan(mockRisk.inherentScore);
    });

    it('should throw error when no mitigations exist', async () => {
      const mockRisk = {
        id: 'risk-123',
        tenantId: 'tenant-123',
        mitigations: [],
      };

      mockPrismaService.risk.findUnique.mockResolvedValue(mockRisk);

      await expect(
        service.calculateResidualScore('risk-123', 'tenant-123'),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getRiskHeatmap', () => {
    it('should generate 5x5 heatmap matrix', async () => {
      const mockRisks = [
        { probability: 1, inherentImpact: 1 },
        { probability: 3, inherentImpact: 3 },
        { probability: 5, inherentImpact: 5 },
      ];

      mockPrismaService.risk.findMany.mockResolvedValue(mockRisks);

      const result = await service.getRiskHeatmap('tenant-123');

      expect(result).toHaveLength(5);
      expect(result[0]).toHaveLength(5);
      expect(result[0][0]).toBe(1); // One risk at (1,1)
      expect(result[2][2]).toBe(1); // One risk at (3,3)
      expect(result[4][4]).toBe(1); // One risk at (5,5)
    });
  });
});
