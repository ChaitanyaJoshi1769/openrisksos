'use client';

import { useEffect, useState } from 'react';

interface DashboardStats {
  totalRisks: number;
  criticalRisks: number;
  compliancePercentage: number;
  openIncidents: number;
  overdueActions: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRisks: 0,
    criticalRisks: 0,
    compliancePercentage: 0,
    openIncidents: 0,
    overdueActions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch dashboard statistics
    const fetchStats = async () => {
      try {
        const tenantId = localStorage.getItem('tenantId');
        const token = localStorage.getItem('authToken');

        if (!tenantId || !token) return;

        // Simulated API calls - will integrate with actual endpoints
        setStats({
          totalRisks: 47,
          criticalRisks: 3,
          compliancePercentage: 79,
          openIncidents: 5,
          overdueActions: 2,
        });
      } catch (error) {
        console.error('Failed to fetch statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-600">Loading dashboard...</p>
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
            {stats.totalRisks}
          </div>
          <div className="text-red-600 text-xs mt-2">
            {stats.criticalRisks} Critical
          </div>
        </div>

        {/* Compliance Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-600 text-sm font-medium">Compliance</div>
          <div className="text-4xl font-bold text-gray-900 mt-2">
            {stats.compliancePercentage}%
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
            <div
              className="bg-green-600 h-2 rounded-full"
              style={{ width: `${stats.compliancePercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Open Incidents */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-600 text-sm font-medium">Open Incidents</div>
          <div className="text-4xl font-bold text-gray-900 mt-2">
            {stats.openIncidents}
          </div>
          <div className="text-yellow-600 text-xs mt-2">Active</div>
        </div>

        {/* Overdue Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="text-gray-600 text-sm font-medium">Overdue Actions</div>
          <div className="text-4xl font-bold text-gray-900 mt-2">
            {stats.overdueActions}
          </div>
          <div className="text-red-600 text-xs mt-2">Require attention</div>
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
            {[
              { id: 1, title: 'Unauthorized Access Attempt', severity: 'high' },
              { id: 2, title: 'Suspicious Login Activity', severity: 'medium' },
              { id: 3, title: 'Data Export Detected', severity: 'high' },
            ].map((incident) => (
              <div
                key={incident.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {incident.title}
                  </p>
                  <p className="text-xs text-gray-600">2 hours ago</p>
                </div>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded ${
                    incident.severity === 'high'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {incident.severity.toUpperCase()}
                </span>
              </div>
            ))}
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
