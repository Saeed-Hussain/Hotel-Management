"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Plus, Edit2, Trash2, Eye, Search, X, Building2, Layers, BedDouble, Home, Users } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';

// Main Rooms Management Component
const RoomsManagement = () => {
  const [rooms, setRooms] = useState([]);
  const [floors, setFloors] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showHousekeepingModal, setShowHousekeepingModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState({
    totalRooms: 0,
    totalFloors: 0,
    totalRoomTypes: 0,
    bookedRoomsToday: 0
  });

  // Fetch all data
  useEffect(() => {
    fetchRooms();
    fetchFloors();
    fetchRoomTypes();
    fetchEmployees();
    fetchStats();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('rooms')
        .select(`
          *,
          floors (name, floor_number),
          room_types (title, short_code),
          users (full_name)
        `)
        .order('id', { ascending: true });

      if (error) throw error;
      setRooms(data || []);
    } catch (error) {
      console.error('Error fetching rooms:', error);
      alert('Failed to fetch rooms.');
    } finally {
      setLoading(false);
    }
  };

  const fetchFloors = async () => {
    try {
      const { data, error } = await supabase
        .from('floors')
        .select('*')
        .eq('is_active', true)
        .order('floor_number', { ascending: true });

      if (error) throw error;
      setFloors(data || []);
    } catch (error) {
      console.error('Error fetching floors:', error);
    }
  };

  const fetchRoomTypes = async () => {
    try {
      const { data, error } = await supabase
        .from('room_types')
        .select('*')
        .order('title', { ascending: true });

      if (error) throw error;
      setRoomTypes(data || []);
    } catch (error) {
      console.error('Error fetching room types:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('id, title, first_name, last_name')
        .order('first_name', { ascending: true });

      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchStats = async () => {
    try {
      // Total Rooms
      const { count: roomsCount } = await supabase
        .from('rooms')
        .select('*', { count: 'exact', head: true });

      // Total Floors
      const { count: floorsCount } = await supabase
        .from('floors')
        .select('*', { count: 'exact', head: true });

      // Total Room Types
      const { count: roomTypesCount } = await supabase
        .from('room_types')
        .select('*', { count: 'exact', head: true });

      // Booked Rooms Today
      const today = new Date().toISOString().split('T')[0];
      const { count: bookedCount } = await supabase
        .from('booked_rooms')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'booked')
        .gte('check_in', `${today}T00:00:00`)
        .lte('check_in', `${today}T23:59:59`);

      setStats({
        totalRooms: roomsCount || 0,
        totalFloors: floorsCount || 0,
        totalRoomTypes: roomTypesCount || 0,
        bookedRoomsToday: bookedCount || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Filter rooms based on search term
  const filteredRooms = rooms.filter(room =>
    room.room_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.room_types?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    room.floors?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentEntries = filteredRooms.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredRooms.length / entriesPerPage);

  // Handle delete
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        const { error } = await supabase
          .from('rooms')
          .delete()
          .eq('id', id);

        if (error) throw error;
        fetchRooms();
        fetchStats();
        alert('Room deleted successfully!');
      } catch (error) {
        console.error('Error deleting room:', error);
        alert('Failed to delete room.');
      }
    }
  };

  const getHousekeepingStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'clean':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'dirty':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'inspected':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'out of service':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Rooms Management</h1>
              <p className="text-gray-600">Manage your hotel rooms</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Plus size={20} />
              Add Room
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <StatCard
            title="TOTAL ROOMS"
            value={stats.totalRooms}
            subtitle="Active rooms"
            icon={Building2}
            iconColor="text-white"
            iconBg="bg-blue-500"
            loading={loading}
          />
          <StatCard
            title="FLOORS"
            value={stats.totalFloors}
            subtitle="Building floors"
            icon={Layers}
            iconColor="text-white"
            iconBg="bg-orange-500"
            loading={loading}
          />
          <StatCard
            title="ROOM TYPES"
            value={stats.totalRoomTypes}
            subtitle="Available types"
            icon={BedDouble}
            iconColor="text-white"
            iconBg="bg-green-500"
            loading={loading}
          />
          <StatCard
            title="BOOKED TODAY"
            value={stats.bookedRoomsToday}
            subtitle="Today's bookings"
            icon={Home}
            iconColor="text-white"
            iconBg="bg-purple-500"
            loading={loading}
          />
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
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
                    placeholder="Search rooms..."
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
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Room Number</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Room Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Floor Number</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Housekeeping Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Assigned To</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    </td>
                  </tr>
                ) : currentEntries.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center">
                      <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">No rooms found</p>
                    </td>
                  </tr>
                ) : (
                  currentEntries.map((room, index) => (
                    <tr key={room.id} className="hover:bg-gray-50 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {indexOfFirstEntry + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {room.room_number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {room.room_types?.title || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {room.floors?.floor_number ? `${room.floors.floor_number} - ${room.floors.name}` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getHousekeepingStatusColor(room.housekeeping_status)}`}>
                          {room.housekeeping_status || 'clean'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {room.users?.full_name || 'Unassigned'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedRoom(room);
                              setShowHousekeepingModal(true);
                            }}
                            className="bg-cyan-500 hover:bg-cyan-600 text-white px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5 font-medium text-xs"
                          >
                            <Users size={14} />
                            Housekeeping
                          </button>
                          <button
                            onClick={() => {
                              setSelectedRoom(room);
                              setShowEditModal(true);
                            }}
                            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 font-medium shadow-sm hover:shadow-md text-xs"
                          >
                            <Edit2 size={14} />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(room.id)}
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
              Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, filteredRooms.length)} of {filteredRooms.length} entries
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
          <AddRoomModal
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {
              fetchRooms();
              fetchStats();
            }}
            floors={floors}
            roomTypes={roomTypes}
          />
        )}
        {showEditModal && selectedRoom && (
          <EditRoomModal
            room={selectedRoom}
            onClose={() => {
              setShowEditModal(false);
              setSelectedRoom(null);
            }}
            onSuccess={() => {
              fetchRooms();
              fetchStats();
            }}
            floors={floors}
            roomTypes={roomTypes}
          />
        )}
        {showHousekeepingModal && selectedRoom && (
          <HousekeepingModal
            room={selectedRoom}
            onClose={() => {
              setShowHousekeepingModal(false);
              setSelectedRoom(null);
            }}
            onSuccess={fetchRooms}
            employees={employees}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

// Stat Card Component
const StatCard = ({ title, value, subtitle, icon: Icon, iconColor, iconBg, loading }) => {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{title}</p>
          {loading ? (
            <div className="h-10 w-16 bg-gray-200 rounded animate-pulse"></div>
          ) : (
            <p className="text-4xl font-bold text-gray-900 mb-1">{value}</p>
          )}
          {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
        </div>
        <div className={`${iconBg} p-3 rounded-xl`}>
          <Icon size={24} className={`${iconColor}`} />
        </div>
      </div>
    </div>
  );
};

// Add Room Modal Component with "Add More" functionality
const AddRoomModal = ({ onClose, onSuccess, floors, roomTypes }) => {
  const [roomEntries, setRoomEntries] = useState([{
    floor_id: '',
    room_type_id: '',
    room_number: '',
    housekeeping_status: 'clean'
  }]);
  const [saving, setSaving] = useState(false);

  const addMoreRoom = () => {
    setRoomEntries([...roomEntries, {
      floor_id: '',
      room_type_id: '',
      room_number: '',
      housekeeping_status: 'clean'
    }]);
  };

  const removeRoom = (index) => {
    if (roomEntries.length > 1) {
      setRoomEntries(roomEntries.filter((_, i) => i !== index));
    }
  };

  const updateRoomEntry = (index, field, value) => {
    const newEntries = [...roomEntries];
    newEntries[index][field] = value;
    setRoomEntries(newEntries);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all entries
    for (let i = 0; i < roomEntries.length; i++) {
      const entry = roomEntries[i];
      if (!entry.floor_id || !entry.room_type_id || !entry.room_number.trim()) {
        alert(`Please fill in all required fields for Room ${i + 1}`);
        return;
      }
    }

    try {
      setSaving(true);

      const roomsToInsert = roomEntries.map(entry => ({
        floor_id: parseInt(entry.floor_id),
        room_type_id: parseInt(entry.room_type_id),
        room_number: entry.room_number,
        housekeeping_status: entry.housekeeping_status,
        assigned_to: null,
        is_active: true
      }));

      const { data, error } = await supabase
        .from('rooms')
        .insert(roomsToInsert)
        .select();

      if (error) throw error;

      alert(`${roomsToInsert.length} room(s) added successfully!`);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error adding rooms:', error);
      alert('Failed to add rooms: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl my-8 max-h-[calc(100vh-4rem)] flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">Add New Room(s)</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="space-y-6">
              {roomEntries.map((entry, index) => (
                <div key={index} className="border border-gray-200 rounded-xl p-5 relative">
                  {roomEntries.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRoom(index)}
                      className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                    >
                      <X size={20} />
                    </button>
                  )}

                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Room {index + 1}</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Floor Field */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Floor <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={entry.floor_id}
                        onChange={(e) => updateRoomEntry(index, 'floor_id', e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        required
                      >
                        <option value="">Select Floor</option>
                        {floors.map(floor => (
                          <option key={floor.id} value={floor.id}>
                            {floor.floor_number} - {floor.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Room Type Field */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Room Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={entry.room_type_id}
                        onChange={(e) => updateRoomEntry(index, 'room_type_id', e.target.value)}
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

                    {/* Room Number Field */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Room Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={entry.room_number}
                        onChange={(e) => updateRoomEntry(index, 'room_number', e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        placeholder="e.g., 101"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add More Button */}
            <button
              type="button"
              onClick={addMoreRoom}
              className="mt-4 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
            >
              <Plus size={18} />
              Add More
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
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
              {saving ? 'Saving...' : `Save ${roomEntries.length} Room(s)`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Edit Room Modal Component
const EditRoomModal = ({ room, onClose, onSuccess, floors, roomTypes }) => {
  const [formData, setFormData] = useState({
    floor_id: room.floor_id || '',
    room_type_id: room.room_type_id || '',
    room_number: room.room_number || ''
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.floor_id || !formData.room_type_id || !formData.room_number.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setSaving(true);

      const { data, error } = await supabase
        .from('rooms')
        .update({
          floor_id: parseInt(formData.floor_id),
          room_type_id: parseInt(formData.room_type_id),
          room_number: formData.room_number
        })
        .eq('id', room.id)
        .select();

      if (error) throw error;

      alert('Room updated successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating room:', error);
      alert('Failed to update room: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Edit Room</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            {/* Floor Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Floor <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.floor_id}
                onChange={(e) => setFormData(prev => ({ ...prev, floor_id: e.target.value }))}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              >
                <option value="">Select Floor</option>
                {floors.map(floor => (
                  <option key={floor.id} value={floor.id}>
                    {floor.floor_number} - {floor.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Room Type Field */}
            <div>
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

            {/* Room Number Field */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Room Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.room_number}
                onChange={(e) => setFormData(prev => ({ ...prev, room_number: e.target.value }))}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="e.g., 101"
                required
              />
            </div>
          </div>

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
              {saving ? 'Updating...' : 'Update Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Housekeeping Modal Component
const HousekeepingModal = ({ room, onClose, onSuccess, employees }) => {
  const [formData, setFormData] = useState({
    housekeeping_status: room.housekeeping_status || 'clean',
    assigned_to: room.assigned_to || '',
    remark: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [saving, setSaving] = useState(false);

  const housekeepingStatuses = ['clean', 'dirty', 'inspected', 'out of service'];

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const updateData = {
        housekeeping_status: formData.housekeeping_status,
        assigned_to: formData.assigned_to ? parseInt(formData.assigned_to) : null
      };

      const { data, error } = await supabase
        .from('rooms')
        .update(updateData)
        .eq('id', room.id)
        .select();

      if (error) throw error;

      alert('Housekeeping status updated successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating housekeeping status:', error);
      alert('Failed to update housekeeping status: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl my-8 max-h-[calc(100vh-4rem)] flex flex-col">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">Add Housekeeping</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="space-y-5">
              {/* Room Info */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600">Room Number</p>
                <p className="text-lg font-semibold text-gray-900">{room.room_number}</p>
              </div>

              {/* Housekeeping Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Housekeeping Status <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.housekeeping_status}
                  onChange={(e) => setFormData(prev => ({ ...prev, housekeeping_status: e.target.value }))}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  required
                >
                  <option value="">--Select Housekeeping Status--</option>
                  {housekeepingStatuses.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Remark */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Remark
                </label>
                <textarea
                  value={formData.remark}
                  onChange={(e) => setFormData(prev => ({ ...prev, remark: e.target.value }))}
                  rows={4}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Enter any remarks..."
                />
              </div>

              {/* Assigned To */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Assigned To
                </label>
                <select
                  value={formData.assigned_to}
                  onChange={(e) => setFormData(prev => ({ ...prev, assigned_to: e.target.value }))}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">--Select Employee--</option>
                  {employees.map(employee => (
                    <option key={employee.id} value={employee.id}>
                      {employee.title} {employee.first_name} {employee.last_name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold transition-colors"
              >
                Close
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

export default RoomsManagement;
