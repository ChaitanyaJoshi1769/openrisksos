'use client';

import { useCompliance } from '@/hooks';

export default function CompliancePage() {
  const { frameworks, overallScore, loading, error } = useCompliance();

  const calculateFrameworkCompliance = (framework: any) => {
    if (!framework.controls || framework.controls.length === 0) return 0;
    const compliant = framework.controls.filter((c: any) => c.status === 'compliant').length;
    return Math.round((compliant / framework.controls.length) * 100);
  };

  const getComplianceColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-600';
    if (percentage >= 70) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  const getComplianceLabelColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-700';
    if (percentage >= 70) return 'text-yellow-700';
    return 'text-red-700';
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">Error loading compliance data</p>
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
          <h1 className="text-3xl font-bold text-gray-900">Compliance Management</h1>
          <p className="text-gray-600 mt-1">
            Monitor compliance with regulatory frameworks
          </p>
        </div>
      </div>

      {/* Overall Compliance Status */}
      <div className="bg-white rounded-lg shadow p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-6">
          Overall Compliance Status
        </h2>
        {loading ? (
          <div className="flex items-center justify-between py-8">
            <div className="flex-1">
              <div className="animate-pulse bg-gray-200 h-4 w-1/2 rounded mb-4"></div>
              <div className="animate-pulse bg-gray-200 h-12 w-1/3 rounded mb-4"></div>
              <div className="animate-pulse bg-gray-200 h-4 w-1/3 rounded"></div>
            </div>
            <div className="w-48 h-48 animate-pulse bg-gray-200 rounded-full"></div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-2">Combined Compliance Score</p>
              <p className="text-5xl font-bold text-green-600">{overallScore}%</p>
              <p className="text-gray-600 text-sm mt-2">
                Across {frameworks.length} frameworks
              </p>
            </div>
            <div className="w-48 h-48 flex items-center justify-center relative">
              <svg className="w-full h-full" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="20"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="20"
                  strokeDasharray={`${overallScore * 5.655}px`}
                  strokeDashoffset="0"
                  strokeLinecap="round"
                  transform="rotate(-90 100 100)"
                />
                <text
                  x="100"
                  y="110"
                  fontSize="32"
                  fontWeight="bold"
                  textAnchor="middle"
                  fill="#1f2937"
                >
                  {overallScore}%
                </text>
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Frameworks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <>
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <div className="animate-pulse bg-gray-200 h-5 w-3/4 rounded mb-2"></div>
                    <div className="animate-pulse bg-gray-200 h-3 w-1/2 rounded"></div>
                  </div>
                  <div className="animate-pulse bg-gray-200 h-6 w-12 rounded ml-4"></div>
                </div>
                <div className="animate-pulse bg-gray-200 h-3 w-full rounded mb-4"></div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="animate-pulse bg-gray-200 h-3 w-1/2 rounded mb-2"></div>
                    <div className="animate-pulse bg-gray-200 h-5 w-1/3 rounded"></div>
                  </div>
                  <div>
                    <div className="animate-pulse bg-gray-200 h-3 w-1/2 rounded mb-2"></div>
                    <div className="animate-pulse bg-gray-200 h-5 w-1/3 rounded"></div>
                  </div>
                </div>
                <div className="animate-pulse bg-gray-200 h-10 w-full rounded"></div>
              </div>
            ))}
          </>
        ) : frameworks.length === 0 ? (
          <div className="col-span-2 text-center py-8 text-gray-600">
            No frameworks found
          </div>
        ) : (
          frameworks.map((framework) => {
            const compliancePercentage = calculateFrameworkCompliance(framework);
            const totalControls = framework.controls?.length || 0;
            const compliantControls = framework.controls?.filter((c: any) => c.status === 'compliant').length || 0;

            return (
              <div key={framework.id} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{framework.name}</h3>
                    <p className="text-sm text-gray-600">{framework.description || 'Compliance Framework'}</p>
                  </div>
                  <div
                    className={`text-2xl font-bold ${getComplianceLabelColor(
                      compliancePercentage
                    )}`}
                  >
                    {compliancePercentage}%
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full transition-all ${getComplianceColor(
                        compliancePercentage
                      )}`}
                      style={{ width: `${compliancePercentage}%` }}
                    ></div>
                  </div>
                </div>

                {/* Controls Info */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Compliant Controls</p>
                    <p className="text-lg font-bold text-green-600">
                      {compliantControls}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Total Controls</p>
                    <p className="text-lg font-bold text-gray-900">
                      {totalControls}
                    </p>
                  </div>
                </div>

                {/* Action Button */}
                <button className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition text-sm font-medium">
                  View Details
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Non-Compliant Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Non-Compliant Controls
        </h2>
        <div className="space-y-3">
          {[
            {
              id: 'C001',
              framework: 'ISO 27001',
              title: 'Encryption at Rest',
              status: 'In Progress',
            },
            {
              id: 'C002',
              framework: 'HIPAA',
              title: 'Access Control Audit',
              status: 'Planned',
            },
            {
              id: 'C003',
              framework: 'PCI-DSS',
              title: 'Vulnerability Scanning',
              status: 'In Progress',
            },
            {
              id: 'C004',
              framework: 'PCI-DSS',
              title: 'Penetration Testing',
              status: 'Planned',
            },
          ].map((control) => (
            <div
              key={control.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded border border-gray-200 hover:border-gray-300 transition"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-900">{control.title}</p>
                <p className="text-sm text-gray-600">{control.framework}</p>
              </div>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded text-sm font-medium">
                {control.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
