'use client';

import { useState } from 'react';
import { useRisks } from '@/hooks';

export default function RisksPage() {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [severityFilter, setSeverityFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const { data: risks, loading, error, refetch } = useRisks();

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

  const filteredRisks = risks.filter((risk) => {
    const matchesStatus = !statusFilter || risk.status === statusFilter;
    const matchesSeverity = !severityFilter || getSeverityLabel(risk.inherentScore) === severityFilter;
    const matchesSearch =
      !searchQuery ||
      risk.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      risk.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSeverity && matchesSearch;
  });

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">Error loading risks</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <button
            onClick={() => refetch()}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

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
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="mitigated">Mitigated</option>
          <option value="closed">Closed</option>
        </select>
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="">All Severities</option>
          <option value="CRITICAL">Critical</option>
          <option value="HIGH">High</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
        <input
          type="text"
          placeholder="Search risks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
            {loading ? (
              <>
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div>
                        <div className="animate-pulse bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
                        <div className="animate-pulse bg-gray-200 h-3 w-1/2 rounded"></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="animate-pulse bg-gray-200 h-4 w-1/2 rounded"></div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="animate-pulse bg-gray-200 h-8 w-8 rounded-full mx-auto"></div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="animate-pulse bg-gray-200 h-8 w-8 rounded-full mx-auto"></div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="animate-pulse bg-gray-200 h-6 w-12 rounded mx-auto"></div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="animate-pulse bg-gray-200 h-6 w-12 rounded mx-auto"></div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="animate-pulse bg-gray-200 h-6 w-16 rounded mx-auto"></div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="animate-pulse bg-gray-200 h-4 w-12 rounded mx-auto"></div>
                    </td>
                  </tr>
                ))}
              </>
            ) : filteredRisks.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-gray-600">
                  {searchQuery || statusFilter || severityFilter
                    ? 'No risks match your filters'
                    : 'No risks found'}
                </td>
              </tr>
            ) : (
              filteredRisks.map((risk) => (
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
              ))
            )}
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
            {risks.length > 0
              ? Math.round(risks.reduce((sum, r) => sum + r.residualScore, 0) / risks.length)
              : 0}
          </p>
        </div>
      </div>
    </div>
  );
}
