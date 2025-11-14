"use client";

import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Edit2, Trash2, Search, X } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

const DesignationManagement = () => {
  const [designations, setDesignations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDesignation, setSelectedDesignation] = useState(null);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchDesignations();
  }, []);

  const fetchDesignations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('designations')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setDesignations(data || []);
    } catch (error) {
      console.error('Error fetching designations:', error);
      alert('Failed to fetch designations.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this designation? This will affect employees assigned to this designation.')) {
      try {
        const { error } = await supabase
          .from('designations')
          .delete()
          .eq('id', id);

        if (error) throw error;

        fetchDesignations();
        alert('Designation deleted successfully!');
      } catch (error) {
        console.error('Error deleting designation:', error);
        alert('Failed to delete designation.');
      }
    }
  };

  // Filter designations
  const filteredDesignations = designations.filter(desig =>
    desig.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredDesignations.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredDesignations.length / entriesPerPage);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-b border-gray-200 px-8 py-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Designation Management</h1>
              <p className="text-gray-500 mt-1">Manage employee designations</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Plus size={20} />
              Add Designation
            </button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200"
          >
            {/* Controls */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700 font-medium">Show</span>
                  <select
                    value={entriesPerPage}
                    onChange={(e) => {
                      setEntriesPerPage(Number(e.target.value));
                      setCurrentPage(1);
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                  </select>
                  <span className="text-sm text-gray-700 font-medium">entries</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-700 font-medium">Search:</span>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                      placeholder="Search designations..."
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
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">#</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Designation Name</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan="3" className="px-6 py-16 text-center">
                        <div className="flex flex-col items-center justify-center gap-3">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                          <p className="text-gray-500 font-medium">Loading designations...</p>
                        </div>
                      </td>
                    </tr>
                  ) : currentEntries.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-6 py-12 text-center">
                        <p className="text-gray-500 font-medium">No designations found</p>
                      </td>
                    </tr>
                  ) : (
                    currentEntries.map((designation, index) => (
                      <tr key={designation.id} className="hover:bg-blue-50 transition-all duration-200">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {indexOfFirstEntry + index + 1}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {designation.name}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => {
                                setSelectedDesignation(designation);
                                setShowEditModal(true);
                              }}
                              className="flex items-center gap-1.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                            >
                              <Edit2 size={14} />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(designation.id)}
                              className="flex items-center gap-1.5 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
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
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="text-sm text-gray-700 font-medium">
                Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, filteredDesignations.length)} of {filteredDesignations.length} entries
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 border rounded-lg text-sm font-semibold transition-all ${
                      currentPage === i + 1
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white border-blue-600 shadow-md'
                        : 'border-gray-300 text-gray-700 hover:bg-white hover:border-blue-500'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Modals */}
        {showAddModal && (
          <AddDesignationModal
            onClose={() => setShowAddModal(false)}
            onSuccess={fetchDesignations}
          />
        )}
        {showEditModal && selectedDesignation && (
          <EditDesignationModal
            designation={selectedDesignation}
            onClose={() => {
              setShowEditModal(false);
              setSelectedDesignation(null);
            }}
            onSuccess={fetchDesignations}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

// Add Designation Modal
const AddDesignationModal = ({ onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Please enter designation name');
      return;
    }

    try {
      setSaving(true);

      const { error } = await supabase
        .from('designations')
        .insert([{ name: name.trim() }]);

      if (error) throw error;

      alert('Designation added successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding designation:', error);
      alert('Failed to add designation: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-8">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Add New Designation</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Designation Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="e.g., Manager, Receptionist, Accountant"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-100 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Add Designation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Designation Modal
const EditDesignationModal = ({ designation, onClose, onSuccess }) => {
  const [name, setName] = useState(designation.name || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('Please enter designation name');
      return;
    }

    try {
      setSaving(true);

      const { error } = await supabase
        .from('designations')
        .update({ name: name.trim() })
        .eq('id', designation.id);

      if (error) throw error;

      alert('Designation updated successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating designation:', error);
      alert('Failed to update designation: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-8">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Edit Designation</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Designation Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="e.g., Manager, Receptionist, Accountant"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-100 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Updating...' : 'Update Designation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DesignationManagement;
