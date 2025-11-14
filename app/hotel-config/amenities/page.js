
// "use client";

// import React, { useState, useEffect } from 'react';
// import { createClient } from '@supabase/supabase-js';
// import { Plus, Edit2, Trash2, Eye, Search, X, Upload, Check } from 'lucide-react';
// import DashboardLayout from '@/components/DashboardLayout';


// // Main Amenities Page Component
// const AmenitiesManagement = () => {
//   const [amenities, setAmenities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [selectedAmenity, setSelectedAmenity] = useState(null);
//   const [entriesPerPage, setEntriesPerPage] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);

//   // Fetch amenities from Supabase
//   useEffect(() => {
//     fetchAmenities();
//   }, []);

//   const fetchAmenities = async () => {
//     try {
//       setLoading(true);
//       const { data, error } = await supabase
//         .from('amenities')
//         .select('*')
//         .order('id', { ascending: true });

//       if (error) throw error;
//       setAmenities(data || []);
//     } catch (error) {
//       console.error('Error fetching amenities:', error);
//       alert('Failed to fetch amenities. Please check your Supabase configuration.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Filter amenities based on search term
//   const filteredAmenities = amenities.filter(amenity =>
//     amenity.name?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Pagination
//   const indexOfLastEntry = currentPage * entriesPerPage;
//   const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
//   const currentEntries = filteredAmenities.slice(indexOfFirstEntry, indexOfLastEntry);
//   const totalPages = Math.ceil(filteredAmenities.length / entriesPerPage);

//   // Handle delete
//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this amenity?')) {
//       try {
//         const { error } = await supabase
//           .from('amenities')
//           .delete()
//           .eq('id', id);

//         if (error) throw error;
//         fetchAmenities();
//         alert('Amenity deleted successfully!');
//       } catch (error) {
//         console.error('Error deleting amenity:', error);
//         alert('Failed to delete amenity.');
//       }
//     }
//   };


"use client";

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Plus, Edit2, Trash2, Eye, Search, X, Upload, Check } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

// Import Supabase client from lib
import { supabase } from '@/lib/supabase';  // <-- ADDED THIS LINE

// Main Amenities Page Component
const AmenitiesManagement = () => {
  const [amenities, setAmenities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAmenity, setSelectedAmenity] = useState(null);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch amenities from Supabase
  useEffect(() => {
    fetchAmenities();
  }, []);

  const fetchAmenities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('amenities')
        .select('*')
        .order('id', { ascending: true });

      if (error) throw error;
      setAmenities(data || []);
    } catch (error) {
      console.error('Error fetching amenities:', error);
      alert('Failed to fetch amenities. Please check your Supabase configuration.');
    } finally {
      setLoading(false);
    }
  };

  // Filter amenities based on search term
  const filteredAmenities = amenities.filter(amenity =>
    amenity.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredAmenities.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredAmenities.length / entriesPerPage);

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this amenity?')) {
      try {
        const { error } = await supabase
          .from('amenities')
          .delete()
          .eq('id', id);

        if (error) throw error;
        fetchAmenities();
        alert('Amenity deleted successfully!');
      } catch (error) {
        console.error('Error deleting amenity:', error);
        alert('Failed to delete amenity.');
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
            <h1 className="text-3xl font-bold text-gray-900">Amenities List</h1>
            <span className="hover:text-teal-600 cursor-pointer">Manage Your Amenities.</span>
         
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
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
                    placeholder="Search amenities..."
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
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Active</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                      Loading amenities...
                    </td>
                  </tr>
                ) : currentEntries.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                      No amenities found
                    </td>
                  </tr>
                ) : (
                  currentEntries.map((amenity, index) => (
                    <tr key={amenity.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {indexOfFirstEntry + index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{amenity.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          amenity.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {amenity.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedAmenity(amenity);
                              setShowViewModal(true);
                            }}
                            className="flex items-center gap-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors"
                          >
                            <Eye size={14} />
                            View
                          </button>
                          <button
                            onClick={() => {
                              setSelectedAmenity(amenity);
                              setShowEditModal(true);
                            }}
                            className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors"
                          >
                            <Edit2 size={14} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(amenity.id)}
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
              Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, filteredAmenities.length)} of {filteredAmenities.length} entries
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
      {showAddModal && <AddAmenityModal onClose={() => setShowAddModal(false)} onSuccess={fetchAmenities} />}
      {showEditModal && selectedAmenity && (
        <EditAmenityModal
          amenity={selectedAmenity}
          onClose={() => {
            setShowEditModal(false);
            setSelectedAmenity(null);
          }}
          onSuccess={fetchAmenities}
        />
      )}
      {showViewModal && selectedAmenity && (
        <ViewAmenityModal
          amenity={selectedAmenity}
          onClose={() => {
            setShowViewModal(false);
            setSelectedAmenity(null);
          }}
        />
      )}
    </div>
   </DashboardLayout>
  );
};

// Add Amenity Modal Component
const AddAmenityModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true,
    image: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Convert to base64 for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please enter amenity name');
      return;
    }

    try {
      setUploading(true);
      
      const { data, error } = await supabase
        .from('amenities')
        .insert([{
          name: formData.name,
          description: formData.description,
          is_active: formData.is_active,
          image: formData.image
        }])
        .select();

      if (error) throw error;

      alert('Amenity added successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding amenity:', error);
      alert('Failed to add amenity.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-blue-500 px-6 py-4 flex items-center justify-between rounded-t-lg">
          <h2 className="text-xl font-bold text-white">Add New Amenity</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter amenity name"
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-teal-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                  <p className="text-sm text-gray-600">
                    {imageFile ? imageFile.name : 'Click to upload image'}
                  </p>
                </label>
              </div>
              {formData.image && (
                <img src={formData.image} alt="Preview" className="mt-3 w-32 h-32 object-cover rounded-lg" />
              )}
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                placeholder="Enter amenity description"
              />
            </div>

            {/* Active Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
              />
              <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                Active
              </label>
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
              disabled={uploading}
              className="px-6 py-2.5 bg-blue-500 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Saving...' : 'Save Amenity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Amenity Modal Component
const EditAmenityModal = ({ amenity, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: amenity.name || '',
    description: amenity.description || '',
    is_active: amenity.is_active ?? true,
    image: amenity.image || ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      alert('Please enter amenity name');
      return;
    }

    try {
      setUploading(true);
      
      const { data, error } = await supabase
        .from('amenities')
        .update({
          name: formData.name,
          description: formData.description,
          is_active: formData.is_active,
          image: formData.image
        })
        .eq('id', amenity.id)
        .select();

      if (error) throw error;

      alert('Amenity updated successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating amenity:', error);
      alert('Failed to update amenity.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-blue-600 px-6 py-4 flex items-center justify-between rounded-t-lg">
          <h2 className="text-xl font-bold text-white">Edit Amenity</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter amenity name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload-edit"
                />
                <label htmlFor="image-upload-edit" className="cursor-pointer">
                  <Upload className="mx-auto mb-2 text-gray-400" size={32} />
                  <p className="text-sm text-gray-600">
                    {imageFile ? imageFile.name : 'Click to change image'}
                  </p>
                </label>
              </div>
              {formData.image && (
                <img src={formData.image} alt="Preview" className="mt-3 w-32 h-32 object-cover rounded-lg" />
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Enter amenity description"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_active_edit"
                checked={formData.is_active}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="is_active_edit" className="text-sm font-medium text-gray-700">
                Active
              </label>
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
              disabled={uploading}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Updating...' : 'Update Amenity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// View Amenity Modal Component
const ViewAmenityModal = ({ amenity, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="bg-gray-600 px-6 py-4 flex items-center justify-between rounded-t-lg">
          <h2 className="text-xl font-bold text-white">View Amenity</h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="space-y-5">
            {amenity.image && (
              <div className="flex justify-center">
                <img
                  src={amenity.image}
                  alt={amenity.name}
                  className="w-48 h-48 object-cover rounded-lg shadow-md"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Name</label>
              <p className="text-gray-900 text-lg">{amenity.name}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
              <p className="text-gray-900">{amenity.description || 'No description provided'}</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
              <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                amenity.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {amenity.is_active ? 'Active' : 'Inactive'}
              </span>
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

export default AmenitiesManagement;