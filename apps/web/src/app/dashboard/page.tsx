'use client';

import { useRisks, useCompliance, useIncidents } from '@/hooks';

export default function DashboardPage() {
  const { data: risks, loading: risksLoading } = useRisks();
  const { frameworks, overallScore, loading: complianceLoading } = useCompliance();
  const { data: incidents, loading: incidentsLoading } = useIncidents();

  const loading = risksLoading || complianceLoading || incidentsLoading;
  const criticalRisks = risks.filter((r: any) => r.inherentScore >= 20).length;
  const openIncidents = incidents.filter((i: any) => i.status !== 'resolved').length;

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Key Metrics Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <div className="animate-pulse bg-gray-200 h-4 w-3/4 rounded"></div>
              <div className="animate-pulse bg-gray-200 h-8 w-1/2 rounded mt-4"></div>
              <div className="animate-pulse bg-gray-200 h-2 w-full rounded mt-4"></div>
            </div>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse bg-gray-200 h-5 w-1/3 rounded mb-4"></div>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 25 }).map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-200 h-12 rounded"></div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="animate-pulse bg-gray-200 h-5 w-1/3 rounded mb-4"></div>
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-gray-50 rounded p-3">
                  <div className="animate-pulse bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
                  <div className="animate-pulse bg-gray-200 h-3 w-1/2 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Total Risks */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-600 text-sm font-medium">Total Risks</div>
          <div className="text-4xl font-bold text-gray-900 mt-2">
            {risks.length}
          </div>
          <div className="text-red-600 text-xs mt-2">
            {criticalRisks} Critical
          </div>
        </div>

        {/* Compliance Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-600 text-sm font-medium">Compliance</div>
          <div className="text-4xl font-bold text-gray-900 mt-2">
            {overallScore}%
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div
              className="bg-green-600 h-2 rounded-full"
              style={{ width: `${overallScore}%` }}
            ></div>
          </div>
        </div>

        {/* Open Incidents */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-600 text-sm font-medium">Open Incidents</div>
          <div className="text-4xl font-bold text-gray-900 mt-2">
            {openIncidents}
          </div>
          <div className="text-yellow-600 text-xs mt-2">Active</div>
        </div>

        {/* Compliance Frameworks */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-600 text-sm font-medium">Frameworks</div>
          <div className="text-4xl font-bold text-gray-900 mt-2">
            {frameworks.length}
          </div>
          <div className="text-blue-600 text-xs mt-2">Active</div>
        </div>

        {/* Last Updated */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-600 text-sm font-medium">Last Updated</div>
          <div className="text-sm font-mono text-gray-900 mt-2">
            {new Date().toLocaleTimeString()}
          </div>
          <div className="text-blue-600 text-xs mt-4 cursor-pointer hover:underline">
            Refresh Now
          </div>
        </div>
      </div>

      {/* Charts and Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Risk Heatmap */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Risk Heatmap</h2>
          <div className="grid grid-cols-5 gap-2">
            {Array.from({ length: 25 }).map((_, i) => (
              <div
                key={i}
                className={`h-12 rounded flex items-center justify-center text-white text-xs font-bold ${
                  Math.random() > 0.7 ? 'bg-red-600' : 'bg-green-600'
                }`}
              >
                {Math.floor(Math.random() * 5)}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-600 mt-4">
            5×5 Probability-Impact Matrix
          </p>
        </div>

        {/* Recent Incidents */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Incidents</h2>
          <div className="space-y-3">
            {incidents.slice(0, 3).map((incident: any) => (
              <div
                key={incident.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {incident.title}
                  </p>
                  <p className="text-xs text-gray-600">
                    {incident.createdAt
                      ? new Date(incident.createdAt).toLocaleDateString()
                      : 'Recently'}
                  </p>
                </div>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded ${
                    incident.severity === 'critical' || incident.severity === 'high'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {incident.severity.toUpperCase()}
                </span>
              </div>
            ))}
            {incidents.length === 0 && (
              <p className="text-gray-600 text-center py-4">No recent incidents</p>
            )}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          💡 <strong>Tip:</strong> Use the navigation menu on the left to explore Risk Register,
          Compliance Status, Incidents, and more detailed analytics.
        </p>
      </div>
    </div>
  );
}
