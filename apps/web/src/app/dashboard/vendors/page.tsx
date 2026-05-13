'use client';

import Link from 'next/link';
import { useVendors } from '@/hooks';

export default function VendorsPage() {
  const { data: vendors, loading, error } = useVendors();

  const breaches = vendors.flatMap((v: any) => v.breaches || []);

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">Error loading vendors</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

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
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-4">
                <div className="animate-pulse bg-gray-200 h-4 w-1/2 rounded"></div>
                <div className="animate-pulse bg-gray-200 h-8 w-1/3 rounded mt-2"></div>
              </div>
            ))
          : [
              { label: 'Total Vendors', value: vendors.length, color: 'text-blue-600' },
              { label: 'Critical Risk', value: vendors.filter((v: any) => v.classification === 'critical').length, color: 'text-red-600' },
              { label: 'Under Review', value: vendors.filter((v: any) => v.status === 'under_review').length, color: 'text-yellow-600' },
              { label: 'Recent Breaches', value: breaches.length, color: 'text-red-600' },
            ].map((stat, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-4">
                <p className="text-gray-600 text-sm">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color} mt-2`}>{stat.value}</p>
              </div>
            ))}
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
            {loading ? (
              <>
                {Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="animate-pulse bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
                      <div className="animate-pulse bg-gray-200 h-3 w-1/2 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="animate-pulse bg-gray-200 h-6 w-20 rounded"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="animate-pulse bg-gray-200 h-6 w-20 rounded"></div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="animate-pulse bg-gray-200 h-6 w-12 rounded mx-auto"></div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="animate-pulse bg-gray-200 h-4 w-1/2 rounded mb-2"></div>
                      <div className="animate-pulse bg-gray-200 h-3 w-1/3 rounded"></div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="animate-pulse bg-gray-200 h-4 w-12 rounded mx-auto"></div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="animate-pulse bg-gray-200 h-4 w-12 rounded mx-auto"></div>
                    </td>
                  </tr>
                ))}
              </>
            ) : vendors.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-600">
                  No vendors found
                </td>
              </tr>
            ) : (
              vendors.map((vendor: any) => (
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
                    <Link href={`/dashboard/vendors/${vendor.id}`} className="text-blue-600 hover:text-blue-900 text-sm font-medium">
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Vendor Breaches */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Breaches</h2>
        <div className="space-y-3">
          {loading ? (
            <>
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded border border-gray-200">
                  <div className="flex-1">
                    <div className="animate-pulse bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
                    <div className="animate-pulse bg-gray-200 h-3 w-1/2 rounded"></div>
                  </div>
                  <div className="animate-pulse bg-gray-200 h-6 w-20 rounded ml-4"></div>
                </div>
              ))}
            </>
          ) : breaches.length === 0 ? (
            <p className="text-gray-600 text-center py-4">No breaches reported</p>
          ) : (
            breaches.map((breach: any) => (
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
            ))
          )}
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
