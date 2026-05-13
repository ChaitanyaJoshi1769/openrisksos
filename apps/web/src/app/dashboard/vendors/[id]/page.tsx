'use client';

import Link from 'next/link';
import { useVendorDetail } from '@/hooks';
import { useRouter } from 'next/navigation';
import { CardSkeleton } from '@/components';

export default function VendorDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { vendor, loading, error } = useVendorDetail(params.id);

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
    if (score >= 40) return 'text-red-600';
    if (score >= 30) return 'text-orange-600';
    if (score >= 20) return 'text-yellow-600';
    return 'text-green-600';
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Vendor Details</h1>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">Error loading vendor</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <button
            onClick={() => router.push('/dashboard/vendors')}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Go Back to Vendors
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            disabled
            className="px-4 py-2 border border-gray-300 rounded-lg opacity-50 cursor-not-allowed"
          >
            ← Back
          </button>
          <div className="animate-pulse bg-gray-200 h-8 w-1/4 rounded"></div>
        </div>

        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Vendor Not Found</h1>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 font-medium">The vendor you're looking for doesn't exist</p>
          <button
            onClick={() => router.push('/dashboard/vendors')}
            className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Go Back to Vendors
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{vendor.name}</h1>
            <p className="text-gray-600 mt-1">Vendor ID: {vendor.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/vendors/${vendor.id}/edit`} className="px-6 py-3 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition inline-block">
            Edit Vendor
          </Link>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Schedule Assessment
          </button>
        </div>
      </div>

      {/* Main Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Overview</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                <p className="text-gray-900">{vendor.description || '—'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Industry</label>
                  <p className="text-gray-900">{vendor.industry || '—'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Location</label>
                  <p className="text-gray-900">{vendor.location || '—'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Risk Assessment</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Risk Score</label>
                <div
                  className={`text-4xl font-bold ${getRiskScoreColor(
                    vendor.riskScore
                  )}`}
                >
                  {vendor.riskScore}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Overall Risk</label>
                <div
                  className={`text-2xl font-bold ${getRiskScoreColor(
                    vendor.riskScore
                  )}`}
                >
                  {vendor.riskScore >= 40 ? 'Critical' : vendor.riskScore >= 30 ? 'High' : 'Medium'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Breaches</label>
                <div className="text-4xl font-bold text-red-600">
                  {vendor.breachCount || 0}
                </div>
              </div>
            </div>
          </div>

          {/* Assessment Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Assessment Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Last Assessment</label>
                <p className="text-gray-900">
                  {new Date(vendor.lastAssessment).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Assessment Type</label>
                <p className="text-gray-900">{vendor.assessmentType}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Next Assessment Due</label>
                <p className={`text-gray-900 ${vendor.daysUntilReview <= 30 ? 'text-red-600 font-bold' : ''}`}>
                  {vendor.daysUntilReview} days
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Meta Info */}
        <div className="space-y-6">
          {/* Classification Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-bold text-gray-600 mb-4">Classification</h3>
            <span
              className={`inline-block px-3 py-1 rounded text-sm font-bold ${getClassificationColor(
                vendor.classification
              )}`}
            >
              {vendor.classification.charAt(0).toUpperCase() + vendor.classification.slice(1)}
            </span>
          </div>

          {/* Status Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-bold text-gray-600 mb-4">Status</h3>
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
          </div>

          {/* Contact Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-bold text-gray-600 mb-4">Contact</h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-900">
                <strong>Email:</strong> {vendor.contactEmail || '—'}
              </p>
              <p className="text-sm text-gray-900">
                <strong>Phone:</strong> {vendor.contactPhone || '—'}
              </p>
              <p className="text-sm text-gray-900">
                <strong>Manager:</strong> {vendor.contactName || '—'}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-bold text-gray-600 mb-4">Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-900 rounded hover:bg-gray-50 text-sm font-medium transition">
                View Assessment
              </button>
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-900 rounded hover:bg-gray-50 text-sm font-medium transition">
                View Breaches
              </button>
              <button className="w-full px-4 py-2 border border-red-300 text-red-900 rounded hover:bg-red-50 text-sm font-medium transition">
                Terminate Vendor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
