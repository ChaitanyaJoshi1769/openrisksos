'use client';

import { useState } from 'react';

interface Framework {
  id: string;
  name: string;
  type: string;
  totalControls: number;
  compliantControls: number;
  compliancePercentage: number;
}

export default function CompliancePage() {
  const [frameworks] = useState<Framework[]>([
    {
      id: 'iso27001',
      name: 'ISO 27001',
      type: 'Information Security Management',
      totalControls: 114,
      compliantControls: 95,
      compliancePercentage: 83,
    },
    {
      id: 'gdpr',
      name: 'GDPR',
      type: 'Data Protection Regulation',
      totalControls: 42,
      compliantControls: 39,
      compliancePercentage: 93,
    },
    {
      id: 'hipaa',
      name: 'HIPAA',
      type: 'Healthcare Privacy',
      totalControls: 87,
      compliantControls: 68,
      compliancePercentage: 78,
    },
    {
      id: 'pci-dss',
      name: 'PCI-DSS',
      type: 'Payment Card Security',
      totalControls: 101,
      compliantControls: 78,
      compliancePercentage: 77,
    },
  ]);

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
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 mb-2">Combined Compliance Score</p>
            <p className="text-5xl font-bold text-green-600">84%</p>
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
                strokeDasharray={`${84 * 5.655}px`}
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
                84%
              </text>
            </svg>
          </div>
        </div>
      </div>

      {/* Frameworks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {frameworks.map((framework) => (
          <div key={framework.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{framework.name}</h3>
                <p className="text-sm text-gray-600">{framework.type}</p>
              </div>
              <div
                className={`text-2xl font-bold ${getComplianceLabelColor(
                  framework.compliancePercentage
                )}`}
              >
                {framework.compliancePercentage}%
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full transition-all ${getComplianceColor(
                    framework.compliancePercentage
                  )}`}
                  style={{ width: `${framework.compliancePercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Controls Info */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Compliant Controls</p>
                <p className="text-lg font-bold text-green-600">
                  {framework.compliantControls}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Total Controls</p>
                <p className="text-lg font-bold text-gray-900">
                  {framework.totalControls}
                </p>
              </div>
            </div>

            {/* Action Button */}
            <button className="w-full px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition text-sm font-medium">
              View Details
            </button>
          </div>
        ))}
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
