'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateRisk } from '@/hooks';

export default function NewRiskPage() {
  const router = useRouter();
  const { createRiskAsync, isPending, error: createError } = useCreateRisk();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    owner: '',
    probability: 5,
    impact: 5,
    mitigationStrategy: '',
    mitigationOwner: '',
    targetResolutionDate: '',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'probability' || name === 'impact' ? parseInt(value) : value,
    }));
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSubmitError(null);

    try {
      const newRisk = await createRiskAsync({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        owner: formData.owner,
        probability: formData.probability,
        impact: formData.impact,
        mitigationStrategy: formData.mitigationStrategy,
        mitigationOwner: formData.mitigationOwner,
        targetResolutionDate: formData.targetResolutionDate,
      });

      router.push(`/dashboard/risks/${(newRisk as any).id}`);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create risk';
      setSubmitError(errorMsg);
      setIsSaving(false);
    }
  };

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
          <h1 className="text-3xl font-bold text-gray-900">Create New Risk</h1>
          <p className="text-gray-600 mt-1">Add a new risk to your organization</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Risk Overview</h2>
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
                  placeholder="e.g., Data Breach Risk"
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
                  placeholder="Describe the risk in detail..."
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
                    placeholder="e.g., Cybersecurity"
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
                    placeholder="e.g., John Smith"
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
                  placeholder="Describe the mitigation strategy..."
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
                  placeholder="e.g., Jane Doe"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
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
              {isSaving || isPending ? 'Creating...' : 'Create Risk'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/dashboard/risks')}
              className="w-full px-4 py-2 border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
          </div>

          {(submitError || createError) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm font-medium">Error creating risk</p>
              <p className="text-red-600 text-xs mt-1">{submitError || createError}</p>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
