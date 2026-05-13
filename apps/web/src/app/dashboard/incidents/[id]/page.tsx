'use client';

import { useIncidentDetail } from '@/hooks';
import { useRouter } from 'next/navigation';
import { CardSkeleton } from '@/components';

export default function IncidentDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { incident, loading, error } = useIncidentDetail(params.id);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'investigating':
        return 'bg-blue-100 text-blue-800';
      case 'containment':
        return 'bg-orange-100 text-orange-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
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
          <h1 className="text-3xl font-bold text-gray-900">Incident Details</h1>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">Error loading incident</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <button
            onClick={() => router.push('/dashboard/incidents')}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Go Back to Incidents
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

  if (!incident) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Incident Not Found</h1>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 font-medium">The incident you're looking for doesn't exist</p>
          <button
            onClick={() => router.push('/dashboard/incidents')}
            className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Go Back to Incidents
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
            <h1 className="text-3xl font-bold text-gray-900">{incident.title}</h1>
            <p className="text-gray-600 mt-1">Incident ID: {incident.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-6 py-3 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition">
            Update Status
          </button>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Add Note
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
                <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                <p className="text-gray-900">{incident.description || '—'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Type</label>
                  <p className="text-gray-900">{incident.type || '—'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Assigned To</label>
                  <p className="text-gray-900">{incident.assignedTo || '—'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Impact Analysis */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Impact Analysis</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Affected Records</label>
                <p className="text-2xl font-bold text-red-600">
                  {incident.affectedRecords || 0}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Systems Impacted</label>
                <p className="text-2xl font-bold text-orange-600">
                  {incident.systemsImpacted || 0}
                </p>
              </div>
            </div>

            {incident.impact && (
              <div className="mt-4 pt-4 border-t">
                <label className="block text-sm font-medium text-gray-600 mb-2">Impact Summary</label>
                <p className="text-gray-900">{incident.impact}</p>
              </div>
            )}
          </div>

          {/* Investigation Timeline */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Investigation Timeline</h2>
            <div className="space-y-4">
              {incident.detectedAt && (
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Detected</p>
                    <p className="text-xs text-gray-600">{formatDate(incident.detectedAt)}</p>
                  </div>
                </div>
              )}
              {incident.createdAt && (
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Reported</p>
                    <p className="text-xs text-gray-600">{formatDate(incident.createdAt)}</p>
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
                incident.status
              )}`}
            >
              {incident.status.toUpperCase()}
            </span>
          </div>

          {/* Severity Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-bold text-gray-600 mb-4">Severity</h3>
            <span
              className={`inline-block px-3 py-1 rounded text-sm font-bold ${getSeverityColor(
                incident.severity
              )}`}
            >
              {incident.severity.toUpperCase()}
            </span>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-bold text-gray-600 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-600">Detection to Report</p>
                <p className="text-sm font-medium text-gray-900">
                  {incident.detectedAt && incident.createdAt
                    ? `${Math.round(
                        (new Date(incident.createdAt).getTime() -
                          new Date(incident.detectedAt).getTime()) /
                          (1000 * 60 * 60)
                      )} hours`
                    : '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-bold text-gray-600 mb-4">Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-900 rounded hover:bg-gray-50 text-sm font-medium transition">
                Add Note
              </button>
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-900 rounded hover:bg-gray-50 text-sm font-medium transition">
                Add Evidence
              </button>
              <button className="w-full px-4 py-2 border border-red-300 text-red-900 rounded hover:bg-red-50 text-sm font-medium transition">
                Close Incident
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
