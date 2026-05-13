'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRiskDetail, useUpdateRisk } from '@/hooks';
import { CardSkeleton } from '@/components';

export default function RiskEditPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { risk, loading, error } = useRiskDetail(params.id);
  const { updateRiskAsync, isPending, error: updateError } = useUpdateRisk(params.id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    owner: '',
    probability: 5,
    impact: 5,
    mitigationStrategy: '',
    mitigationOwner: '',
    status: 'active',
    targetResolutionDate: '',
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (risk) {
      setFormData({
        title: risk.title || '',
        description: risk.description || '',
        category: risk.category || '',
        owner: risk.owner || '',
        probability: risk.probability || 5,
        impact: risk.impact || 5,
        mitigationStrategy: risk.mitigationStrategy || '',
        mitigationOwner: risk.mitigationOwner || '',
        status: risk.status || 'active',
        targetResolutionDate: risk.targetResolutionDate ? new Date(risk.targetResolutionDate).toISOString().split('T')[0] : '',
      });
    }
  }, [risk]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'probability' || name === 'impact' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateRiskAsync({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        owner: formData.owner,
        probability: formData.probability,
        impact: formData.impact,
        mitigationStrategy: formData.mitigationStrategy,
        mitigationOwner: formData.mitigationOwner,
        status: formData.status,
        targetResolutionDate: formData.targetResolutionDate,
      });

      router.push(`/dashboard/risks/${params.id}`);
    } catch (err) {
      console.error('Failed to update risk:', err);
      setIsSaving(false);
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Edit Risk</h1>
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
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          ← Back
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Risk</h1>
          <p className="text-gray-600 mt-1">Risk ID: {risk.id}</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Overview</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Risk Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Owner *
                  </label>
                  <input
                    type="text"
                    name="owner"
                    value={formData.owner}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Risk Assessment Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Risk Assessment</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Probability (1-10)
                </label>
                <input
                  type="range"
                  name="probability"
                  min="1"
                  max="10"
                  value={formData.probability}
                  onChange={handleChange}
                  className="w-full"
                />
                <p className="text-sm text-gray-600 mt-1">Current: {formData.probability}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Impact (1-10)
                </label>
                <input
                  type="range"
                  name="impact"
                  min="1"
                  max="10"
                  value={formData.impact}
                  onChange={handleChange}
                  className="w-full"
                />
                <p className="text-sm text-gray-600 mt-1">Current: {formData.impact}</p>
              </div>
            </div>
          </div>

          {/* Mitigation Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Mitigation Strategy</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mitigation Plan
                </label>
                <textarea
                  name="mitigationStrategy"
                  value={formData.mitigationStrategy}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mitigation Owner
                </label>
                <input
                  type="text"
                  name="mitigationOwner"
                  value={formData.mitigationOwner}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Status Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Status</h2>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="active">Active</option>
              <option value="mitigated">Mitigated</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Target Resolution Date Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Timeline</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Resolution Date
              </label>
              <input
                type="date"
                name="targetResolutionDate"
                value={formData.targetResolutionDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-lg shadow p-6 space-y-2">
            <button
              type="submit"
              disabled={isSaving || isPending}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
            >
              {isSaving || isPending ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="w-full px-4 py-2 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
          </div>

          {updateError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm font-medium">Error saving changes</p>
              <p className="text-red-600 text-xs mt-1">{updateError}</p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
