'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuditDetail, useUpdateAudit } from '@/hooks';
import { CardSkeleton } from '@/components';

export default function AuditEditPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { audit, loading, error } = useAuditDetail(params.id);
  const { updateAuditAsync, isPending, error: updateError } = useUpdateAudit(params.id);

  const [formData, setFormData] = useState({
    title: '',
    scope: '',
    type: 'Internal',
    owner: '',
    status: 'scheduled',
    riskLevel: 'Medium',
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (audit) {
      setFormData({
        title: audit.title || '',
        scope: audit.scope || '',
        type: audit.type || 'Internal',
        owner: audit.owner || '',
        status: audit.status || 'scheduled',
        riskLevel: audit.riskLevel || 'Medium',
      });
    }
  }, [audit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateAuditAsync({
        title: formData.title,
        scope: formData.scope,
        type: formData.type,
        owner: formData.owner,
        status: formData.status,
        riskLevel: formData.riskLevel,
      });

      router.push(`/dashboard/audits/${params.id}`);
    } catch (err) {
      console.error('Failed to update audit:', err);
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
          <h1 className="text-3xl font-bold text-gray-900">Edit Audit</h1>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">Error loading audit</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <button
            onClick={() => router.push('/dashboard/audits')}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Go Back to Audits
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

  if (!audit) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Audit Not Found</h1>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 font-medium">The audit you're looking for doesn't exist</p>
          <button
            onClick={() => router.push('/dashboard/audits')}
            className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Go Back to Audits
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
          <h1 className="text-3xl font-bold text-gray-900">Edit Audit</h1>
          <p className="text-gray-600 mt-1">Audit ID: {audit.id}</p>
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
                  Audit Title *
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
                  Scope *
                </label>
                <textarea
                  name="scope"
                  value={formData.scope}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="Internal">Internal</option>
                    <option value="External">External</option>
                    <option value="Compliance">Compliance</option>
                    <option value="IT">IT</option>
                    <option value="Operational">Operational</option>
                    <option value="Financial">Financial</option>
                    <option value="Special">Special</option>
                  </select>
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
              <option value="planned">Planned</option>
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="draft_report">Draft Report</option>
              <option value="report_issued">Report Issued</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Risk Level Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Risk Level</h2>
            <select
              name="riskLevel"
              value={formData.riskLevel}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
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
