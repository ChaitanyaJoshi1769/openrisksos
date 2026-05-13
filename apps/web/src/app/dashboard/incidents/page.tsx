'use client';

import { useState } from 'react';

interface Incident {
  id: string;
  title: string;
  severity: string;
  status: string;
  detectedAt: string;
  assignedTo: string;
  affectedRecords: number;
}

export default function IncidentsPage() {
  const [incidents] = useState<Incident[]>([
    {
      id: 'INC001',
      title: 'Unauthorized Access Attempt',
      severity: 'high',
      status: 'investigating',
      detectedAt: '2 hours ago',
      assignedTo: 'Security Team',
      affectedRecords: 0,
    },
    {
      id: 'INC002',
      title: 'Suspicious Login Activity',
      severity: 'medium',
      status: 'investigating',
      detectedAt: '4 hours ago',
      assignedTo: 'CISO',
      affectedRecords: 1,
    },
    {
      id: 'INC003',
      title: 'Data Export Detected',
      severity: 'high',
      status: 'containment',
      detectedAt: '1 day ago',
      assignedTo: 'Incident Response',
      affectedRecords: 250,
    },
    {
      id: 'INC004',
      title: 'Malware Detection',
      severity: 'critical',
      status: 'investigating',
      detectedAt: '3 days ago',
      assignedTo: 'Security Operations',
      affectedRecords: 5,
    },
  ]);

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
          <p className="text-2xl font-bold text-blue-600 mt-2">4.2 hrs</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">This Month</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">12</p>
        </div>
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
            {incidents.map((incident) => (
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
                  {incident.detectedAt}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {incident.assignedTo}
                </td>
                <td className="px-6 py-4 text-center text-sm text-gray-900 font-medium">
                  {incident.affectedRecords > 0 ? (
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
            ))}
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
