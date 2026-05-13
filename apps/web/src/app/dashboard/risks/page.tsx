'use client';

import { useState } from 'react';

interface Risk {
  id: string;
  title: string;
  description: string;
  probability: number;
  impact: number;
  inherentScore: number;
  residualScore: number;
  status: string;
  owner: string;
}

export default function RisksPage() {
  const [risks] = useState<Risk[]>([
    {
      id: 'R001',
      title: 'Data Breach - Customer Database',
      description: 'Unauthorized access to customer PII',
      probability: 3,
      impact: 5,
      inherentScore: 15,
      residualScore: 6,
      status: 'active',
      owner: 'CISO',
    },
    {
      id: 'R002',
      title: 'System Outage - Critical Infrastructure',
      description: 'Downtime affecting core business operations',
      probability: 2,
      impact: 4,
      inherentScore: 8,
      residualScore: 4,
      status: 'active',
      owner: 'CTO',
    },
    {
      id: 'R003',
      title: 'Compliance Violation - GDPR',
      description: 'Non-compliance with data protection regulations',
      probability: 2,
      impact: 4,
      inherentScore: 8,
      residualScore: 3,
      status: 'mitigated',
      owner: 'Compliance Officer',
    },
    {
      id: 'R004',
      title: 'Insider Threat - Privileged Access Abuse',
      description: 'Misuse of elevated system privileges',
      probability: 2,
      impact: 5,
      inherentScore: 10,
      residualScore: 5,
      status: 'active',
      owner: 'Security Manager',
    },
  ]);

  const getSeverityColor = (score: number) => {
    if (score >= 20) return 'bg-red-100 text-red-800';
    if (score >= 15) return 'bg-orange-100 text-orange-800';
    if (score >= 10) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getSeverityLabel = (score: number) => {
    if (score >= 20) return 'CRITICAL';
    if (score >= 15) return 'HIGH';
    if (score >= 10) return 'MEDIUM';
    return 'LOW';
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Risk Register</h1>
          <p className="text-gray-600 mt-1">
            {risks.length} risks identified and tracked
          </p>
        </div>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          + New Risk
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
          <option>All Statuses</option>
          <option>Active</option>
          <option>Mitigated</option>
          <option>Closed</option>
        </select>
        <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
          <option>All Severities</option>
          <option>Critical</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <input
          type="text"
          placeholder="Search risks..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm"
        />
      </div>

      {/* Risk Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-900">
                Risk Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-900">
                Owner
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-900">
                Probability
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-900">
                Impact
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-900">
                Inherent Score
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-900">
                Residual Score
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-900">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {risks.map((risk) => (
              <tr key={risk.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <div>
                    <p className="font-medium text-gray-900">{risk.title}</p>
                    <p className="text-sm text-gray-600">{risk.description}</p>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{risk.owner}</td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-block w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-bold">
                    {risk.probability}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-block w-8 h-8 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center text-sm font-bold">
                    {risk.impact}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-block px-3 py-1 rounded text-sm font-bold ${getSeverityColor(
                      risk.inherentScore
                    )}`}
                  >
                    {risk.inherentScore}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded text-sm font-bold">
                    {risk.residualScore}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-block px-3 py-1 rounded text-sm font-bold ${
                      risk.status === 'active'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {risk.status.charAt(0).toUpperCase() + risk.status.slice(1)}
                  </span>
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

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Critical Risks</p>
          <p className="text-2xl font-bold text-red-600 mt-2">
            {risks.filter((r) => r.inherentScore >= 20).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">High Risks</p>
          <p className="text-2xl font-bold text-orange-600 mt-2">
            {risks.filter((r) => r.inherentScore >= 15 && r.inherentScore < 20).length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Active Risks</p>
          <p className="text-2xl font-bold text-blue-600 mt-2">
            {risks.filter((r) => r.status === 'active').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Avg Residual Score</p>
          <p className="text-2xl font-bold text-green-600 mt-2">
            {Math.round(
              risks.reduce((sum, r) => sum + r.residualScore, 0) / risks.length
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
