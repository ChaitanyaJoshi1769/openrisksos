'use client';

import { useState } from 'react';

interface Vendor {
  id: string;
  name: string;
  classification: string;
  status: string;
  riskScore: number;
  lastAssessment: string;
  assessmentType: string;
  daysUntilReview: number;
}

interface VendorBreach {
  id: string;
  vendorId: string;
  vendorName: string;
  severity: string;
  status: string;
  reportedDate: string;
  impact: string;
}

export default function VendorsPage() {
  const [vendors] = useState<Vendor[]>([
    {
      id: 'VEN001',
      name: 'CloudSecure Inc.',
      classification: 'critical',
      status: 'active',
      riskScore: 24,
      lastAssessment: '2026-04-15',
      assessmentType: 'SOC2 Report',
      daysUntilReview: 45,
    },
    {
      id: 'VEN002',
      name: 'DataVault Solutions',
      classification: 'high',
      status: 'active',
      riskScore: 35,
      lastAssessment: '2026-03-20',
      assessmentType: 'Security Questionnaire',
      daysUntilReview: 92,
    },
    {
      id: 'VEN003',
      name: 'Network Infrastructure Ltd.',
      classification: 'high',
      status: 'under_review',
      riskScore: 42,
      lastAssessment: '2026-02-01',
      assessmentType: 'Penetration Test',
      daysUntilReview: 12,
    },
    {
      id: 'VEN004',
      name: 'BackupTech Services',
      classification: 'medium',
      status: 'active',
      riskScore: 18,
      lastAssessment: '2026-05-01',
      assessmentType: 'Vulnerability Scan',
      daysUntilReview: 180,
    },
  ]);

  const [breaches] = useState<VendorBreach[]>([
    {
      id: 'BR001',
      vendorId: 'VEN002',
      vendorName: 'DataVault Solutions',
      severity: 'high',
      status: 'investigating',
      reportedDate: '2026-05-05',
      impact: '2,500 records exposed',
    },
    {
      id: 'BR002',
      vendorId: 'VEN003',
      vendorName: 'Network Infrastructure Ltd.',
      severity: 'critical',
      status: 'contained',
      reportedDate: '2026-04-28',
      impact: '15,000 records exposed',
    },
  ]);

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'under_review':
        return 'bg-blue-100 text-blue-800';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800';
      case 'terminated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskScoreColor = (score: number) => {
    if (score >= 40) return 'bg-red-100 text-red-800';
    if (score >= 30) return 'bg-orange-100 text-orange-800';
    if (score >= 20) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getBreachSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBreachStatusColor = (status: string) => {
    switch (status) {
      case 'reported':
        return 'bg-blue-100 text-blue-800';
      case 'investigating':
        return 'bg-yellow-100 text-yellow-800';
      case 'contained':
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
          <h1 className="text-3xl font-bold text-gray-900">Vendor Management</h1>
          <p className="text-gray-600 mt-1">
            Monitor third-party risk and assessments
          </p>
        </div>
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          + Add Vendor
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Total Vendors</p>
          <p className="text-2xl font-bold text-blue-600 mt-2">
            {vendors.length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Critical Risk</p>
          <p className="text-2xl font-bold text-red-600 mt-2">
            {vendors.filter((v) => v.classification === 'critical').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Under Review</p>
          <p className="text-2xl font-bold text-yellow-600 mt-2">
            {vendors.filter((v) => v.status === 'under_review').length}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-gray-600 text-sm">Recent Breaches</p>
          <p className="text-2xl font-bold text-red-600 mt-2">
            {breaches.length}
          </p>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-900">
                Vendor
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-900">
                Classification
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-900">
                Status
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-900">
                Risk Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-900">
                Last Assessment
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-900">
                Days to Review
              </th>
              <th className="px-6 py-3 text-center text-xs font-bold text-gray-900">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {vendors.map((vendor) => (
              <tr key={vendor.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{vendor.name}</p>
                  <p className="text-xs text-gray-600">{vendor.id}</p>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 rounded text-sm font-bold ${getClassificationColor(
                      vendor.classification
                    )}`}
                  >
                    {vendor.classification.charAt(0).toUpperCase() +
                      vendor.classification.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-block px-3 py-1 rounded text-sm font-bold ${getStatusColor(
                      vendor.status
                    )}`}
                  >
                    {vendor.status
                      .split('_')
                      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`inline-block px-3 py-1 rounded text-sm font-bold ${getRiskScoreColor(
                      vendor.riskScore
                    )}`}
                  >
                    {vendor.riskScore}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <div>
                    <p className="font-medium">
                      {new Date(vendor.lastAssessment).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {vendor.assessmentType}
                    </p>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className={`text-sm font-bold ${
                      vendor.daysUntilReview <= 30
                        ? 'text-red-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {vendor.daysUntilReview}
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

      {/* Vendor Breaches */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Breaches</h2>
        <div className="space-y-3">
          {breaches.map((breach) => (
            <div
              key={breach.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded border border-gray-200 hover:border-gray-300 transition"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-gray-900">{breach.vendorName}</p>
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${getBreachSeverityColor(
                      breach.severity
                    )}`}
                  >
                    {breach.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {breach.impact} • Reported {new Date(breach.reportedDate).toLocaleDateString()}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded text-sm font-medium ${getBreachStatusColor(
                  breach.status
                )}`}
              >
                {breach.status
                  .split('_')
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ')}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Vendor Risk Distribution */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Risk Distribution
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Critical
              </span>
              <div className="flex-1 h-2 bg-gray-200 rounded mx-3">
                <div
                  className="h-2 bg-red-600 rounded"
                  style={{ width: '25%' }}
                ></div>
              </div>
              <span className="text-sm font-bold text-gray-900">1</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">High</span>
              <div className="flex-1 h-2 bg-gray-200 rounded mx-3">
                <div
                  className="h-2 bg-orange-600 rounded"
                  style={{ width: '50%' }}
                ></div>
              </div>
              <span className="text-sm font-bold text-gray-900">2</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Medium</span>
              <div className="flex-1 h-2 bg-gray-200 rounded mx-3">
                <div
                  className="h-2 bg-yellow-600 rounded"
                  style={{ width: '25%' }}
                ></div>
              </div>
              <span className="text-sm font-bold text-gray-900">1</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Low</span>
              <div className="flex-1 h-2 bg-gray-200 rounded mx-3">
                <div
                  className="h-2 bg-green-600 rounded"
                  style={{ width: '0%' }}
                ></div>
              </div>
              <span className="text-sm font-bold text-gray-900">0</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Assessment Status
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">Current</span>
              <span className="text-sm font-bold text-gray-900">3 vendors</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Expiring Soon (≤30 days)
              </span>
              <span className="text-sm font-bold text-red-600">1 vendor</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-600">
                Expired
              </span>
              <span className="text-sm font-bold text-orange-600">0 vendors</span>
            </div>
            <div className="pt-3 border-t mt-3">
              <p className="text-xs text-gray-600">
                Next Assessment Due: {vendors[2].daysUntilReview} days
                ({vendors[2].name})
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
