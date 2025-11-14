"use client";

import React, { useState, useEffect } from 'react';
import { ClipboardCheck, Search, X, Filter, Calendar, User, Building } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';

const HousekeepingStatus = () => {
  const [rooms, setRooms] = useState([]);
  const [halls, setHalls] = useState([]);
  const [housekeepers, setHousekeepers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'rooms', 'halls'
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedType, setSelectedType] = useState(null); // 'room' or 'hall'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch rooms with floor and room type info
      const { data: roomsData } = await supabase
        .from('rooms')
        .select(`
          *,
          floors (id, name, floor_number),
          room_types (id, title),
          assigned_user:users!rooms_assigned_to_fkey (id, full_name)
        `)
        .order('room_number', { ascending: true });

      // Fetch halls with floor and hall type info
      const { data: hallsData } = await supabase
        .from('halls')
        .select(`
          *,
          floors (id, name, floor_number),
          hall_types (id, title),
          assigned_user:users!halls_assigned_to_fkey (id, full_name)
        `)
        .order('hall_number', { ascending: true });

      // Fetch housekeepers from employees table
      const { data: housekeepersData } = await supabase
        .from('employees')
        .select('id, title, first_name, last_name, email')
        .order('first_name', { ascending: true });

      setRooms(roomsData || []);
      setHalls(hallsData || []);
      setHousekeepers(housekeepersData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to fetch housekeeping data.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, type, newStatus) => {
    try {
      const table = type === 'room' ? 'rooms' : 'halls';
      const { error } = await supabase
        .from(table)
        .update({ housekeeping_status: newStatus })
        .eq('id', id);

      if (error) throw error;

      fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status.');
    }
  };

  const handleAssign = (item, type) => {
    setSelectedItem(item);
    setSelectedType(type);
    setShowAssignModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'clean':
        return 'bg-green-100 text-green-700';
      case 'dirty':
        return 'bg-red-100 text-red-700';
      case 'cleaning':
        return 'bg-yellow-100 text-yellow-700';
      case 'inspection':
        return 'bg-blue-100 text-blue-700';
      case 'maintenance':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusBadge = (status) => {
    const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1);
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
        {formattedStatus}
      </span>
    );
  };

  // Filter combined data
  const allItems = [
    ...rooms.map(r => ({ ...r, type: 'room', number: r.room_number, typeName: r.room_types?.title })),
    ...halls.map(h => ({ ...h, type: 'hall', number: h.hall_number, typeName: h.hall_types?.title }))
  ];

  const filteredItems = allItems.filter(item => {
    const matchesSearch = item.number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.typeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.floors?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || item.housekeeping_status === statusFilter;
    const matchesType = typeFilter === 'all' || item.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Group by floor
  const itemsByFloor = filteredItems.reduce((acc, item) => {
    const floorName = item.floors?.name || 'Unassigned';
    if (!acc[floorName]) {
      acc[floorName] = [];
    }
    acc[floorName].push(item);
    return acc;
  }, {});

  // Stats
  const stats = {
    total: allItems.length,
    clean: allItems.filter(i => i.housekeeping_status === 'clean').length,
    dirty: allItems.filter(i => i.housekeeping_status === 'dirty').length,
    cleaning: allItems.filter(i => i.housekeeping_status === 'cleaning').length,
    inspection: allItems.filter(i => i.housekeeping_status === 'inspection').length,
    maintenance: allItems.filter(i => i.housekeeping_status === 'maintenance').length,
  };

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
              <h1 className="text-3xl font-bold text-gray-900">Housekeeping Status</h1>
              <p className="text-gray-500 mt-1">Manage room and hall cleaning status</p>
            </div>
            <button
              onClick={fetchData}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <ClipboardCheck size={20} />
              Refresh
            </button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="px-8 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6"
          >
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Total Items</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <div className="w-14 h-14 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Building className="text-gray-600" size={28} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Clean</p>
                  <p className="text-3xl font-bold text-green-600">{stats.clean}</p>
                </div>
                <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                  <ClipboardCheck className="text-green-600" size={28} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Dirty</p>
                  <p className="text-3xl font-bold text-red-600">{stats.dirty}</p>
                </div>
                <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
                  <X className="text-red-600" size={28} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Cleaning</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.cleaning}</p>
                </div>
                <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <ClipboardCheck className="text-yellow-600" size={28} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Inspection</p>
                  <p className="text-3xl font-bold text-blue-600">{stats.inspection}</p>
                </div>
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Search className="text-blue-600" size={28} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-1">Maintenance</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.maintenance}</p>
                </div>
                <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
                  <ClipboardCheck className="text-orange-600" size={28} />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search by number, type, floor..."
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status Filter</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="clean">Clean</option>
                  <option value="dirty">Dirty</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="inspection">Inspection</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type Filter</label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="room">Rooms Only</option>
                  <option value="hall">Halls Only</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Items by Floor */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-500 font-medium mt-3">Loading housekeeping status...</p>
            </div>
          ) : Object.keys(itemsByFloor).length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-500 font-medium">No items found</p>
            </div>
          ) : (
            Object.entries(itemsByFloor).map(([floorName, items], index) => (
              <motion.div
                key={floorName}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6"
              >
                <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                  <h2 className="text-xl font-bold text-gray-900">{floorName}</h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Type</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Number</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Assigned To</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {items.map(item => (
                        <tr key={`${item.type}-${item.id}`} className="hover:bg-blue-50 transition-all duration-200">
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                              item.type === 'room' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                            }`}>
                              {item.type === 'room' ? 'Room' : 'Hall'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm font-semibold text-gray-900">{item.number}</td>
                          <td className="px-6 py-4 text-sm text-gray-700">{item.typeName || 'N/A'}</td>
                          <td className="px-6 py-4">
                            <select
                              value={item.housekeeping_status}
                              onChange={(e) => handleStatusChange(item.id, item.type, e.target.value)}
                              className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${getStatusColor(item.housekeeping_status)}`}
                            >
                              <option value="clean">Clean</option>
                              <option value="dirty">Dirty</option>
                              <option value="cleaning">Cleaning</option>
                              <option value="inspection">Inspection</option>
                              <option value="maintenance">Maintenance</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700">
                            {item.assigned_user?.full_name || (
                              <span className="text-gray-400 italic">Not assigned</span>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleAssign(item, item.type)}
                              className="flex items-center gap-1.5 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
                            >
                              <User size={14} />
                              Assign
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Assign Modal */}
        {showAssignModal && selectedItem && (
          <AssignModal
            item={selectedItem}
            type={selectedType}
            housekeepers={housekeepers}
            onClose={() => {
              setShowAssignModal(false);
              setSelectedItem(null);
              setSelectedType(null);
            }}
            onSuccess={fetchData}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

// Assign Housekeeper Modal
const AssignModal = ({ item, type, housekeepers, onClose, onSuccess }) => {
  const [selectedHousekeeper, setSelectedHousekeeper] = useState(item.assigned_to || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const table = type === 'room' ? 'rooms' : 'halls';
      const { error } = await supabase
        .from(table)
        .update({ assigned_to: selectedHousekeeper || null })
        .eq('id', item.id);

      if (error) throw error;

      alert('Housekeeper assigned successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error assigning housekeeper:', error);
      alert('Failed to assign housekeeper.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md my-8">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">
            Assign Housekeeper
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {type === 'room' ? 'Room' : 'Hall'} Number
              </label>
              <input
                type="text"
                value={item.number}
                disabled
                className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-50 text-gray-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Current Status
              </label>
              <div className="flex items-center gap-2">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  item.housekeeping_status === 'clean' ? 'bg-green-100 text-green-700' :
                  item.housekeeping_status === 'dirty' ? 'bg-red-100 text-red-700' :
                  item.housekeeping_status === 'cleaning' ? 'bg-yellow-100 text-yellow-700' :
                  item.housekeeping_status === 'inspection' ? 'bg-blue-100 text-blue-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {item.housekeeping_status.charAt(0).toUpperCase() + item.housekeeping_status.slice(1)}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Assign to Housekeeper
              </label>
              <select
                value={selectedHousekeeper}
                onChange={(e) => setSelectedHousekeeper(e.target.value)}
                className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">-- Unassign --</option>
                {housekeepers.map(housekeeper => (
                  <option key={housekeeper.id} value={housekeeper.id}>
                    {housekeeper.title} {housekeeper.first_name} {housekeeper.last_name} ({housekeeper.email})
                  </option>
                ))}
              </select>
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
              {saving ? 'Assigning...' : 'Assign'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HousekeepingStatus;
