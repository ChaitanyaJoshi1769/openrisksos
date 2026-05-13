'use client';

import Link from 'next/link';
import { useAudits } from '@/hooks';

export default function AuditsPage() {
  const { data: audits, loading, error } = useAudits();

  const findings = audits.flatMap((a: any) => a.findings || []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned':
        return 'bg-gray-100 text-gray-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft_report':
        return 'bg-orange-100 text-orange-800';
      case 'report_issued':
        return 'bg-purple-100 text-purple-800';
      case 'closed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'major':
        return 'bg-orange-100 text-orange-800';
      case 'minor':
        return 'bg-yellow-100 text-yellow-800';
      case 'observation':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFindingStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800';
      case 'in_remediation':
        return 'bg-yellow-100 text-yellow-800';
      case 'remediated':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-green-100 text-green-800';
      case 'deferred':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAuditTypeColor = (type: string) => {
    switch (type) {
      case 'Internal':
        return 'bg-blue-100 text-blue-800';
      case 'External':
        return 'bg-purple-100 text-purple-800';
      case 'Compliance':
        return 'bg-green-100 text-green-800';
      case 'IT':
        return 'bg-orange-100 text-orange-800';
      case 'Operational':
        return 'bg-yellow-100 text-yellow-800';
      case 'Financial':
        return 'bg-pink-100 text-pink-800';
      case 'Special':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">Error loading audits</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audit Management</h1>
          <p className="text-gray-600 mt-1">
            Plan, execute, and track audits
          </p>
        </div>
        <Link href="/dashboard/audits/new" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition inline-block">
          + Schedule Audit
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-4">
                <div className="animate-pulse bg-gray-200 h-4 w-1/2 rounded"></div>
                <div className="animate-pulse bg-gray-200 h-8 w-1/3 rounded mt-2"></div>
              </div>
            ))
          : [
              { label: 'Total Audits', value: audits.length, color: 'text-blue-600' },
              { label: 'In Progress', value: audits.filter((a: any) => a.status === 'in_progress').length, color: 'text-yellow-600' },
              { label: 'Open Findings', value: findings.filter((f: any) => f.status === 'open').length, color: 'text-red-600' },
              { label: 'Avg Closure Time', value: '45 days', color: 'text-green-600' },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-4">
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color} mt-2`}>{stat.value}</p>
              </div>
            ))}
      </div>

      {/* Audits Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-900">
                Audit
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-900">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-900">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-900">
                Scheduled Date
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-900">
                Findings
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-900">
                Owner
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <>
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="animate-pulse bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
                      <div className="animate-pulse bg-gray-200 h-3 w-1/2 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="animate-pulse bg-gray-200 h-6 w-24 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="animate-pulse bg-gray-200 h-4 w-1/2 rounded"></div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="animate-pulse bg-gray-200 h-4 w-12 rounded mx-auto"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="animate-pulse bg-gray-200 h-4 w-1/3 rounded"></div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="animate-pulse bg-gray-200 h-4 w-12 rounded mx-auto"></div>
                    </td>
                  </tr>
                ))}
              </>
            ) : audits.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-600">
                  No audits found
                </td>
              </tr>
            ) : (
              audits.map((audit: any) => (
                <tr key={audit.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{audit.title}</p>
                    <p className="text-xs text-gray-600">{audit.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded text-sm font-bold ${getAuditTypeColor(
                        audit.type
                      )}`}
                    >
                      {audit.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-3 py-1 rounded text-sm font-bold ${getStatusColor(
                        audit.status
                      )}`}
                    >
                      {audit.status
                        .split('_')
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(audit.scheduledDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {audit.criticalFindings > 0 && (
                        <span className="inline-block px-2 py-1 bg-red-100 text-red-800 rounded text-xs font-bold">
                          {audit.criticalFindings}C
                        </span>
                      )}
                      <span className="text-sm font-medium text-gray-900">
                        {audit.findingsCount}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {audit.owner}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link href={`/dashboard/audits/${audit.id}`} className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Findings Summary */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Open Findings</h2>
        <div className="space-y-3">
          {loading ? (
            <>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded border border-gray-200">
                  <div className="flex-1">
                    <div className="animate-pulse bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
                    <div className="animate-pulse bg-gray-200 h-3 w-1/2 rounded"></div>
                  </div>
                  <div className="animate-pulse bg-gray-200 h-6 w-20 rounded ml-4"></div>
                </div>
              ))}
            </>
          ) : findings.length === 0 ? (
            <p className="text-gray-600 text-center py-4">No open findings</p>
          ) : (
            findings
              .filter((f: any) => f.status === 'open' || f.status === 'in_remediation')
              .map((finding: any) => (
                <div
                  key={finding.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded border border-gray-200 hover:border-gray-300 transition"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-gray-900">{finding.title}</p>
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${getSeverityColor(
                          finding.severity
                        )}`}
                      >
                        {finding.severity.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Audit {finding.auditId} • Due {new Date(finding.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded text-sm font-medium ${getFindingStatusColor(
                      finding.status
                    )}`}
                  >
                    {finding.status
                      .split('_')
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')}
                  </span>
                </div>
              ))
          )}
        </div>
      </div>

      {/* Audit Timeline */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Audit Lifecycle</h2>
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-300 text-white rounded-full flex items-center justify-center font-bold mx-auto">
              1
            </div>
            <p className="text-sm font-medium mt-2">Planning</p>
          </div>
          <div className="flex-1 h-1 bg-gray-300 mx-2"></div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mx-auto">
              2
            </div>
            <p className="text-sm font-medium mt-2">Execution</p>
          </div>
          <div className="flex-1 h-1 bg-blue-600 mx-2"></div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mx-auto">
              3
            </div>
            <p className="text-sm font-medium mt-2">Reporting</p>
          </div>
          <div className="flex-1 h-1 bg-gray-300 mx-2"></div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-bold mx-auto">
              4
            </div>
            <p className="text-sm font-medium mt-2">Closure</p>
          </div>
        </div>
      </div>
    </div>
  );
}
