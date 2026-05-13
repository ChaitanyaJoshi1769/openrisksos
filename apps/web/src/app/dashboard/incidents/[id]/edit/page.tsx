'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useIncidentDetail, useUpdateIncident } from '@/hooks';
import { CardSkeleton } from '@/components';

export default function IncidentEditPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { incident, loading, error } = useIncidentDetail(params.id);
  const { updateIncidentAsync, isPending, error: updateError } = useUpdateIncident(params.id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    status: 'investigating',
    assignedTo: '',
    affectedRecords: 0,
    systemsImpacted: '',
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (incident) {
      setFormData({
        title: incident.title || '',
        description: incident.description || '',
        type: incident.type || '',
        status: incident.status || 'investigating',
        assignedTo: incident.assignedTo || '',
        affectedRecords: incident.affectedRecords || 0,
        systemsImpacted: Array.isArray(incident.systemsImpacted)
          ? incident.systemsImpacted.join(', ')
          : typeof incident.systemsImpacted === 'string'
          ? incident.systemsImpacted
          : '',
      });
    }
  }, [incident]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'affectedRecords' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateIncidentAsync({
        title: formData.title,
        description: formData.description,
        type: formData.type,
        status: formData.status,
        assignedTo: formData.assignedTo,
        affectedRecords: formData.affectedRecords,
        systemsImpacted: formData.systemsImpacted
          .split(',')
          .map(s => s.trim())
          .filter(s => s),
      });

      router.push(`/dashboard/incidents/${params.id}`);
    } catch (err) {
      console.error('Failed to update incident:', err);
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
          <h1 className="text-3xl font-bold text-gray-900">Edit Incident</h1>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800 font-medium">Error loading incident</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <button
            onClick={() => router.push('/dashboard/incidents')}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Go Back to Incidents
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

  if (!incident) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Incident Not Found</h1>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 font-medium">The incident you're looking for doesn't exist</p>
          <button
            onClick={() => router.push('/dashboard/incidents')}
            className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
          >
            Go Back to Incidents
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
          <h1 className="text-3xl font-bold text-gray-900">Edit Incident</h1>
          <p className="text-gray-600 mt-1">Incident ID: {incident.id}</p>
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
                  Incident Title *
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
                    Type *
                  </label>
                  <input
                    type="text"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assigned To
                  </label>
                  <input
                    type="text"
                    name="assignedTo"
                    value={formData.assignedTo}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Impact Analysis Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Impact Analysis</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Affected Records
                </label>
                <input
                  type="number"
                  name="affectedRecords"
                  value={formData.affectedRecords}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Systems Impacted (comma-separated)
                </label>
                <input
                  type="text"
                  name="systemsImpacted"
                  value={formData.systemsImpacted}
                  onChange={handleChange}
                  placeholder="e.g., Database, API Server, Cache"
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
              <option value="investigating">Investigating</option>
              <option value="containment">Containment</option>
              <option value="resolved">Resolved</option>
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
