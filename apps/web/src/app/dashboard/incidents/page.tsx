'use client';

import { useIncidents } from '@/hooks';

export default function IncidentsPage() {
  const { data: incidents, loading, error } = useIncidents();

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
      const date = new Date(dateString);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      if (hours < 1) return 'Just now';
      if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
      return date.toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">Error loading incidents</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Incident Management</h1>
          <p className="text-gray-600 mt-1">
            Track and manage security incidents
          </p>
        </div>
        <button className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
          + Report Incident
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Open Incidents</p>
          <p className="text-2xl font-bold text-red-600 mt-2">
            {incidents.filter((i) => i.status !== 'resolved').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Critical</p>
          <p className="text-2xl font-bold text-red-600 mt-2">
            {incidents.filter((i) => i.severity === 'critical').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Avg Resolution Time</p>
          <p className="text-2xl font-bold text-blue-600 mt-2">
            {incidents.length > 0 ? '4.2 hrs' : '—'}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Total Incidents</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{incidents.length}</p>
        </div>
      </div>

      {/* Incidents Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin inline-block w-8 h-8 border-4 border-gray-300 border-t-blue-600 rounded-full"></div>
            <p className="text-gray-600 mt-2">Loading incidents...</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900">
                  Incident
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900">
                  Severity
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900">
                  Detected
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-900">
                  Assigned To
                </th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-900">
                  Affected Records
                </th>
                <th className="px-6 py-3 text-center text-xs font-bold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {incidents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-600">
                    No incidents found
                  </td>
                </tr>
              ) : (
                incidents.map((incident) => (
                  <tr key={incident.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">{incident.title}</p>
                      <p className="text-xs text-gray-600">{incident.id}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded text-sm font-bold ${getSeverityColor(
                          incident.severity
                        )}`}
                      >
                        {incident.severity.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 rounded text-sm font-bold ${getStatusColor(
                          incident.status
                        )}`}
                      >
                        {incident.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {formatDate(incident.createdAt || incident.detectedAt)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {incident.assignedTo || '—'}
                    </td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900 font-medium">
                      {incident.affectedRecords && incident.affectedRecords > 0 ? (
                        <span className="text-red-600">{incident.affectedRecords}</span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Investigation Workflow */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Incident Workflow</h2>
        <div className="flex items-center justify-between">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mx-auto">
              1
            </div>
            <p className="text-sm font-medium mt-2">Detection</p>
          </div>
          <div className="flex-1 h-1 bg-blue-600 mx-2"></div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mx-auto">
              2
            </div>
            <p className="text-sm font-medium mt-2">Investigation</p>
          </div>
          <div className="flex-1 h-1 bg-blue-600 mx-2"></div>
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold mx-auto">
              3
            </div>
            <p className="text-sm font-medium mt-2">Containment</p>
          </div>
          <div className="flex-1 h-1 bg-gray-300 mx-2"></div>
          <div className="text-center">
            <div className="w-12 h-12 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center font-bold mx-auto">
              4
            </div>
            <p className="text-sm font-medium mt-2">Resolution</p>
          </div>
        </div>
      </div>
    </div>
  );
}
