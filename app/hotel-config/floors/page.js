

"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Plus, Edit2, Trash2, Eye, X, Check, Building2 } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';

// Main Floor Management Component
export default function FloorManagement() {
  const [floors, setFloors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    floor_number: '',
    description: '',
    is_active: true
  });
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Fetch floors from Supabase
  useEffect(() => {
    fetchFloors();
  }, []);

  const fetchFloors = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('floors')
        .select('*')
        .order('floor_number', { ascending: true });

      if (error) throw error;
      setFloors(data || []);
    } catch (error) {
      showNotification('Error fetching floors: ' + error.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Add new floor
  const handleAddFloor = async () => {
    if (!formData.name || !formData.floor_number) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('floors')
        .insert([{
          name: formData.name,
          floor_number: parseInt(formData.floor_number),
          description: formData.description,
          is_active: formData.is_active
        }])
        .select();

      if (error) throw error;
      
      setFloors([...floors, ...data]);
      setShowAddModal(false);
      resetForm();
      showNotification('Floor added successfully!', 'success');
    } catch (error) {
      showNotification('Error adding floor: ' + error.message, 'error');
    }
  };

  // Update floor
  const handleUpdateFloor = async () => {
    if (!formData.name || !formData.floor_number) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('floors')
        .update({
          name: formData.name,
          floor_number: parseInt(formData.floor_number),
          description: formData.description,
          is_active: formData.is_active
        })
        .eq('id', selectedFloor.id)
        .select();

      if (error) throw error;

      setFloors(floors.map(floor => 
        floor.id === selectedFloor.id ? data[0] : floor
      ));
      setShowEditModal(false);
      resetForm();
      showNotification('Floor updated successfully!', 'success');
    } catch (error) {
      showNotification('Error updating floor: ' + error.message, 'error');
    }
  };

  // Delete floor
  const handleDeleteFloor = async (id) => {
    if (!confirm('Are you sure you want to delete this floor?')) return;
    
    try {
      const { error } = await supabase
        .from('floors')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setFloors(floors.filter(floor => floor.id !== id));
      showNotification('Floor deleted successfully!', 'success');
    } catch (error) {
      showNotification('Error deleting floor: ' + error.message, 'error');
    }
  };

  // View floor details
  const handleViewFloor = (floor) => {
    setSelectedFloor(floor);
    setShowViewModal(true);
  };

  // Edit floor
  const handleEditClick = (floor) => {
    setSelectedFloor(floor);
    setFormData({
      name: floor.name,
      floor_number: floor.floor_number.toString(),
      description: floor.description || '',
      is_active: floor.is_active
    });
    setShowEditModal(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      floor_number: '',
      description: '',
      is_active: true
    });
    setSelectedFloor(null);
  };

  // Show notification
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Filter floors based on search
  const filteredFloors = floors.filter(floor =>
    floor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    floor.floor_number.toString().includes(searchTerm)
  );

  // Pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentFloors = filteredFloors.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredFloors.length / entriesPerPage);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Notification */}
        {notification.show && (
          <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-lg ${
            notification.type === 'success' 
              ? 'bg-gradient-to-r from-green-500 to-green-600' 
              : 'bg-gradient-to-r from-red-500 to-red-600'
          } text-white font-semibold`}>
            {notification.message}
          </div>
        )}

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Floor Management</h1>
              <p className="text-gray-600">Manage your hotel floors</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Plus size={20} />
              Add Floor
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-shadow duration-300">
          {/* Filters */}
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
                    placeholder="Search floors..."
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
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Floor Number</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : currentFloors.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center">
                      <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">No floors found</p>
                    </td>
                  </tr>
                ) : (
                  currentFloors.map((floor, index) => (
                    <tr key={floor.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {indexOfFirstEntry + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {floor.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {floor.floor_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          floor.is_active 
                            ? 'bg-green-100 text-green-700 border border-green-200' 
                            : 'bg-gray-100 text-gray-700 border border-gray-200'
                        }`}>
                          {floor.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleViewFloor(floor)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 font-medium"
                          >
                            <Eye size={16} />
                            View
                          </button>
                          <button
                            onClick={() => handleEditClick(floor)}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 font-medium shadow-sm hover:shadow-md"
                          >
                            <Edit2 size={16} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteFloor(floor.id)}
                            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 font-medium shadow-sm hover:shadow-md"
                          >
                            <Trash2 size={16} />
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
              Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, filteredFloors.length)} of {filteredFloors.length} entries
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
        </div>

        {/* Add Floor Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Add New Floor</h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Floor Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="e.g., Standard Floor"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Floor Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.floor_number}
                      onChange={(e) => setFormData({ ...formData, floor_number: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="e.g., 1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows="4"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter floor description..."
                    />
                  </div>

                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                    <input
                      type="checkbox"
                      id="add-active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="add-active" className="text-sm font-semibold text-gray-700">
                      Set as Active
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      resetForm();
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddFloor}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Save Floor
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Floor Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Edit Floor</h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Floor Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="e.g., Standard Floor"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Floor Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.floor_number}
                      onChange={(e) => setFormData({ ...formData, floor_number: e.target.value })}
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="e.g., 1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows="4"
                      className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                      placeholder="Enter floor description..."
                    />
                  </div>

                  <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
                    <input
                      type="checkbox"
                      id="edit-active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="edit-active" className="text-sm font-semibold text-gray-700">
                      Set as Active
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      resetForm();
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdateFloor}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Update Floor
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Floor Modal */}
        {showViewModal && selectedFloor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
              <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Floor Details</h2>
                <button
                  onClick={() => {
                    setShowViewModal(false);
                    setSelectedFloor(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <label className="block text-sm font-semibold text-gray-500 mb-1">Floor Name</label>
                    <p className="text-lg font-semibold text-gray-900">{selectedFloor.name}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl">
                    <label className="block text-sm font-semibold text-gray-500 mb-1">Floor Number</label>
                    <p className="text-lg font-semibold text-gray-900">Floor {selectedFloor.floor_number}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl">
                    <label className="block text-sm font-semibold text-gray-500 mb-1">Description</label>
                    <p className="text-gray-900">{selectedFloor.description || 'No description provided'}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl">
                    <label className="block text-sm font-semibold text-gray-500 mb-2">Status</label>
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold ${
                      selectedFloor.is_active 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : 'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                      {selectedFloor.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setShowViewModal(false);
                      setSelectedFloor(null);
                    }}
                    className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}