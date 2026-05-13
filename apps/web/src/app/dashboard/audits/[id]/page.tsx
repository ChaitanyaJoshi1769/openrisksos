'use client';

import { useAuditDetail } from '@/hooks';
import { useRouter } from 'next/navigation';
import { CardSkeleton } from '@/components';

export default function AuditDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { audit, loading, error } = useAuditDetail(params.id);

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
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Audit Details</h1>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">Error loading audit</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <button
            onClick={() => router.push('/dashboard/audits')}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Go Back to Audits
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            disabled
            className="px-4 py-2 border border-gray-300 rounded-lg opacity-50 cursor-not-allowed"
          >
            ← Back
          </button>
          <div className="animate-pulse bg-gray-200 h-8 w-1/4 rounded"></div>
        </div>

        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Audit Not Found</h1>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 font-medium">The audit you're looking for doesn't exist</p>
          <button
            onClick={() => router.push('/dashboard/audits')}
            className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Go Back to Audits
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{audit.title}</h1>
            <p className="text-gray-600 mt-1">Audit ID: {audit.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-6 py-3 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition">
            Edit Audit
          </button>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Add Finding
          </button>
        </div>
      </div>

      {/* Main Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Overview</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Scope</label>
                <p className="text-gray-900">{audit.scope || '—'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Type</label>
                  <p className="text-gray-900">{audit.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Owner</label>
                  <p className="text-gray-900">{audit.owner}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Findings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Findings Summary</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">{audit.findingsCount || 0}</p>
                <p className="text-sm text-gray-600 mt-1">Total Findings</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">{audit.criticalFindings || 0}</p>
                <p className="text-sm text-gray-600 mt-1">Critical</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-600">
                  {(audit.findingsCount || 0) - (audit.criticalFindings || 0)}
                </p>
                <p className="text-sm text-gray-600 mt-1">Other</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Audit Timeline</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-2 h-2 bg-gray-600 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Scheduled</p>
                  <p className="text-xs text-gray-600">
                    {new Date(audit.scheduledDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {audit.startDate && (
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Started</p>
                    <p className="text-xs text-gray-600">
                      {new Date(audit.startDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
              {audit.endDate && (
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Completed</p>
                    <p className="text-xs text-gray-600">
                      {new Date(audit.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Meta Info */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-bold text-gray-600 mb-4">Status</h3>
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
          </div>

          {/* Type Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-bold text-gray-600 mb-4">Type</h3>
            <span
              className={`inline-block px-3 py-1 rounded text-sm font-bold ${getAuditTypeColor(
                audit.type
              )}`}
            >
              {audit.type}
            </span>
          </div>

          {/* Risk Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-bold text-gray-600 mb-4">Risk Level</h3>
            <p className="text-2xl font-bold text-orange-600">
              {audit.riskLevel || '—'}
            </p>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-bold text-gray-600 mb-4">Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-900 rounded hover:bg-gray-50 text-sm font-medium transition">
                View Report
              </button>
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-900 rounded hover:bg-gray-50 text-sm font-medium transition">
                Add Comment
              </button>
              <button className="w-full px-4 py-2 border border-red-300 text-red-900 rounded hover:bg-red-50 text-sm font-medium transition">
                Archive Audit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
