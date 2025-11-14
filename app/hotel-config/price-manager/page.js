"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';

// Main Price Manager Component
const PriceManager = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchRoomTypes();
    fetchPrices();
  }, []);

  const fetchRoomTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('room_types')
        .select('id, title, base_price')
        .order('title', { ascending: true });

      if (error) throw error;
      setRoomTypes(data || []);
    } catch (error) {
      console.error('Error fetching room types:', error);
    }
  };

  const fetchPrices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('price_manager')
        .select(`
          *,
          room_types (title)
        `)
        .order('id', { ascending: true });

      if (error) throw error;
      setPrices(data || []);
    } catch (error) {
      console.error('Error fetching prices:', error);
      alert('Failed to fetch prices.');
    } finally {
      setLoading(false);
    }
  };

  // Since we're storing regular prices per room type, let's structure this differently
  // We'll display room types and their regular prices
  // Use useMemo to avoid recalculating on every render
  const displayData = React.useMemo(() => {
    return roomTypes.map(roomType => ({
      id: roomType.id,
      name: roomType.title,
      mon: roomType.base_price || 0,
      tue: roomType.base_price || 0,
      wed: roomType.base_price || 0,
      thu: roomType.base_price || 0,
      fri: roomType.base_price || 0,
      sat: roomType.base_price || 0,
      sun: roomType.base_price || 0
    }));
  }, [roomTypes]);

  // Filter based on search
  const filteredData = displayData.filter(item =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredData.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this price entry?')) {
      try {
        const { error } = await supabase
          .from('price_manager')
          .delete()
          .eq('id', id);

        if (error) throw error;
        fetchPrices();
        alert('Price entry deleted successfully!');
      } catch (error) {
        console.error('Error deleting price:', error);
        alert('Failed to delete price entry.');
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Price Manager</h1>
              <p className="text-gray-600">Manage room type prices</p>
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
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Mon</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Tue</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Wed</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Thu</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Fri</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Sat</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Sun</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="11" className="px-6 py-8 text-center text-gray-500">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : currentEntries.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="px-6 py-8 text-center text-gray-500">
                      No room types found
                    </td>
                  </tr>
                ) : (
                  currentEntries.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {indexOfFirstEntry + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600">
                        ${item.mon.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600">
                        ${item.tue.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600">
                        ${item.wed.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600">
                        ${item.thu.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600">
                        ${item.fri.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600">
                        ${item.sat.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-600">
                        ${item.sun.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              const roomType = roomTypes.find(rt => rt.id === item.id);
                              setSelectedPrice(roomType);
                              setShowEditModal(true);
                            }}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 font-medium shadow-sm hover:shadow-md text-xs"
                          >
                            <Edit2 size={14} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
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
          <AddPriceModal
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {
              fetchRoomTypes();
              fetchPrices();
            }}
            roomTypes={roomTypes}
          />
        )}
        {showEditModal && selectedPrice && (
          <EditPriceModal
            roomType={selectedPrice}
            onClose={() => {
              setShowEditModal(false);
              setSelectedPrice(null);
            }}
            onSuccess={() => {
              fetchRoomTypes();
              fetchPrices();
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

// Add Price Modal
const AddPriceModal = ({ onClose, onSuccess, roomTypes }) => {
  const [activeTab, setActiveTab] = useState('regular');
  const [formData, setFormData] = useState({
    room_type_id: '',
    regular_mon: '',
    regular_tue: '',
    regular_wed: '',
    regular_thu: '',
    regular_fri: '',
    regular_sat: '',
    regular_sun: '',
    special_title: '',
    special_date_range: '',
    special_mon: '',
    special_tue: '',
    special_wed: '',
    special_thu: '',
    special_fri: '',
    special_sat: '',
    special_sun: ''
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.room_type_id) {
      alert('Please select a room type');
      return;
    }

    try {
      setSaving(true);

      if (activeTab === 'regular') {
        // Update room type base price (we'll use Monday's price as base)
        const { error } = await supabase
          .from('room_types')
          .update({
            base_price: parseFloat(formData.regular_mon) || 0
          })
          .eq('id', parseInt(formData.room_type_id));

        if (error) throw error;
        alert('Regular price added successfully!');
      } else {
        // Add special price to price_manager table
        const { error } = await supabase
          .from('price_manager')
          .insert([{
            room_type_id: parseInt(formData.room_type_id),
            regular_price: null,
            special_price: parseFloat(formData.special_mon) || 0,
            start_date: formData.special_date_range ? formData.special_date_range.split('/')[0].trim() : null,
            end_date: formData.special_date_range ? formData.special_date_range.split('/')[1].trim() : null
          }]);

        if (error) throw error;
        alert('Special price added successfully!');
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding price:', error);
      alert('Failed to add price: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8 max-h-[calc(100vh-4rem)] flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">Price Manager Form</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6">
          {/* Room Type Selector */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Room Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.room_type_id}
              onChange={(e) => setFormData(prev => ({ ...prev, room_type_id: e.target.value }))}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              required
            >
              <option value="">Select Room Type</option>
              {roomTypes.map(roomType => (
                <option key={roomType.id} value={roomType.id}>
                  {roomType.title}
                </option>
              ))}
            </select>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex">
              <button
                type="button"
                onClick={() => setActiveTab('regular')}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === 'regular'
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Regular Price
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('special')}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === 'special'
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Special Price
              </button>
            </div>
          </div>

          {/* Regular Price Tab */}
          {activeTab === 'regular' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Mon</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.regular_mon}
                    onChange={(e) => setFormData(prev => ({ ...prev, regular_mon: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="100.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tue</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.regular_tue}
                    onChange={(e) => setFormData(prev => ({ ...prev, regular_tue: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="100.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Wed</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.regular_wed}
                    onChange={(e) => setFormData(prev => ({ ...prev, regular_wed: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="100.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Thu</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.regular_thu}
                    onChange={(e) => setFormData(prev => ({ ...prev, regular_thu: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="100.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Fri</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.regular_fri}
                    onChange={(e) => setFormData(prev => ({ ...prev, regular_fri: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="100.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Sat</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.regular_sat}
                    onChange={(e) => setFormData(prev => ({ ...prev, regular_sat: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="100.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Sun</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.regular_sun}
                    onChange={(e) => setFormData(prev => ({ ...prev, regular_sun: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="100.00"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Special Price Tab */}
          {activeTab === 'special' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.special_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, special_title: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="e.g., Christmas"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date Range</label>
                <input
                  type="text"
                  value={formData.special_date_range}
                  onChange={(e) => setFormData(prev => ({ ...prev, special_date_range: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="2018-02-28 12:00 AM / 2018-02-28 11:59 PM"
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Mon</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.special_mon}
                    onChange={(e) => setFormData(prev => ({ ...prev, special_mon: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Tue</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.special_tue}
                    onChange={(e) => setFormData(prev => ({ ...prev, special_tue: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Wed</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.special_wed}
                    onChange={(e) => setFormData(prev => ({ ...prev, special_wed: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Thu</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.special_thu}
                    onChange={(e) => setFormData(prev => ({ ...prev, special_thu: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Fri</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.special_fri}
                    onChange={(e) => setFormData(prev => ({ ...prev, special_fri: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Sat</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.special_sat}
                    onChange={(e) => setFormData(prev => ({ ...prev, special_sat: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Sun</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.special_sun}
                    onChange={(e) => setFormData(prev => ({ ...prev, special_sun: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
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

// Edit Price Modal (similar to Add)
const EditPriceModal = ({ roomType, onClose, onSuccess }) => {
  const [activeTab, setActiveTab] = useState('regular');
  const [formData, setFormData] = useState({
    regular_mon: roomType.base_price || '',
    regular_tue: roomType.base_price || '',
    regular_wed: roomType.base_price || '',
    regular_thu: roomType.base_price || '',
    regular_fri: roomType.base_price || '',
    regular_sat: roomType.base_price || '',
    regular_sun: roomType.base_price || ''
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      // Update room type base price
      const { error } = await supabase
        .from('room_types')
        .update({
          base_price: parseFloat(formData.regular_mon) || 0
        })
        .eq('id', roomType.id);

      if (error) throw error;

      alert('Price updated successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating price:', error);
      alert('Failed to update price: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-8 max-h-[calc(100vh-4rem)] flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">Edit Price - {roomType.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6">
          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex">
              <button
                type="button"
                onClick={() => setActiveTab('regular')}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === 'regular'
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Regular Price
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('special')}
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === 'special'
                    ? 'bg-teal-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Special Price
              </button>
            </div>
          </div>

          {/* Regular Price Tab */}
          {activeTab === 'regular' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div key={day}>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">{day}</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData[`regular_${day.toLowerCase()}`]}
                      onChange={(e) => setFormData(prev => ({ ...prev, [`regular_${day.toLowerCase()}`]: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-teal-500"
                      placeholder="100.00"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
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
              {saving ? 'Updating...' : 'Update Price'}
            </button>
          </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PriceManager;
