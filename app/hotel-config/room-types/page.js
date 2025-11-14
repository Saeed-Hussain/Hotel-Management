"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Edit2, Trash2, Eye, Search, X, Upload } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

// Main Room Types Page Component
const RoomTypesManagement = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState(null);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch room types and amenities from Supabase
  useEffect(() => {
    fetchRoomTypes();
    fetchAmenities();
  }, []);

  const fetchRoomTypes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('room_types')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      setRoomTypes(data || []);
    } catch (error) {
      console.error('Error fetching room types:', error);
      alert('Failed to fetch room types. Please check your Supabase configuration.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAmenities = async () => {
    try {
      const { data, error } = await supabase
        .from('amenities')
        .select('id, name')
        .eq('is_active', true)
        .order('name', { ascending: true });

      if (error) throw error;
      setAmenities(data || []);
    } catch (error) {
      console.error('Error fetching amenities:', error);
    }
  };

  // Filter room types based on search term
  const filteredRoomTypes = roomTypes.filter(roomType =>
    roomType.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    roomType.short_code?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredRoomTypes.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredRoomTypes.length / entriesPerPage);

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this room type?')) {
      try {
        const { error } = await supabase
          .from('room_types')
          .delete()
          .eq('id', id);

        if (error) throw error;
        fetchRoomTypes();
        alert('Room type deleted successfully!');
      } catch (error) {
        console.error('Error deleting room type:', error);
        alert('Failed to delete room type.');
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              </div>
              <h1 className="text-3xl font-bold text-gray-900">Room Types List</h1>
              <span className="hover:text-teal-600 cursor-pointer">Manage Your Room Types.</span>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              <Plus size={20} />
              Add
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="px-8 py-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            {/* Controls */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">Show</span>
                  <select
                    value={entriesPerPage}
                    onChange={(e) => {
                      setEntriesPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <span className="text-sm text-gray-700">entries</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700">Search:</span>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-64"
                      placeholder="Search room types..."
                    />
                    {searchTerm && (
                      <X
                        size={16}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600"
                        onClick={() => setSearchTerm('')}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Short Code</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Base Price</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                        Loading room types...
                      </td>
                    </tr>
                  ) : currentEntries.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                        No room types found
                      </td>
                    </tr>
                  ) : (
                    currentEntries.map((roomType, index) => (
                      <tr key={roomType.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {indexOfFirstEntry + index + 1}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{roomType.title}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">{roomType.short_code}</td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          ${roomType.base_price ? roomType.base_price.toFixed(2) : '0.00'}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedRoomType(roomType);
                                setShowViewModal(true);
                              }}
                              className="flex items-center gap-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors"
                            >
                              <Eye size={14} />
                              View
                            </button>
                            <button
                              onClick={() => {
                                setSelectedRoomType(roomType);
                                setShowEditModal(true);
                              }}
                              className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors"
                            >
                              <Edit2 size={14} />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(roomType.id)}
                              className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, filteredRoomTypes.length)} of {filteredRoomTypes.length} entries
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 border rounded text-sm font-medium transition-colors ${
                      currentPage === i + 1
                        ? 'bg-blue-500 text-white border-teal-600'
                        : 'border-blue-500 text-blue-500 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {showAddModal && (
          <AddRoomTypeModal
            onClose={() => setShowAddModal(false)}
            onSuccess={(newRoomType) => {
              setSelectedRoomType(newRoomType);
              setShowImageModal(true);
              fetchRoomTypes();
            }}
            amenities={amenities}
          />
        )}
        {showEditModal && selectedRoomType && (
          <EditRoomTypeModal
            roomType={selectedRoomType}
            onClose={() => {
              setShowEditModal(false);
              setSelectedRoomType(null);
            }}
            onSuccess={fetchRoomTypes}
            amenities={amenities}
          />
        )}
        {showViewModal && selectedRoomType && (
          <ViewRoomTypeModal
            roomType={selectedRoomType}
            onClose={() => {
              setShowViewModal(false);
              setSelectedRoomType(null);
            }}
            amenities={amenities}
          />
        )}
        {showImageModal && selectedRoomType && (
          <ImageUploadModal
            roomType={selectedRoomType}
            onClose={() => {
              setShowImageModal(false);
              setSelectedRoomType(null);
              setShowAddModal(false);
            }}
            onSuccess={fetchRoomTypes}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

// Add Room Type Modal Component
const AddRoomTypeModal = ({ onClose, onSuccess, amenities }) => {
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    short_code: '',
    description: '',
    base_occupancy: '',
    higher_occupancy: '',
    extra_bed: false,
    kids_occupancy: '',
    amenities: [],
    base_price: '',
    additional_person_price: '',
    extra_bed_price: ''
  });
  const [saving, setSaving] = useState(false);

  const handleTitleChange = (title) => {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setFormData(prev => ({ ...prev, title, slug }));
  };

  const handleAmenityToggle = (amenityId) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('Please enter room type title');
      return;
    }

    try {
      setSaving(true);

      const { data, error } = await supabase
        .from('room_types')
        .insert([{
          title: formData.title,
          slug: formData.slug,
          short_code: formData.short_code,
          description: formData.description,
          base_occupancy: parseInt(formData.base_occupancy) || null,
          higher_occupancy: parseInt(formData.higher_occupancy) || null,
          extra_bed: formData.extra_bed,
          kids_occupancy: parseInt(formData.kids_occupancy) || null,
          amenities: formData.amenities,
          base_price: parseFloat(formData.base_price) || null,
          additional_person_price: parseFloat(formData.additional_person_price) || null,
          extra_bed_price: parseFloat(formData.extra_bed_price) || null,
          image: null
        }])
        .select();

      if (error) throw error;

      alert('Room type added successfully! Now upload an image.');
      onSuccess(data[0]);
    } catch (error) {
      console.error('Error adding room type:', error);
      alert('Failed to add room type: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-8 max-h-[calc(100vh-4rem)]">
        <div className="bg-blue-500 px-6 py-4 flex items-center justify-between rounded-t-lg sticky top-0">
          <h2 className="text-xl font-bold text-white">Add New Room Type</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(100vh-12rem)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Title Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter room type title"
                required
              />
            </div>

            {/* Slug Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Slug
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="auto-generated-slug"
              />
            </div>

            {/* Short Code Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Short Code
              </label>
              <input
                type="text"
                value={formData.short_code}
                onChange={(e) => setFormData(prev => ({ ...prev, short_code: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="e.g., DLX"
              />
            </div>

            {/* Base Occupancy Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Base Occupancy
              </label>
              <input
                type="number"
                value={formData.base_occupancy}
                onChange={(e) => setFormData(prev => ({ ...prev, base_occupancy: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="e.g., 2"
              />
            </div>

            {/* Higher Occupancy Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Higher Occupancy
              </label>
              <input
                type="number"
                value={formData.higher_occupancy}
                onChange={(e) => setFormData(prev => ({ ...prev, higher_occupancy: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="e.g., 4"
              />
            </div>

            {/* Kids Occupancy Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Kids Occupancy
              </label>
              <input
                type="number"
                value={formData.kids_occupancy}
                onChange={(e) => setFormData(prev => ({ ...prev, kids_occupancy: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="e.g., 1"
              />
            </div>

            {/* Base Price Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Base Price
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.base_price}
                onChange={(e) => setFormData(prev => ({ ...prev, base_price: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="e.g., 100.00"
              />
            </div>

            {/* Additional Person Price Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Additional Person Price
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.additional_person_price}
                onChange={(e) => setFormData(prev => ({ ...prev, additional_person_price: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="e.g., 20.00"
              />
            </div>

            {/* Extra Bed Price Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Extra Bed Price
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.extra_bed_price}
                onChange={(e) => setFormData(prev => ({ ...prev, extra_bed_price: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="e.g., 15.00"
              />
            </div>

            {/* Extra Bed Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="extra_bed"
                checked={formData.extra_bed}
                onChange={(e) => setFormData(prev => ({ ...prev, extra_bed: e.target.checked }))}
                className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
              />
              <label htmlFor="extra_bed" className="text-sm font-medium text-gray-700">
                Extra Bed Available
              </label>
            </div>
          </div>

          {/* Description Field */}
          <div className="mt-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              placeholder="Enter room type description"
            />
          </div>

          {/* Amenities Field */}
          <div className="mt-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Amenities
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-4">
              {amenities.length === 0 ? (
                <p className="text-sm text-gray-500 col-span-full text-center py-4">
                  No amenities available. Please add amenities first.
                </p>
              ) : (
                amenities.map(amenity => (
                  <label key={amenity.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity.id)}
                      onChange={() => handleAmenityToggle(amenity.id)}
                      className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                    />
                    <span className="text-sm text-gray-700">{amenity.name}</span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Room Type'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit, View, and Image Upload Modal components would be similar to hall types
// I'll create abbreviated versions for brevity

const EditRoomTypeModal = ({ roomType, onClose, onSuccess, amenities }) => {
  const [formData, setFormData] = useState({
    title: roomType.title || '',
    slug: roomType.slug || '',
    short_code: roomType.short_code || '',
    description: roomType.description || '',
    base_occupancy: roomType.base_occupancy || '',
    higher_occupancy: roomType.higher_occupancy || '',
    extra_bed: roomType.extra_bed || false,
    kids_occupancy: roomType.kids_occupancy || '',
    amenities: roomType.amenities || [],
    base_price: roomType.base_price || '',
    additional_person_price: roomType.additional_person_price || '',
    extra_bed_price: roomType.extra_bed_price || ''
  });
  const [saving, setSaving] = useState(false);

  const handleTitleChange = (title) => {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    setFormData(prev => ({ ...prev, title, slug }));
  };

  const handleAmenityToggle = (amenityId) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert('Please enter room type title');
      return;
    }

    try {
      setSaving(true);

      const { data, error } = await supabase
        .from('room_types')
        .update({
          title: formData.title,
          slug: formData.slug,
          short_code: formData.short_code,
          description: formData.description,
          base_occupancy: parseInt(formData.base_occupancy) || null,
          higher_occupancy: parseInt(formData.higher_occupancy) || null,
          extra_bed: formData.extra_bed,
          kids_occupancy: parseInt(formData.kids_occupancy) || null,
          amenities: formData.amenities,
          base_price: parseFloat(formData.base_price) || null,
          additional_person_price: parseFloat(formData.additional_person_price) || null,
          extra_bed_price: parseFloat(formData.extra_bed_price) || null
        })
        .eq('id', roomType.id)
        .select();

      if (error) throw error;

      alert('Room type updated successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating room type:', error);
      alert('Failed to update room type: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-8 max-h-[calc(100vh-4rem)]">
        <div className="bg-blue-600 px-6 py-4 flex items-center justify-between rounded-t-lg sticky top-0">
          <h2 className="text-xl font-bold text-white">Edit Room Type</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(100vh-12rem)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Slug</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Short Code</label>
              <input
                type="text"
                value={formData.short_code}
                onChange={(e) => setFormData(prev => ({ ...prev, short_code: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Base Occupancy</label>
              <input
                type="number"
                value={formData.base_occupancy}
                onChange={(e) => setFormData(prev => ({ ...prev, base_occupancy: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Higher Occupancy</label>
              <input
                type="number"
                value={formData.higher_occupancy}
                onChange={(e) => setFormData(prev => ({ ...prev, higher_occupancy: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Kids Occupancy</label>
              <input
                type="number"
                value={formData.kids_occupancy}
                onChange={(e) => setFormData(prev => ({ ...prev, kids_occupancy: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Base Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.base_price}
                onChange={(e) => setFormData(prev => ({ ...prev, base_price: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Additional Person Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.additional_person_price}
                onChange={(e) => setFormData(prev => ({ ...prev, additional_person_price: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Extra Bed Price</label>
              <input
                type="number"
                step="0.01"
                value={formData.extra_bed_price}
                onChange={(e) => setFormData(prev => ({ ...prev, extra_bed_price: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="extra_bed_edit"
                checked={formData.extra_bed}
                onChange={(e) => setFormData(prev => ({ ...prev, extra_bed: e.target.checked }))}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="extra_bed_edit" className="text-sm font-medium text-gray-700">
                Extra Bed Available
              </label>
            </div>
          </div>

          <div className="mt-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <div className="mt-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Amenities</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-4">
              {amenities.length === 0 ? (
                <p className="text-sm text-gray-500 col-span-full text-center py-4">
                  No amenities available. Please add amenities first.
                </p>
              ) : (
                amenities.map(amenity => (
                  <label key={amenity.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity.id)}
                      onChange={() => handleAmenityToggle(amenity.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{amenity.name}</span>
                  </label>
                ))
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Updating...' : 'Update Room Type'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ViewRoomTypeModal = ({ roomType, onClose, amenities }) => {
  const getAmenityNames = (amenityIds) => {
    if (!amenityIds || amenityIds.length === 0) return 'None';
    return amenityIds
      .map(id => amenities.find(a => a.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gray-600 px-6 py-4 flex items-center justify-between rounded-t-lg">
          <h2 className="text-xl font-bold text-white">View Room Type</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-5">
            {roomType.image && (
              <div className="flex justify-center">
                <img
                  src={roomType.image}
                  alt={roomType.title}
                  className="w-full h-64 object-cover rounded-lg shadow-md"
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                <p className="text-gray-900">{roomType.title}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Short Code</label>
                <p className="text-gray-900">{roomType.short_code || 'N/A'}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Base Occupancy</label>
                <p className="text-gray-900">{roomType.base_occupancy || 'N/A'}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Higher Occupancy</label>
                <p className="text-gray-900">{roomType.higher_occupancy || 'N/A'}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Kids Occupancy</label>
                <p className="text-gray-900">{roomType.kids_occupancy || 'N/A'}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Extra Bed</label>
                <p className="text-gray-900">{roomType.extra_bed ? 'Yes' : 'No'}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Base Price</label>
                <p className="text-gray-900">${roomType.base_price ? roomType.base_price.toFixed(2) : '0.00'}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Additional Person Price</label>
                <p className="text-gray-900">${roomType.additional_person_price ? roomType.additional_person_price.toFixed(2) : '0.00'}</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Extra Bed Price</label>
                <p className="text-gray-900">${roomType.extra_bed_price ? roomType.extra_bed_price.toFixed(2) : '0.00'}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
              <p className="text-gray-900">{roomType.description || 'No description provided'}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Amenities</label>
              <p className="text-gray-900">{getAmenityNames(roomType.amenities)}</p>
            </div>
          </div>

          <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ImageUploadModal = ({ roomType, onClose, onSuccess }) => {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(roomType.image || '');
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imagePreview) {
      alert('Please select an image');
      return;
    }

    try {
      setUploading(true);

      const { data, error } = await supabase
        .from('room_types')
        .update({ image: imagePreview })
        .eq('id', roomType.id)
        .select();

      if (error) throw error;

      alert('Room type image uploaded successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-xl">
        <div className="bg-blue-500 px-6 py-4 flex items-center justify-between rounded-t-lg">
          <h2 className="text-xl font-bold text-white">Upload Room Image</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Room Type: {roomType.title}
              </label>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Room Image <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-teal-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="room-image-upload"
                />
                <label htmlFor="room-image-upload" className="cursor-pointer">
                  <Upload className="mx-auto mb-2 text-gray-400" size={48} />
                  <p className="text-sm text-gray-600">
                    {imageFile ? imageFile.name : 'Click to upload room image'}
                  </p>
                </label>
              </div>
              {imagePreview && (
                <div className="mt-4 flex justify-center">
                  <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover rounded-lg shadow-md" />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Skip
            </button>
            <button
              type="submit"
              disabled={uploading || !imagePreview}
              className="px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomTypesManagement;
