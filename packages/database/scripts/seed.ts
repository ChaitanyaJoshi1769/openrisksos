import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  try {
    // Clean up existing data
    console.log('Cleaning up existing data...');
    await prisma.workflowInstance.deleteMany({});
    await prisma.workflow.deleteMany({});
    await prisma.policy.deleteMany({});
    await prisma.evidence.deleteMany({});
    await prisma.correctiveAction.deleteMany({});
    await prisma.incidentTimeline.deleteMany({});
    await prisma.incident.deleteMany({});
    await prisma.auditFinding.deleteMany({});
    await prisma.auditEvidence.deleteMany({});
    await prisma.audit.deleteMany({});
    await prisma.vendorBreach.deleteMany({});
    await prisma.vendorAssessment.deleteMany({});
    await prisma.vendor.deleteMany({});
    await prisma.riskMitigation.deleteMany({});
    await prisma.riskControl.deleteMany({});
    await prisma.risk.deleteMany({});
    await prisma.complianceControl.deleteMany({});
    await prisma.complianceFramework.deleteMany({});
    await prisma.dashboard.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.tenant.deleteMany({});

    // Create test tenant
    console.log('Creating test tenant...');
    const tenant = await prisma.tenant.create({
      data: {
        name: 'Acme Corporation',
        slug: 'acme-corp',
        description: 'Test tenant for OpenRiskOS',
        status: 'active',
        tier: 'enterprise',
      },
    });

    // Create admin user
    console.log('Creating admin user...');
    const adminUser = await prisma.user.create({
      data: {
        tenantId: tenant.id,
        email: 'admin@acme.com',
        name: 'Admin User',
        role: 'admin',
        status: 'active',
        emailVerified: true,
        mfaEnabled: false,
      },
    });

    // Create additional users
    console.log('Creating users...');
    const users = await Promise.all([
      prisma.user.create({
        data: {
          tenantId: tenant.id,
          email: 'ciso@acme.com',
          name: 'CISO',
          role: 'admin',
          status: 'active',
          emailVerified: true,
        },
      }),
      prisma.user.create({
        data: {
          tenantId: tenant.id,
          email: 'auditor@acme.com',
          name: 'Internal Auditor',
          role: 'auditor',
          status: 'active',
          emailVerified: true,
        },
      }),
      prisma.user.create({
        data: {
          tenantId: tenant.id,
          email: 'compliance@acme.com',
          name: 'Compliance Officer',
          role: 'user',
          status: 'active',
          emailVerified: true,
        },
      }),
    ]);

    // Create compliance frameworks
    console.log('Creating compliance frameworks...');
    const frameworks = await Promise.all([
      prisma.complianceFramework.create({
        data: {
          tenantId: tenant.id,
          name: 'ISO 27001',
          type: 'ISO27001',
          description: 'Information Security Management',
          status: 'active',
          totalControls: 114,
        },
      }),
      prisma.complianceFramework.create({
        data: {
          tenantId: tenant.id,
          name: 'GDPR',
          type: 'GDPR',
          description: 'General Data Protection Regulation',
          status: 'active',
          totalControls: 42,
        },
      }),
      prisma.complianceFramework.create({
        data: {
          tenantId: tenant.id,
          name: 'HIPAA',
          type: 'HIPAA',
          description: 'Health Insurance Portability and Accountability Act',
          status: 'active',
          totalControls: 87,
        },
      }),
    ]);

    // Create compliance controls
    console.log('Creating compliance controls...');
    const controls = await Promise.all([
      prisma.complianceControl.create({
        data: {
          tenantId: tenant.id,
          frameworkId: frameworks[0].id,
          title: 'Information Security Policy',
          description: 'Establish and maintain an information security policy',
          status: 'compliant',
          assignedTo: users[1].id,
        },
      }),
      prisma.complianceControl.create({
        data: {
          tenantId: tenant.id,
          frameworkId: frameworks[0].id,
          title: 'Access Control',
          description: 'Implement access control mechanisms',
          status: 'non_compliant',
          assignedTo: users[2].id,
        },
      }),
      prisma.complianceControl.create({
        data: {
          tenantId: tenant.id,
          frameworkId: frameworks[1].id,
          title: 'Data Protection Impact Assessment',
          description: 'Conduct DPIA for high-risk processing',
          status: 'compliant',
          assignedTo: users[2].id,
        },
      }),
    ]);

    // Create risks
    console.log('Creating risks...');
    const risks = await Promise.all([
      prisma.risk.create({
        data: {
          tenantId: tenant.id,
          title: 'Data Breach - Customer Database',
          description: 'Unauthorized access to customer PII',
          riskCategory: 'cyber',
          status: 'active',
          probability: 3,
          inherentImpact: 5,
          inherentScore: 15,
          mitigationEffectiveness: 60,
          residualScore: 6,
          owner: users[0].id,
        },
      }),
      prisma.risk.create({
        data: {
          tenantId: tenant.id,
          title: 'System Outage - Critical Infrastructure',
          description: 'Downtime affecting core business operations',
          riskCategory: 'operational',
          status: 'active',
          probability: 2,
          inherentImpact: 4,
          inherentScore: 8,
          mitigationEffectiveness: 50,
          residualScore: 4,
          owner: users[0].id,
        },
      }),
      prisma.risk.create({
        data: {
          tenantId: tenant.id,
          title: 'Compliance Violation - GDPR',
          description: 'Non-compliance with data protection regulations',
          riskCategory: 'compliance',
          status: 'mitigated',
          probability: 2,
          inherentImpact: 4,
          inherentScore: 8,
          mitigationEffectiveness: 62,
          residualScore: 3,
          owner: users[2].id,
        },
      }),
    ]);

    // Create incidents
    console.log('Creating incidents...');
    const incidents = await Promise.all([
      prisma.incident.create({
        data: {
          tenantId: tenant.id,
          title: 'Unauthorized Access Attempt',
          description: 'Suspicious login from unknown IP',
          type: 'SECURITY',
          severity: 'HIGH',
          status: 'INVESTIGATING',
          detectedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          affectedRecords: 0,
          assignedTo: users[0].id,
        },
      }),
      prisma.incident.create({
        data: {
          tenantId: tenant.id,
          title: 'Data Export Detected',
          description: 'Large data export from internal database',
          type: 'DATA_BREACH',
          severity: 'CRITICAL',
          status: 'CONTAINMENT',
          detectedAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          affectedRecords: 250,
          assignedTo: users[0].id,
        },
      }),
    ]);

    // Create audits
    console.log('Creating audits...');
    const audits = await Promise.all([
      prisma.audit.create({
        data: {
          tenantId: tenant.id,
          title: 'Annual Information Security Audit',
          type: 'INTERNAL',
          scope: 'Infrastructure & Systems',
          status: 'IN_PROGRESS',
          scheduledDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), // started 12 days ago
          plannedEndDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000), // ends in 18 days
          planner: users[1].id,
          assignedTo: users[1].id,
        },
      }),
      prisma.audit.create({
        data: {
          tenantId: tenant.id,
          title: 'SOC 2 Type II Audit',
          type: 'EXTERNAL',
          scope: 'Security, Availability, Integrity',
          status: 'DRAFT_REPORT',
          scheduledDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // started 30 days ago
          plannedEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // ends in 7 days
          planner: users[0].id,
          assignedTo: users[0].id,
        },
      }),
    ]);

    // Create audit findings
    console.log('Creating audit findings...');
    await Promise.all([
      prisma.auditFinding.create({
        data: {
          tenantId: tenant.id,
          auditId: audits[0].id,
          title: 'Lack of MFA on Admin Accounts',
          description: 'Admin accounts do not have multi-factor authentication enabled',
          severity: 'CRITICAL',
          status: 'OPEN',
          dueDate: new Date(Date.now() + 33 * 24 * 60 * 60 * 1000), // due in 33 days
        },
      }),
      prisma.auditFinding.create({
        data: {
          tenantId: tenant.id,
          auditId: audits[0].id,
          title: 'Insufficient Encryption Standards',
          description: 'Some data is not encrypted using current standards',
          severity: 'MAJOR',
          status: 'IN_REMEDIATION',
          dueDate: new Date(Date.now() + 48 * 24 * 60 * 60 * 1000), // due in 48 days
        },
      }),
    ]);

    // Create vendors
    console.log('Creating vendors...');
    const vendors = await Promise.all([
      prisma.vendor.create({
        data: {
          tenantId: tenant.id,
          name: 'CloudSecure Inc.',
          classification: 'CRITICAL',
          status: 'ACTIVE',
          riskScore: 24,
          description: 'Cloud infrastructure provider',
          manager: users[2].id,
          lastAssessmentDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
          nextReviewDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days from now
        },
      }),
      prisma.vendor.create({
        data: {
          tenantId: tenant.id,
          name: 'DataVault Solutions',
          classification: 'HIGH',
          status: 'ACTIVE',
          riskScore: 35,
          description: 'Data storage and backup solutions',
          manager: users[2].id,
          lastAssessmentDate: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000), // 28 days ago
          nextReviewDate: new Date(Date.now() + 92 * 24 * 60 * 60 * 1000), // 92 days from now
        },
      }),
    ]);

    // Create vendor assessments
    console.log('Creating vendor assessments...');
    await Promise.all([
      prisma.vendorAssessment.create({
        data: {
          tenantId: tenant.id,
          vendorId: vendors[0].id,
          type: 'SOC2_REPORT',
          date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          status: 'COMPLETED',
          assessor: users[1].id,
        },
      }),
      prisma.vendorAssessment.create({
        data: {
          tenantId: tenant.id,
          vendorId: vendors[1].id,
          type: 'SECURITY_QUESTIONNAIRE',
          date: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000),
          status: 'COMPLETED',
          assessor: users[1].id,
        },
      }),
    ]);

    // Create vendor breaches
    console.log('Creating vendor breaches...');
    await Promise.all([
      prisma.vendorBreach.create({
        data: {
          tenantId: tenant.id,
          vendorId: vendors[1].id,
          title: 'Data exposure incident',
          severity: 'HIGH',
          status: 'INVESTIGATING',
          reportedDate: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
          affectedRecords: 2500,
          description: 'Customer data was exposed due to misconfiguration',
        },
      }),
    ]);

    console.log('✅ Database seeding completed successfully!');
    console.log(`\n📊 Summary:`);
    console.log(`   - Tenant: ${tenant.name}`);
    console.log(`   - Users: 4`);
    console.log(`   - Frameworks: ${frameworks.length}`);
    console.log(`   - Controls: ${controls.length}`);
    console.log(`   - Risks: ${risks.length}`);
    console.log(`   - Incidents: ${incidents.length}`);
    console.log(`   - Audits: ${audits.length}`);
    console.log(`   - Vendors: ${vendors.length}`);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
