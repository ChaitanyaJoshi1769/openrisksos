import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { AuditService } from './audit.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateAuditDto,
  AuditType,
  AuditStatus,
  AuditPriority,
  CreateFindingDto,
  FindingSeverity,
  FindingStatus,
  CreateEvidenceDto,
  EvidenceType,
} from './dto';

describe('AuditService', () => {
  let service: AuditService;
  let prisma: PrismaService;
  const tenantId = 'tenant-123';

  const mockPrisma = {
    audit: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      count: jest.fn(),
    },
    finding: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    evidence: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuditService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = module.get<AuditService>(AuditService);
    prisma = module.get<PrismaService>(PrismaService);
    jest.clearAllMocks();
  });

  describe('Audit Operations', () => {
    it('should create an audit', async () => {
      const input: CreateAuditDto = {
        title: 'Q2 2026 Security Audit',
        description: 'Quarterly security audit of IT infrastructure',
        type: AuditType.EXTERNAL,
        scheduledDate: '2026-06-01T00:00:00Z',
        auditScope: 'All systems',
        estimatedDays: 10,
      };

      const mockAudit = {
        id: 'audit-123',
        ...input,
        tenantId,
        status: AuditStatus.PLANNED,
        findings: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
      };

      mockPrisma.audit.create.mockResolvedValue(mockAudit);

      const result = await service.createAudit(tenantId, input);

      expect(result).toEqual(mockAudit);
      expect(mockPrisma.audit.create).toHaveBeenCalled();
    });

    it('should get audits with filtering', async () => {
      const mockAudits = [
        {
          id: 'audit-1',
          title: 'Security Audit',
          type: AuditType.EXTERNAL,
          status: AuditStatus.IN_PROGRESS,
          tenantId,
          findings: [],
        },
      ];

      mockPrisma.audit.findMany.mockResolvedValue(mockAudits);
      mockPrisma.audit.count.mockResolvedValue(1);

      const result = await service.getAudits(tenantId, { limit: 50, offset: 0 });

      expect(result.data).toEqual(mockAudits);
      expect(result.total).toBe(1);
    });

    it('should get audit by id', async () => {
      const mockAudit = {
        id: 'audit-123',
        title: 'Test Audit',
        tenantId,
        findings: [],
        deletedAt: null,
      };

      mockPrisma.audit.findUnique.mockResolvedValue(mockAudit);

      const result = await service.getAuditById(tenantId, 'audit-123');

      expect(result).toEqual(mockAudit);
    });

    it('should throw if audit not found', async () => {
      mockPrisma.audit.findUnique.mockResolvedValue(null);

      await expect(service.getAuditById(tenantId, 'nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should update audit status', async () => {
      const mockAudit = {
        id: 'audit-123',
        status: AuditStatus.PLANNED,
        tenantId,
        findings: [],
        deletedAt: null,
      };

      mockPrisma.audit.findUnique.mockResolvedValue(mockAudit);
      mockPrisma.audit.update.mockResolvedValue({
        ...mockAudit,
        status: AuditStatus.IN_PROGRESS,
      });

      const result = await service.updateAuditStatus(
        tenantId,
        'audit-123',
        AuditStatus.IN_PROGRESS,
      );

      expect(result.status).toBe(AuditStatus.IN_PROGRESS);
    });
  });

  describe('Finding Operations', () => {
    it('should create a finding', async () => {
      const input: CreateFindingDto = {
        auditId: 'audit-123',
        title: 'Weak Access Controls',
        description: 'Inadequate access control on production systems',
        severity: FindingSeverity.MAJOR,
        category: 'Security',
      };

      mockPrisma.audit.findUnique.mockResolvedValue({
        id: 'audit-123',
        tenantId,
      });

      const mockFinding = {
        id: 'finding-123',
        ...input,
        tenantId,
        status: FindingStatus.OPEN,
        audit: {},
        evidence: [],
        createdAt: new Date(),
        deletedAt: null,
      };

      mockPrisma.finding.create.mockResolvedValue(mockFinding);

      const result = await service.createFinding(tenantId, input);

      expect(result).toEqual(mockFinding);
    });

    it('should get audit findings', async () => {
      const mockFindings = [
        {
          id: '1',
          title: 'Finding 1',
          severity: FindingSeverity.CRITICAL,
          evidence: [],
        },
        {
          id: '2',
          title: 'Finding 2',
          severity: FindingSeverity.MINOR,
          evidence: [],
        },
      ];

      mockPrisma.audit.findUnique.mockResolvedValue({ id: 'audit-123', tenantId });
      mockPrisma.finding.findMany.mockResolvedValue(mockFindings);

      const result = await service.getAuditFindings(tenantId, 'audit-123');

      expect(result).toEqual(mockFindings);
    });

    it('should update finding status', async () => {
      const mockFinding = {
        id: 'finding-123',
        status: FindingStatus.OPEN,
        tenantId,
        audit: {},
        evidence: [],
        deletedAt: null,
      };

      mockPrisma.finding.findUnique.mockResolvedValue(mockFinding);
      mockPrisma.finding.update.mockResolvedValue({
        ...mockFinding,
        status: FindingStatus.IN_REMEDIATION,
      });

      const result = await service.updateFindingStatus(
        tenantId,
        'finding-123',
        FindingStatus.IN_REMEDIATION,
      );

      expect(result.status).toBe(FindingStatus.IN_REMEDIATION);
    });
  });

  describe('Evidence Operations', () => {
    it('should create evidence', async () => {
      const input: CreateEvidenceDto = {
        findingId: 'finding-123',
        title: 'Access Control Policy',
        description: 'Current access control policy document',
        type: EvidenceType.DOCUMENT,
      };

      mockPrisma.finding.findUnique.mockResolvedValue({
        id: 'finding-123',
        tenantId,
        audit: {},
        evidence: [],
        deletedAt: null,
      });

      const mockEvidence = {
        id: 'evidence-123',
        ...input,
        tenantId,
        finding: {},
        createdAt: new Date(),
        deletedAt: null,
      };

      mockPrisma.evidence.create.mockResolvedValue(mockEvidence);

      const result = await service.createEvidence(tenantId, input);

      expect(result).toEqual(mockEvidence);
    });
  });

  describe('Audit Analytics', () => {
    it('should calculate audit statistics', async () => {
      const audits = [
        { status: AuditStatus.PLANNED, type: AuditType.INTERNAL },
        { status: AuditStatus.IN_PROGRESS, type: AuditType.EXTERNAL },
        { status: AuditStatus.REPORT_ISSUED, type: AuditType.COMPLIANCE },
        { status: AuditStatus.CLOSED, type: AuditType.IT },
      ];

      mockPrisma.audit.findMany.mockResolvedValue(audits);

      const result = await service.getAuditStats(tenantId);

      expect(result.total).toBe(4);
      expect(result.byStatus.planned).toBe(1);
      expect(result.byStatus.in_progress).toBe(1);
      expect(result.byStatus.report_issued).toBe(1);
      expect(result.byStatus.closed).toBe(1);
      expect(result.byType.internal).toBe(1);
      expect(result.byType.external).toBe(1);
    });

    it('should calculate finding statistics', async () => {
      const findings = [
        { status: FindingStatus.OPEN, severity: FindingSeverity.CRITICAL },
        { status: FindingStatus.OPEN, severity: FindingSeverity.MAJOR },
        { status: FindingStatus.IN_REMEDIATION, severity: FindingSeverity.MINOR },
        { status: FindingStatus.REMEDIATED, severity: FindingSeverity.OBSERVATION },
      ];

      mockPrisma.finding.findMany.mockResolvedValue(findings);

      const result = await service.getFindingStats(tenantId);

      expect(result.total).toBe(4);
      expect(result.bySeverity.critical).toBe(1);
      expect(result.bySeverity.major).toBe(1);
      expect(result.byStatus.open).toBe(1);
      expect(result.openCount).toBe(2); // open + in_remediation
      expect(result.remediatedCount).toBe(1);
    });

    it('should find open findings', async () => {
      const openFindings = [
        {
          id: '1',
          status: FindingStatus.OPEN,
          severity: FindingSeverity.CRITICAL,
          audit: {},
          evidence: [],
        },
        {
          id: '2',
          status: FindingStatus.IN_REMEDIATION,
          severity: FindingSeverity.MAJOR,
          audit: {},
          evidence: [],
        },
      ];

      mockPrisma.finding.findMany.mockResolvedValue(openFindings);

      const result = await service.getOpenFindings(tenantId);

      expect(result.length).toBe(2);
      expect(result[0].severity).toBe(FindingSeverity.CRITICAL);
    });
  });
});
