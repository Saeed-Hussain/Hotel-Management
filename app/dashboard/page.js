// app/dashboard/page.js (Updated)

'use client'

// Removed: useState, useEffect, useRouter, Sidebar, Header
import { motion } from 'framer-motion'
import DashboardCard from '@/components/DashboardCard'
import {
  Calendar,
  DoorOpen,
  Users,
  DollarSign,
  Building2,
  CalendarCheck,
  BedDouble,
  Clock,
  TrendingUp,
  ArrowRight
} from 'lucide-react'

// --- Mock Data ---
const dashboardData = {
  totalBookings: 145,
  totalRevenue: 125500,
  occupiedRooms: 32,
  availableRooms: 18,
  totalGuests: 87,
  bookedHalls: 5,
  pendingCheckouts: 8,
  todayCheckins: 12,
  monthlyRevenue: 450000,
  yearlyRevenue: 2850000
}

const recentBookings = [
  // ... (recentBookings data)
  {
    id: 1,
    guestName: 'John Doe',
    room: 'Deluxe Suite 205',
    checkIn: 'Nov 12, 2025',
    status: 'Checked In',
    amount: 450
  },
  {
    id: 2,
    guestName: 'Jane Smith',
    room: 'Standard Room 101',
    checkIn: 'Nov 12, 2025',
    status: 'Pending',
    amount: 250
  },
  {
    id: 3,
    guestName: 'Mike Johnson',
    room: 'Executive Suite 301',
    checkIn: 'Nov 11, 2025',
    status: 'Checked In',
    amount: 650
  },
  {
    id: 4,
    guestName: 'Emily Davis',
    room: 'Family Room 402',
    checkIn: 'Nov 12, 2025',
    status: 'Confirmed',
    amount: 350
  },
  {
    id: 5,
    guestName: 'Chris Wilson',
    room: 'Standard Room 105',
    checkIn: 'Nov 10, 2025',
    status: 'Checked Out',
    amount: 200
  }
]

const todayActivities = [
  // ... (todayActivities data)
  {
    id: 1,
    type: 'checkin',
    guest: 'John Doe',
    room: 'Room 205',
    time: '2 hours ago'
  },
  {
    id: 2,
    type: 'payment',
    guest: 'Jane Smith',
    amount: '$450',
    time: '1 hour ago'
  },
  {
    id: 3,
    type: 'checkout',
    guest: 'Mike Johnson',
    room: 'Room 101',
    time: '30 min ago'
  },
  {
    id: 4,
    type: 'booking',
    guest: 'Emily Davis',
    room: 'Hall A',
    time: '15 min ago'
  }
]

// --- Helper Functions ---
const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'checked in':
      return 'bg-green-100 text-green-700 border-green-200'
    case 'pending':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200'
    case 'confirmed':
      return 'bg-blue-100 text-blue-700 border-blue-200'
    case 'checked out':
      return 'bg-gray-100 text-gray-700 border-gray-200'
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200'
  }
}

const getActivityIcon = (type) => {
  switch (type) {
    case 'checkin':
      return <CalendarCheck className="w-5 h-5 text-green-600" />
    case 'payment':
      return <DollarSign className="w-5 h-5 text-blue-600" />
    case 'checkout':
      return <Clock className="w-5 h-5 text-orange-600" />
    case 'booking':
      return <Calendar className="w-5 h-5 text-purple-600" />
    default:
      // Assuming AlertCircle is available or importing a default icon
      return <Users className="w-5 h-5 text-gray-600" /> 
  }
}

export default function DashboardPage() {
  // We can still simulate a local loading state for *data*, 
  // but the main auth/layout loading is handled by DashboardLayout.
  const loading = false // Set to false since DashboardLayout handles the initial check

  // Get user from local storage (or a context/hook if you implemented one)
  // For simplicity, we'll try to retrieve the user here for the welcome message
  let user = null;
  if (typeof window !== 'undefined') {
    const userStr = localStorage.getItem('hotel_user');
    if (userStr) {
        user = JSON.parse(userStr);
    }
  }

  return (
    <> {/* Removed the outer div, as the layout wrapper provides the structure */}
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.full_name || 'Admin'}!
            </h1>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <DashboardCard
              title="Total Bookings"
              value={dashboardData.totalBookings}
              icon={Calendar}
              trend="up"
              trendValue="+12%"
              description="vs last month"
              color="blue"
              loading={loading}
            />
            <DashboardCard
              title="Total Revenue"
              value={`$${dashboardData.totalRevenue.toLocaleString()}`}
              icon={DollarSign}
              trend="up"
              trendValue="+8.5%"
              description="vs last month"
              color="green"
              loading={loading}
            />
            <DashboardCard
              title="Occupied Rooms"
              value={`${dashboardData.occupiedRooms}/${dashboardData.occupiedRooms + dashboardData.availableRooms}`}
              icon={DoorOpen}
              description={`${Math.round((dashboardData.occupiedRooms / (dashboardData.occupiedRooms + dashboardData.availableRooms)) * 100)}% occupancy rate`}
              color="purple"
              loading={loading}
            />
            <DashboardCard
              title="Total Guests"
              value={dashboardData.totalGuests}
              icon={Users}
              trend="up"
              trendValue="+5"
              description="today"
              color="orange"
              loading={loading}
            />
          </motion.div>

          {/* Secondary Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <DashboardCard
              title="Booked Halls"
              value={dashboardData.bookedHalls}
              icon={Building2}
              description="Active hall bookings"
              color="indigo"
              loading={loading}
            />
            <DashboardCard
              title="Today's Check-ins"
              value={dashboardData.todayCheckins}
              icon={CalendarCheck}
              description="Scheduled arrivals"
              color="teal"
              loading={loading}
            />
            <DashboardCard
              title="Pending Checkouts"
              value={dashboardData.pendingCheckouts}
              icon={Clock}
              description="Due today"
              color="pink"
              loading={loading}
            />
            <DashboardCard
              title="Available Rooms"
              value={dashboardData.availableRooms}
              icon={BedDouble}
              description="Ready for booking"
              color="red"
              loading={loading}
            />
          </motion.div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Recent Bookings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="lg:col-span-2 bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Recent Bookings</h2>
                <button className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-sm transition-colors duration-200">
                  View All
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600 uppercase tracking-wider">Guest</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600 uppercase tracking-wider">Room</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600 uppercase tracking-wider">Check In</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                      <th className="text-right py-3 px-4 font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentBookings.map((booking) => (
                      <tr
                        key={booking.id}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        <td className="py-4 px-4 font-medium text-gray-900">{booking.guestName}</td>
                        <td className="py-4 px-4 text-gray-600">{booking.room}</td>
                        <td className="py-4 px-4 text-gray-600">{booking.checkIn}</td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right font-semibold text-gray-900">
                          ${booking.amount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Today's Activities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Today's Activities</h2>
              <div className="space-y-4">
                {todayActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 shadow-sm hover:shadow-md"
                  >
                    <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{activity.guest}</p>
                      <p className="text-xs text-gray-600 mt-1">
                        {activity.room || activity.amount}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg font-semibold hover:from-primary-700 hover:to-primary-800 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                View All Activities
              </button>
            </motion.div>
          </div>

          {/* Revenue Chart Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 hover:shadow-xl transition-shadow duration-300"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Revenue Overview</h2>
                <p className="text-sm text-gray-600 mt-1">Monthly revenue statistics</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-xs text-gray-500">This Month</p>
                  <p className="text-lg font-bold text-gray-900">
                    ${(dashboardData.monthlyRevenue / 1000).toFixed(0)}K
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">This Year</p>
                  <p className="text-lg font-bold text-gray-900">
                    ${(dashboardData.yearlyRevenue / 1000).toFixed(0)}K
                  </p>
                </div>
              </div>
            </div>

            <div className="h-64 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-300 shadow-inner">
              <div className="text-center">
                <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-pulse" />
                <p className="text-gray-600 font-semibold text-lg">Revenue Chart</p>
                <p className="text-sm text-gray-500 mt-2">
                  Chart visualization will be implemented here
                </p>
              </div>
            </div>
          </motion.div>
    </>
  )
}