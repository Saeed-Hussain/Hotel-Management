"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';

// Main Paid Services Component
const PaidServices = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('paid_services')
        .select(`
          *,
          room_types (title)
        `)
        .order('id', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching paid services:', error);
      alert('Failed to fetch paid services.');
    } finally {
      setLoading(false);
    }
  };

  // Filter based on search
  const filteredData = services.filter(service =>
    service.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this paid service?')) {
      try {
        const { error } = await supabase
          .from('paid_services')
          .delete()
          .eq('id', id);

        if (error) throw error;
        fetchServices();
        alert('Paid service deleted successfully!');
      } catch (error) {
        console.error('Error deleting service:', error);
        alert('Failed to delete paid service.');
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Services</h1>
              <p className="text-gray-600">Manage paid services</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Plus size={20} />
              Add
            </button>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-shadow duration-300"
        >
          {/* Controls */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Show</span>
                <select
                  value={entriesPerPage}
                  onChange={(e) => {
                    setEntriesPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
                <span className="text-sm font-medium text-gray-700">entries</span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Search:</span>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Search..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : currentEntries.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                      No paid services found
                    </td>
                  </tr>
                ) : (
                  currentEntries.map((service, index) => (
                    <tr key={service.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {indexOfFirstEntry + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {service.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          service.status
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {service.status ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedService(service);
                              setShowEditModal(true);
                            }}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 font-medium shadow-sm hover:shadow-md text-xs"
                          >
                            <Edit2 size={14} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(service.id)}
                            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 font-medium shadow-sm hover:shadow-md text-xs"
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
            <div className="text-sm text-gray-600 font-medium">
              Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, filteredData.length)} of {filteredData.length} entries
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentPage === i + 1
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md'
                      : 'border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        </motion.div>

        {/* Modals */}
        {showAddModal && (
          <AddServiceModal
            onClose={() => setShowAddModal(false)}
            onSuccess={fetchServices}
          />
        )}
        {showEditModal && selectedService && (
          <EditServiceModal
            service={selectedService}
            onClose={() => {
              setShowEditModal(false);
              setSelectedService(null);
            }}
            onSuccess={fetchServices}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

// Add Service Modal
const AddServiceModal = ({ onClose, onSuccess }) => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [availableRoomTypes, setAvailableRoomTypes] = useState([]);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);
  const [searchLeft, setSearchLeft] = useState('');
  const [searchRight, setSearchRight] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    price_type: '',
    price: '',
    status: true,
    description: '',
    short_description: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const fetchRoomTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('room_types')
        .select('*')
        .order('title', { ascending: true });

      if (error) throw error;
      setRoomTypes(data || []);
      setAvailableRoomTypes(data || []);
    } catch (error) {
      console.error('Error fetching room types:', error);
    }
  };

  const moveToSelected = (roomType) => {
    setSelectedRoomTypes([...selectedRoomTypes, roomType]);
    setAvailableRoomTypes(availableRoomTypes.filter(rt => rt.id !== roomType.id));
  };

  const moveToAvailable = (roomType) => {
    setAvailableRoomTypes([...availableRoomTypes, roomType]);
    setSelectedRoomTypes(selectedRoomTypes.filter(rt => rt.id !== roomType.id));
  };

  const moveAllToSelected = () => {
    const filtered = availableRoomTypes.filter(rt =>
      rt.title.toLowerCase().includes(searchLeft.toLowerCase())
    );
    setSelectedRoomTypes([...selectedRoomTypes, ...filtered]);
    setAvailableRoomTypes(availableRoomTypes.filter(rt => !filtered.includes(rt)));
  };

  const moveAllToAvailable = () => {
    const filtered = selectedRoomTypes.filter(rt =>
      rt.title.toLowerCase().includes(searchRight.toLowerCase())
    );
    setAvailableRoomTypes([...availableRoomTypes, ...filtered]);
    setSelectedRoomTypes(selectedRoomTypes.filter(rt => !filtered.includes(rt)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title) {
      alert('Please enter a title');
      return;
    }

    try {
      setSaving(true);

      // For now, we'll use the first selected room type ID (matching the schema)
      const { error } = await supabase
        .from('paid_services')
        .insert([{
          title: formData.title,
          room_type_id: selectedRoomTypes.length > 0 ? selectedRoomTypes[0].id : null,
          price_type: formData.price_type || null,
          price: parseFloat(formData.price) || 0,
          status: formData.status,
          description: formData.description,
          short_description: formData.short_description
        }]);

      if (error) throw error;

      alert('Paid service added successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding service:', error);
      alert('Failed to add paid service: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const filteredAvailable = availableRoomTypes.filter(rt =>
    rt.title.toLowerCase().includes(searchLeft.toLowerCase())
  );

  const filteredSelected = selectedRoomTypes.filter(rt =>
    rt.title.toLowerCase().includes(searchRight.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8 max-h-[calc(100vh-4rem)] flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">Service Form</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Title */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter service title"
                required
              />
            </div>

            {/* Room Types - Dual List Box */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Room Types</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Available Room Types */}
                <div className="border border-gray-300 rounded-xl overflow-hidden">
                  <input
                    type="text"
                    placeholder="Search.."
                    value={searchLeft}
                    onChange={(e) => setSearchLeft(e.target.value)}
                    className="w-full px-4 py-2 border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="h-64 overflow-y-auto bg-white">
                    {filteredAvailable.map(roomType => (
                      <div
                        key={roomType.id}
                        onClick={() => moveToSelected(roomType)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                      >
                        {roomType.title}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected Room Types */}
                <div className="border border-gray-300 rounded-xl overflow-hidden">
                  <input
                    type="text"
                    placeholder="Search.."
                    value={searchRight}
                    onChange={(e) => setSearchRight(e.target.value)}
                    className="w-full px-4 py-2 border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="h-64 overflow-y-auto bg-white">
                    {filteredSelected.map(roomType => (
                      <div
                        key={roomType.id}
                        onClick={() => moveToAvailable(roomType)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                      >
                        {roomType.title}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={moveAllToSelected}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Move All →
                </button>
                <button
                  type="button"
                  onClick={moveAllToAvailable}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  ← Move All
                </button>
              </div>
            </div>

            {/* Price Type and Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price Type</label>
                <select
                  value={formData.price_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, price_type: e.target.value }))}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">--Price Type--</option>
                  <option value="per_day">Per Day</option>
                  <option value="flat">Flat</option>
                  <option value="per_hour">Per Hour</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Status */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.status === true}
                    onChange={() => setFormData(prev => ({ ...prev, status: true }))}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.status === false}
                    onChange={() => setFormData(prev => ({ ...prev, status: false }))}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Inactive</span>
                </label>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Enter description"
              />
            </div>

            {/* Short Description */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Short Description</label>
              <textarea
                value={formData.short_description}
                onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                rows={3}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Enter short description"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Service Modal
const EditServiceModal = ({ service, onClose, onSuccess }) => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [availableRoomTypes, setAvailableRoomTypes] = useState([]);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);
  const [searchLeft, setSearchLeft] = useState('');
  const [searchRight, setSearchRight] = useState('');
  const [formData, setFormData] = useState({
    title: service.title || '',
    price_type: service.price_type || '',
    price: service.price || '',
    status: service.status,
    description: service.description || '',
    short_description: service.short_description || ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const fetchRoomTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('room_types')
        .select('*')
        .order('title', { ascending: true });

      if (error) throw error;

      const allRoomTypes = data || [];

      // If service has a room_type_id, add it to selected
      if (service.room_type_id) {
        const selected = allRoomTypes.filter(rt => rt.id === service.room_type_id);
        const available = allRoomTypes.filter(rt => rt.id !== service.room_type_id);
        setSelectedRoomTypes(selected);
        setAvailableRoomTypes(available);
      } else {
        setAvailableRoomTypes(allRoomTypes);
      }

      setRoomTypes(allRoomTypes);
    } catch (error) {
      console.error('Error fetching room types:', error);
    }
  };

  const moveToSelected = (roomType) => {
    setSelectedRoomTypes([...selectedRoomTypes, roomType]);
    setAvailableRoomTypes(availableRoomTypes.filter(rt => rt.id !== roomType.id));
  };

  const moveToAvailable = (roomType) => {
    setAvailableRoomTypes([...availableRoomTypes, roomType]);
    setSelectedRoomTypes(selectedRoomTypes.filter(rt => rt.id !== roomType.id));
  };

  const moveAllToSelected = () => {
    const filtered = availableRoomTypes.filter(rt =>
      rt.title.toLowerCase().includes(searchLeft.toLowerCase())
    );
    setSelectedRoomTypes([...selectedRoomTypes, ...filtered]);
    setAvailableRoomTypes(availableRoomTypes.filter(rt => !filtered.includes(rt)));
  };

  const moveAllToAvailable = () => {
    const filtered = selectedRoomTypes.filter(rt =>
      rt.title.toLowerCase().includes(searchRight.toLowerCase())
    );
    setAvailableRoomTypes([...availableRoomTypes, ...filtered]);
    setSelectedRoomTypes(selectedRoomTypes.filter(rt => !filtered.includes(rt)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title) {
      alert('Please enter a title');
      return;
    }

    try {
      setSaving(true);

      const { error } = await supabase
        .from('paid_services')
        .update({
          title: formData.title,
          room_type_id: selectedRoomTypes.length > 0 ? selectedRoomTypes[0].id : null,
          price_type: formData.price_type || null,
          price: parseFloat(formData.price) || 0,
          status: formData.status,
          description: formData.description,
          short_description: formData.short_description
        })
        .eq('id', service.id);

      if (error) throw error;

      alert('Paid service updated successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating service:', error);
      alert('Failed to update paid service: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  const filteredAvailable = availableRoomTypes.filter(rt =>
    rt.title.toLowerCase().includes(searchLeft.toLowerCase())
  );

  const filteredSelected = selectedRoomTypes.filter(rt =>
    rt.title.toLowerCase().includes(searchRight.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8 max-h-[calc(100vh-4rem)] flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">Edit Service</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Title */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter service title"
                required
              />
            </div>

            {/* Room Types - Dual List Box */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Room Types</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Available Room Types */}
                <div className="border border-gray-300 rounded-xl overflow-hidden">
                  <input
                    type="text"
                    placeholder="Search.."
                    value={searchLeft}
                    onChange={(e) => setSearchLeft(e.target.value)}
                    className="w-full px-4 py-2 border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="h-64 overflow-y-auto bg-white">
                    {filteredAvailable.map(roomType => (
                      <div
                        key={roomType.id}
                        onClick={() => moveToSelected(roomType)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                      >
                        {roomType.title}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected Room Types */}
                <div className="border border-gray-300 rounded-xl overflow-hidden">
                  <input
                    type="text"
                    placeholder="Search.."
                    value={searchRight}
                    onChange={(e) => setSearchRight(e.target.value)}
                    className="w-full px-4 py-2 border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="h-64 overflow-y-auto bg-white">
                    {filteredSelected.map(roomType => (
                      <div
                        key={roomType.id}
                        onClick={() => moveToAvailable(roomType)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors"
                      >
                        {roomType.title}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={moveAllToSelected}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Move All →
                </button>
                <button
                  type="button"
                  onClick={moveAllToAvailable}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  ← Move All
                </button>
              </div>
            </div>

            {/* Price Type and Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price Type</label>
                <select
                  value={formData.price_type}
                  onChange={(e) => setFormData(prev => ({ ...prev, price_type: e.target.value }))}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">--Price Type--</option>
                  <option value="per_day">Per Day</option>
                  <option value="flat">Flat</option>
                  <option value="per_hour">Per Hour</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Status */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.status === true}
                    onChange={() => setFormData(prev => ({ ...prev, status: true }))}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={formData.status === false}
                    onChange={() => setFormData(prev => ({ ...prev, status: false }))}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Inactive</span>
                </label>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Enter description"
              />
            </div>

            {/* Short Description */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Short Description</label>
              <textarea
                value={formData.short_description}
                onChange={(e) => setFormData(prev => ({ ...prev, short_description: e.target.value }))}
                rows={3}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                placeholder="Enter short description"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaidServices;