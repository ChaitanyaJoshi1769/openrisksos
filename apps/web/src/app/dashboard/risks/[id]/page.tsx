'use client';

import Link from 'next/link';
import { useRiskDetail } from '@/hooks';
import { useRouter } from 'next/navigation';
import { CardSkeleton } from '@/components';

export default function RiskDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { risk, loading, error } = useRiskDetail(params.id);

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
          <h1 className="text-3xl font-bold text-gray-900">Risk Details</h1>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">Error loading risk</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <button
            onClick={() => router.push('/dashboard/risks')}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Go Back to Risks
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

  if (!risk) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Risk Not Found</h1>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 font-medium">The risk you're looking for doesn't exist</p>
          <button
            onClick={() => router.push('/dashboard/risks')}
            className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Go Back to Risks
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
            <h1 className="text-3xl font-bold text-gray-900">{risk.title}</h1>
            <p className="text-gray-600 mt-1">Risk ID: {risk.id}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/risks/${risk.id}/edit`} className="px-6 py-3 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition inline-block">
            Edit Risk
          </Link>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Update Status
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
                <p className="text-gray-900">{risk.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Category</label>
                  <p className="text-gray-900">{risk.category || '—'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Owner</label>
                  <p className="text-gray-900">{risk.owner}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Risk Scores */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Risk Assessment</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Probability</label>
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-800 rounded-full text-2xl font-bold">
                  {risk.probability}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Impact</label>
                <div className="flex items-center justify-center w-16 h-16 bg-purple-100 text-purple-800 rounded-full text-2xl font-bold">
                  {risk.impact}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Score</label>
                <div
                  className={`flex items-center justify-center w-16 h-16 rounded-full text-2xl font-bold ${getSeverityColor(
                    risk.inherentScore
                  )}`}
                >
                  {risk.inherentScore}
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Residual Score</label>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-green-600">{risk.residualScore}</span>
                  <span className="text-sm text-gray-600">
                    {risk.inherentScore - risk.residualScore} point reduction
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Mitigation */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Mitigation Strategy</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Mitigation Plan</label>
                <p className="text-gray-900">
                  {risk.mitigationStrategy || 'No mitigation strategy defined yet'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Owner Responsible</label>
                <p className="text-gray-900">{risk.mitigationOwner || '—'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Meta Info */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-bold text-gray-600 mb-4">Status</h3>
            <span
              className={`inline-block px-3 py-1 rounded text-sm font-bold ${
                risk.status === 'active' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}
            >
              {risk.status.charAt(0).toUpperCase() + risk.status.slice(1)}
            </span>
          </div>

          {/* Severity Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-bold text-gray-600 mb-4">Severity</h3>
            <div className="space-y-2">
              <span
                className={`inline-block px-3 py-1 rounded text-sm font-bold ${getSeverityColor(
                  risk.inherentScore
                )}`}
              >
                {getSeverityLabel(risk.inherentScore)}
              </span>
              <p className="text-xs text-gray-600">Inherent Risk</p>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-bold text-gray-600 mb-4">Timeline</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-600">Identified</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date(risk.identifiedDate || Date.now()).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Target Resolution</p>
                <p className="text-sm font-medium text-gray-900">
                  {risk.targetResolutionDate
                    ? new Date(risk.targetResolutionDate).toLocaleDateString()
                    : '—'}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-bold text-gray-600 mb-4">Actions</h3>
            <div className="space-y-2">
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-900 rounded hover:bg-gray-50 text-sm font-medium transition">
                Add Update
              </button>
              <button className="w-full px-4 py-2 border border-gray-300 text-gray-900 rounded hover:bg-gray-50 text-sm font-medium transition">
                Add Control
              </button>
              <button className="w-full px-4 py-2 border border-red-300 text-red-900 rounded hover:bg-red-50 text-sm font-medium transition">
                Delete Risk
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
