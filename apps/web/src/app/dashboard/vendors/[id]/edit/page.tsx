'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useVendorDetail, useUpdateVendor } from '@/hooks';
import { CardSkeleton } from '@/components';

export default function VendorEditPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { vendor, loading, error } = useVendorDetail(params.id);
  const { updateVendorAsync, isPending, error: updateError } = useUpdateVendor(params.id);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industry: '',
    location: '',
    classification: 'medium',
    status: 'active',
    contactEmail: '',
    contactPhone: '',
    contactName: '',
    assessmentType: '',
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (vendor) {
      setFormData({
        name: vendor.name || '',
        description: vendor.description || '',
        industry: vendor.industry || '',
        location: vendor.location || '',
        classification: vendor.classification || 'medium',
        status: vendor.status || 'active',
        contactEmail: vendor.contactEmail || '',
        contactPhone: vendor.contactPhone || '',
        contactName: vendor.contactName || '',
        assessmentType: vendor.assessmentType || '',
      });
    }
  }, [vendor]);

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
      await updateVendorAsync({
        name: formData.name,
        description: formData.description,
        industry: formData.industry,
        location: formData.location,
        classification: formData.classification,
        status: formData.status,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        contactName: formData.contactName,
        assessmentType: formData.assessmentType,
      });

      router.push(`/dashboard/vendors/${params.id}`);
    } catch (err) {
      console.error('Failed to update vendor:', err);
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
          <h1 className="text-3xl font-bold text-gray-900">Edit Vendor</h1>
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
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          ← Back
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Vendor</h1>
          <p className="text-gray-600 mt-1">Vendor ID: {vendor.id}</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Overview Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Vendor Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vendor Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Industry
                  </label>
                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Name
                </label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Assessment Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Assessment</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Assessment Type
              </label>
              <input
                type="text"
                name="assessmentType"
                value={formData.assessmentType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Classification Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Classification</h2>
            <select
              name="classification"
              value={formData.classification}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>

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
              <option value="inactive">Inactive</option>
              <option value="under_review">Under Review</option>
              <option value="suspended">Suspended</option>
              <option value="terminated">Terminated</option>
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
