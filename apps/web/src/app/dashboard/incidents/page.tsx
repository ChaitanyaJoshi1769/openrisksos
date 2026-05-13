'use client';

import Link from 'next/link';
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
        <Link href="/dashboard/incidents/new" className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition inline-block">
          + Report Incident
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
              { label: 'Open Incidents', value: incidents.filter((i) => i.status !== 'resolved').length, color: 'text-red-600' },
              { label: 'Critical', value: incidents.filter((i) => i.severity === 'critical').length, color: 'text-red-600' },
              { label: 'Avg Resolution Time', value: incidents.length > 0 ? '4.2 hrs' : '—', color: 'text-blue-600' },
              { label: 'Total Incidents', value: incidents.length, color: 'text-gray-900' },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-4">
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color} mt-2`}>{stat.value}</p>
              </div>
            ))}
      </div>

      {/* Incidents Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
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
                      <div className="animate-pulse bg-gray-200 h-6 w-16 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="animate-pulse bg-gray-200 h-4 w-1/2 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="animate-pulse bg-gray-200 h-4 w-1/3 rounded"></div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="animate-pulse bg-gray-200 h-4 w-8 rounded mx-auto"></div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="animate-pulse bg-gray-200 h-4 w-12 rounded mx-auto"></div>
                    </td>
                  </tr>
                ))}
              </>
            ) : incidents.length === 0 ? (
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
                    <Link href={`/dashboard/incidents/${incident.id}`} className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
