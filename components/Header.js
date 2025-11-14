'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Menu,
  Bell,
  Search,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Moon,
  Sun,
  Mail,
  HelpCircle
} from 'lucide-react'

export default function Header({ isOpen, setIsOpen }) {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const profileMenuRef = useRef(null)
  const notificationRef = useRef(null)

  useEffect(() => {
    // Get user from localStorage
    const userStr = localStorage.getItem('hotel_user')
    if (userStr) {
      setUser(JSON.parse(userStr))
    }
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false)
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('hotel_user')
    router.push('/login')
  }

  const notifications = [
    {
      id: 1,
      title: 'New Booking',
      message: 'Room 205 has been booked for tonight',
      time: '5 min ago',
      unread: true
    },
    {
      id: 2,
      title: 'Check-out Reminder',
      message: 'Room 101 check-out scheduled for 11:00 AM',
      time: '1 hour ago',
      unread: true
    },
    {
      id: 3,
      title: 'Payment Received',
      message: 'Payment of $450 received for booking #1234',
      time: '2 hours ago',
      unread: false
    }
  ]

  const unreadCount = notifications.filter(n => n.unread).length

  return (
    <header className="h-20 bg-white border-b border-gray-200 fixed top-0 right-0 left-0 lg:left-72 z-30 shadow-sm">
      <div className="h-full px-4 lg:px-8 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>

          {/* Search Bar */}
          <div className="hidden md:flex items-center relative">
            <Search className="absolute left-4 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookings, guests, rooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-80 pl-12 pr-4 py-2.5 bg-gray-50 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 focus:bg-white transition-all duration-200"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Mobile Search */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Search className="w-5 h-5 text-gray-700" />
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-gray-700" />
            ) : (
              <Moon className="w-5 h-5 text-gray-700" />
            )}
          </button>

          {/* Help */}
          <button className="hidden lg:flex p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <HelpCircle className="w-5 h-5 text-gray-700" />
          </button>

          {/* Notifications */}
          <div className="relative" ref={notificationRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-slideDown">
                <div className="p-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
                  <h3 className="font-semibold text-lg">Notifications</h3>
                  <p className="text-xs text-primary-100">{unreadCount} unread messages</p>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${
                        notification.unread ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          notification.unread ? 'bg-primary-500' : 'bg-gray-300'
                        }`} />
                        <div className="flex-1">
                          <h4 className="font-semibold text-sm text-gray-900">
                            {notification.title}
                          </h4>
                          <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 bg-gray-50 text-center">
                  <button className="text-sm font-semibold text-primary-600 hover:text-primary-700">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="hidden lg:block h-8 w-px bg-gray-300" />

          {/* Profile Menu */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white font-semibold shadow-md">
                {user?.full_name?.charAt(0) || 'U'}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.full_name || 'User'}
                </p>
                <p className="text-xs text-blue-500 capitalize">{user?.role || 'Admin'}</p>
              </div>
              <ChevronDown className={`hidden lg:block w-4 h-4 text-gray-500 transition-transform ${
                showProfileMenu ? 'rotate-180' : ''
              }`} />
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 animate-slideDown">
                {/* User Info */}
                <div className="p-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-primary-600 font-bold text-lg shadow-md">
                      {user?.full_name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold">{user?.full_name || 'User'}</p>
                      <p className="text-xs text-primary-100">{user?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left">
                    <User className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">My Profile</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left">
                    <Mail className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Messages</span>
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left">
                    <Settings className="w-5 h-5 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Settings</span>
                  </button>
                  
                  <div className="border-t border-gray-200 my-2"></div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left text-red-600"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </header>
  )
}