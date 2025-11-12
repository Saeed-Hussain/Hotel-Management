// components/DashboardLayout.js (FIXED)

'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [activeItem, setActiveItem] = useState('dashboard') // State for active sidebar item
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Basic Client-side authentication check
    const userStr = localStorage.getItem('hotel_user')
    if (!userStr) {
      // If not authenticated, redirect to login
      router.push('/login')
      return
    }

    const parsedUser = JSON.parse(userStr)
    setUser(parsedUser)
    
    // Set active sidebar item based on current path
    const pathSegments = pathname.split('/')
    const currentItem = pathSegments.length > 1 && pathSegments[1] ? pathSegments[1] : 'dashboard'
    setActiveItem(currentItem)

    // Simulate loading completion
    setLoading(false)
  }, [router, pathname])

  // If still checking auth, show loader
  if (!user && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // If not logged in, the redirect already happened.
  if (!user) return null

  // Layout for authenticated users
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1. Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        activeItem={activeItem}
        setActiveItem={setActiveItem}
      />
      
      {/* 2. Header (Must be styled with 'fixed' inside its own component) */}
      <Header 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        user={user} 
      />
      
      {/* 3. Main Content Wrapper */}
      {/* We apply the sidebar margin (lg:pl-72) AND the header padding (pt-20) here. */}
      <div className="lg:pl-72 pt-20"> 
        
        {/* 4. Main content area (Now only needs horizontal padding) */}
        <main className="p-4 lg:p-8">
          {children} {/* This is where your DashboardPage content will be rendered */}
        </main>
      </div>
    </div>
  )
}