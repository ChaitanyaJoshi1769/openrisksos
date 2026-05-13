import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateAuditDto,
  UpdateAuditDto,
  CreateFindingDto,
  CreateEvidenceDto,
  AuditFilterDto,
  AuditStatus,
  FindingStatus,
} from './dto';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  // Audit Operations
  async createAudit(tenantId: string, input: CreateAuditDto) {
    return this.prisma.audit.create({
      data: {
        ...input,
        tenantId,
        findings: {
          create: [],
        },
      },
      include: { findings: true },
    });
  }

  async getAudits(tenantId: string, filter: AuditFilterDto) {
    const where = {
      tenantId,
      deletedAt: null,
      ...(filter.status && { status: filter.status }),
      ...(filter.type && { type: filter.type }),
      ...(filter.priority && { priority: filter.priority }),
      ...(filter.leadAuditor && { leadAuditor: filter.leadAuditor }),
      ...(filter.auditedArea && { auditedArea: filter.auditedArea }),
    };

    const [audits, total] = await Promise.all([
      this.prisma.audit.findMany({
        where,
        include: { findings: true },
        take: filter.limit,
        skip: filter.offset,
        orderBy: { [filter.sortBy]: filter.sortOrder },
      }),
      this.prisma.audit.count({ where }),
    ]);

    return { data: audits, total, limit: filter.limit, offset: filter.offset };
  }

  async getAuditById(tenantId: string, id: string) {
    const audit = await this.prisma.audit.findUnique({
      where: { id },
      include: { findings: { include: { evidence: true } } },
    });

    if (!audit || audit.tenantId !== tenantId || audit.deletedAt) {
      throw new NotFoundException(`Audit ${id} not found`);
    }

    return audit;
  }

  async updateAudit(tenantId: string, id: string, input: UpdateAuditDto) {
    await this.getAuditById(tenantId, id);

    return this.prisma.audit.update({
      where: { id },
      data: input,
      include: { findings: true },
    });
  }

  async updateAuditStatus(tenantId: string, id: string, status: AuditStatus) {
    await this.getAuditById(tenantId, id);

    return this.prisma.audit.update({
      where: { id },
      data: { status },
      include: { findings: true },
    });
  }

  async deleteAudit(tenantId: string, id: string) {
    const audit = await this.getAuditById(tenantId, id);

    return this.prisma.audit.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // Finding Operations
  async createFinding(tenantId: string, input: CreateFindingDto) {
    const audit = await this.getAuditById(tenantId, input.auditId);

    return this.prisma.finding.create({
      data: {
        ...input,
        tenantId,
        evidence: {
          create: [],
        },
      },
      include: { audit: true, evidence: true },
    });
  }

  async getAuditFindings(tenantId: string, auditId: string) {
    await this.getAuditById(tenantId, auditId);

    return this.prisma.finding.findMany({
      where: {
        tenantId,
        auditId,
        deletedAt: null,
      },
      include: { evidence: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getFindingById(tenantId: string, id: string) {
    const finding = await this.prisma.finding.findUnique({
      where: { id },
      include: { audit: true, evidence: true },
    });

    if (!finding || finding.tenantId !== tenantId || finding.deletedAt) {
      throw new NotFoundException(`Finding ${id} not found`);
    }

    return finding;
  }

  async updateFinding(tenantId: string, id: string, input: Partial<CreateFindingDto>) {
    await this.getFindingById(tenantId, id);

    return this.prisma.finding.update({
      where: { id },
      data: input,
      include: { audit: true, evidence: true },
    });
  }

  async updateFindingStatus(tenantId: string, id: string, status: FindingStatus) {
    await this.getFindingById(tenantId, id);

    return this.prisma.finding.update({
      where: { id },
      data: { status },
      include: { audit: true, evidence: true },
    });
  }

  async deleteFinding(tenantId: string, id: string) {
    const finding = await this.getFindingById(tenantId, id);

    return this.prisma.finding.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // Evidence Operations
  async createEvidence(tenantId: string, input: CreateEvidenceDto) {
    const finding = await this.getFindingById(tenantId, input.findingId);

    return this.prisma.evidence.create({
      data: {
        ...input,
        tenantId,
      },
      include: { finding: true },
    });
  }

  async getEvidenceByFinding(tenantId: string, findingId: string) {
    await this.getFindingById(tenantId, findingId);

    return this.prisma.evidence.findMany({
      where: {
        tenantId,
        findingId,
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async deleteEvidence(tenantId: string, id: string) {
    const evidence = await this.prisma.evidence.findUnique({ where: { id } });

    if (!evidence || evidence.tenantId !== tenantId || evidence.deletedAt) {
      throw new NotFoundException(`Evidence ${id} not found`);
    }

    return this.prisma.evidence.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // Audit Analytics
  async getAuditStats(tenantId: string) {
    const audits = await this.prisma.audit.findMany({
      where: { tenantId, deletedAt: null },
      select: { status: true, type: true },
    });

    const total = audits.length;
    const byStatus = {
      planned: audits.filter((a) => a.status === 'planned').length,
      scheduled: audits.filter((a) => a.status === 'scheduled').length,
      in_progress: audits.filter((a) => a.status === 'in_progress').length,
      draft_report: audits.filter((a) => a.status === 'draft_report').length,
      report_issued: audits.filter((a) => a.status === 'report_issued').length,
      closed: audits.filter((a) => a.status === 'closed').length,
    };

    const byType = {
      internal: audits.filter((a) => a.type === 'internal').length,
      external: audits.filter((a) => a.type === 'external').length,
      compliance: audits.filter((a) => a.type === 'compliance').length,
      it: audits.filter((a) => a.type === 'it').length,
      operational: audits.filter((a) => a.type === 'operational').length,
      financial: audits.filter((a) => a.type === 'financial').length,
      special: audits.filter((a) => a.type === 'special').length,
    };

    return {
      total,
      byStatus,
      byType,
      inProgressCount:
        byStatus.planned + byStatus.scheduled + byStatus.in_progress + byStatus.draft_report,
      completedCount: byStatus.report_issued + byStatus.closed,
    };
  }

  async getFindingStats(tenantId: string, auditId?: string) {
    const where = {
      tenantId,
      deletedAt: null,
      ...(auditId && { auditId }),
    };

    const findings = await this.prisma.finding.findMany({
      where,
      select: { status: true, severity: true },
    });

    const total = findings.length;
    const bySeverity = {
      critical: findings.filter((f) => f.severity === 'critical').length,
      major: findings.filter((f) => f.severity === 'major').length,
      minor: findings.filter((f) => f.severity === 'minor').length,
      observation: findings.filter((f) => f.severity === 'observation').length,
    };

    const byStatus = {
      open: findings.filter((f) => f.status === 'open').length,
      in_remediation: findings.filter((f) => f.status === 'in_remediation').length,
      remediated: findings.filter((f) => f.status === 'remediated').length,
      closed: findings.filter((f) => f.status === 'closed').length,
      deferred: findings.filter((f) => f.status === 'deferred').length,
    };

    const openCount = byStatus.open + byStatus.in_remediation;
    const remediatedCount = byStatus.remediated + byStatus.closed;

    return {
      total,
      bySeverity,
      byStatus,
      openCount,
      remediatedCount,
      criticalCount: bySeverity.critical,
    };
  }

  async getOpenFindings(tenantId: string) {
    return this.prisma.finding.findMany({
      where: {
        tenantId,
        deletedAt: null,
        status: { in: ['open', 'in_remediation'] },
      },
      include: { audit: true, evidence: true },
      orderBy: { severity: 'desc' },
    });
  }
}
