// 'use client'

// import { useState } from 'react'
// import {
//   LayoutDashboard,
//   Calendar,
//   DoorOpen,
//   Building2,
//   Users,
//   Menu as MenuIcon,
//   CalendarCheck,
//   Settings,
//   FileText,
//   TrendingUp,
//   Briefcase,
//   FileImage,
//   Receipt,
//   Archive,
//   ChevronDown,
//   ChevronRight,
//   Hotel,
//   BedDouble,
//   Warehouse,
//   DollarSign,
//   ShoppingCart,
//   Ticket,
//   Layers,
//   Sparkles,
//   ClipboardList,
//   BarChart3,
//   UserSquare2,
//   PieChart,
//   CreditCard,
//   FileBarChart,
//   UsersRound,
//   Boxes,
//   Star,
//   MapPin,
//   Globe,
//   Languages,
//   Coins,
//   MessageSquare,
//   FileText as FileTextIcon,
//   Image,
//   Mail,
//   Grid3x3,
//   ClipboardX
// } from 'lucide-react'

// export default function Sidebar({ isOpen, setIsOpen, activeItem, setActiveItem }) {
//   const [expandedMenus, setExpandedMenus] = useState({})

//   const toggleMenu = (menuId) => {
//     setExpandedMenus(prev => ({
//       ...prev,
//       [menuId]: !prev[menuId]
//     }))
//   }

//   const menuItems = [
//     {
//       id: 'dashboard',
//       label: 'Dashboard',
//       icon: LayoutDashboard,
//       path: '/dashboard'
//     },
//     {
//       id: 'bookings',
//       label: 'Bookings',
//       icon: Calendar,
//       path: '/bookings'
//     },
//     {
//       id: 'booked-rooms',
//       label: 'Booked Rooms',
//       icon: DoorOpen,
//       path: '/booked-rooms'
//     },
//     {
//       id: 'booked-halls',
//       label: 'Booked Halls',
//       icon: Building2,
//       path: '/booked-halls'
//     },
//     {
//       id: 'guests',
//       label: 'Guests',
//       icon: Users,
//       path: '/guests'
//     },
//     {
//       id: 'menu',
//       label: 'Menu',
//       icon: MenuIcon,
//       path: '/menu'
//     },
//     {
//       id: 'availability-calendar',
//       label: 'Availability Calendar',
//       icon: CalendarCheck,
//       path: '/availability-calendar'
//     },
//     {
//       id: 'hotel-config',
//       label: 'Hotel Configuration',
//       icon: Hotel,
//       isExpandable: true,
//       subItems: [
//         { id: 'room-types', label: 'Room Types', icon: BedDouble, path: '/hotel-config/room-types' },
//         { id: 'rooms', label: 'Rooms', icon: DoorOpen, path: '/hotel-config/rooms' },
//         { id: 'hall-types', label: 'Hall Types', icon: Warehouse, path: '/hotel-config/hall-types' },
//         { id: 'halls', label: 'Halls', icon: Building2, path: '/hotel-config/halls' },
//         { id: 'price-manager', label: 'Price Manager', icon: DollarSign, path: '/hotel-config/price-manager' },
//         { id: 'paid-services', label: 'Paid Services', icon: ShoppingCart, path: '/hotel-config/paid-services' },
//         { id: 'coupon-management', label: 'Coupon Management', icon: Ticket, path: '/hotel-config/coupon-management' },
//         { id: 'floors', label: 'Floors', icon: Layers, path: '/hotel-config/floors' },
//         { id: 'amenities', label: 'Amenities', icon: Sparkles, path: '/hotel-config/amenities' },
//         { id: 'housekeeping-status', label: 'Housekeeping Status', icon: ClipboardList, path: '/hotel-config/housekeeping-status' }
//       ]
//     },
//     {
//       id: 'reports',
//       label: 'Reports',
//       icon: BarChart3,
//       isExpandable: true,
//       subItems: [
//         { id: 'occupancy-report', label: 'Occupancy Report', icon: PieChart, path: '/reports/occupancy' },
//         { id: 'guest-report', label: 'Guest Report', icon: UserSquare2, path: '/reports/guest' },
//         { id: 'financial-report', label: 'Financial Report', icon: CreditCard, path: '/reports/financial' },
//         { id: 'coupon-report', label: 'Coupon Report', icon: Ticket, path: '/reports/coupon' },
//         { id: 'expense-report', label: 'Expense Report', icon: FileBarChart, path: '/reports/expense' }
//       ]
//     },
//     {
//       id: 'hr-management',
//       label: 'HR Management',
//       icon: UsersRound,
//       isExpandable: true,
//       subItems: [
//         { id: 'employees', label: 'Employees', icon: Users, path: '/hr/employees' },
//         { id: 'departments', label: 'Departments', icon: Boxes, path: '/hr/departments' },
//         { id: 'designations', label: 'Designations', icon: Star, path: '/hr/designations' }
//       ]
//     },
//     {
//       id: 'cms',
//       label: 'CMS',
//       icon: FileImage,
//       isExpandable: true,
//       subItems: [
//         { id: 'pages', label: 'Pages', icon: FileTextIcon, path: '/cms/pages' },
//         { id: 'banners', label: 'Banners', icon: Image, path: '/cms/banners' },
//         { id: 'gallery', label: 'Gallery', icon: Grid3x3, path: '/cms/gallery' },
//         { id: 'mail-templates', label: 'Mail Templates', icon: Mail, path: '/cms/mail-templates' }
//       ]
//     },
//     {
//       id: 'administrative',
//       label: 'Administrative',
//       icon: Settings,
//       isExpandable: true,
//       subItems: [
//         { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
//         { id: 'languages', label: 'Languages', icon: Languages, path: '/admin/languages' },
//         { id: 'currency', label: 'Currency', icon: Coins, path: '/admin/currency' },
//         { id: 'location', label: 'Location', icon: MapPin, path: '/admin/location' },
//         { id: 'tax-manager', label: 'Tax Manager', icon: Receipt, path: '/admin/tax-manager' },
//         { id: 'testimonials', label: 'Testimonials', icon: MessageSquare, path: '/admin/testimonials' }
//       ]
//     },
//     {
//       id: 'expenses',
//       label: 'Expenses',
//       icon: Receipt,
//       isExpandable: true,
//       subItems: [
//         { id: 'expenses-list', label: 'Expenses', icon: Receipt, path: '/expenses' },
//         { id: 'expense-categories', label: 'Expense Categories', icon: Layers, path: '/expenses/categories' }
//       ]
//     },
//     {
//       id: 'archived-bookings',
//       label: 'Archived Bookings',
//       icon: Archive,
//       path: '/archived-bookings'
//     }
//   ]

//   const handleItemClick = (item) => {
//     if (item.isExpandable) {
//       toggleMenu(item.id)
//     } else {
//       setActiveItem(item.id)
//       if (window.innerWidth < 1024) {
//         setIsOpen(false)
//       }
//     }
//   }

//   const handleSubItemClick = (parentId, subItem) => {
//     setActiveItem(subItem.id)
//     if (window.innerWidth < 1024) {
//       setIsOpen(false)
//     }
//   }

//   return (
//     <>
//       {/* Mobile Overlay */}
//       {isOpen && (
//         <div
//           className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
//           onClick={() => setIsOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`fixed top-0 left-0 z-50 h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
//           isOpen ? 'translate-x-0' : '-translate-x-full'
//         } lg:translate-x-0 w-72 overflow-hidden flex flex-col shadow-xl`}
//       >
//         {/* Logo */}
//         <div className="h-20 flex items-center justify-center border-b border-gray-200 bg-gradient-to-r from-primary-600 to-primary-700 relative overflow-hidden">
//           <div className="absolute inset-0 bg-white opacity-5"></div>
//           <div className="flex items-center gap-3 relative z-10">
//             <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
//               <Hotel className="w-6 h-6 text-primary-600" />
//             </div>
//             <div className="text-white">
//               <h1 className="text-xl font-bold">Hotel Manager</h1>
//               <p className="text-xs text-primary-100">Management System</p>
//             </div>
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
//           {menuItems.map((item) => {
//             const Icon = item.icon
//             const isExpanded = expandedMenus[item.id]
//             const isActive = activeItem === item.id

//             return (
//               <div key={item.id}>
//                 {/* Main Menu Item */}
//                 <button
//                   onClick={() => handleItemClick(item)}
//                   className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
//                     isActive && !item.isExpandable
//                       ? 'sidebar-item-active'
//                       : 'sidebar-item'
//                   }`}
//                 >
//                   <div className="flex items-center gap-3">
//                     <Icon className="w-5 h-5 flex-shrink-0" />
//                     <span className="font-medium text-sm">{item.label}</span>
//                   </div>
//                   {item.isExpandable && (
//                     <div className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
//                       <ChevronDown className="w-4 h-4" />
//                     </div>
//                   )}
//                 </button>

//                 {/* Sub Menu Items */}
//                 {item.isExpandable && isExpanded && (
//                   <div className="mt-2 ml-4 space-y-1 border-l-2 border-gray-200 pl-4">
//                     {item.subItems.map((subItem) => {
//                       const SubIcon = subItem.icon
//                       const isSubActive = activeItem === subItem.id

//                       return (
//                         <button
//                           key={subItem.id}
//                           onClick={() => handleSubItemClick(item.id, subItem)}
//                           className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-200 ${
//                             isSubActive
//                               ? 'bg-primary-100 text-primary-700 font-semibold'
//                               : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
//                           }`}
//                         >
//                           <SubIcon className="w-4 h-4 flex-shrink-0" />
//                           <span>{subItem.label}</span>
//                         </button>
//                       )
//                     })}
//                   </div>
//                 )}
//               </div>
//             )
//           })}
//         </nav>

//         {/* Footer */}
//         <div className="p-4 border-t border-gray-200 bg-gray-50">
//           <div className="text-xs text-center text-gray-500">
//             <p className="font-semibold text-gray-700">Version 1.0.0</p>
//             <p className="mt-1">© 2024 Hotel Management</p>
//           </div>
//         </div>
//       </aside>
//     </>
//   )
// }


'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Calendar,
  DoorOpen,
  Building2,
  Users,
  Menu,
  CalendarCheck,
  Settings,
  FileText,
  TrendingUp,
  Briefcase,
  FileImage,
  Receipt,
  Archive,
  ChevronDown,
  ChevronRight,
  Hotel,
  BedDouble,
  Warehouse,
  DollarSign,
  ShoppingCart,
  Ticket,
  Layers,
  Sparkles,
  ClipboardList,
  BarChart3,
  UserSquare2,
  PieChart,
  CreditCard,
  FileBarChart,
  UsersRound,
  Boxes,
  Star,
  MapPin,
  Globe,
  Languages,
  Coins,
  MessageSquare,
  Image,
  Mail,
  Grid3x3,
  ClipboardX
} from 'lucide-react'

export default function Sidebar({ isOpen, setIsOpen, activeItem, setActiveItem }) {
  const router = useRouter()
  const [expandedMenus, setExpandedMenus] = useState({})

  const toggleMenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }))
  }

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: '/dashboard'
    },
    {
      id: 'bookings',
      label: 'Bookings',
      icon: Calendar,
      path: '/bookings'
    },
    {
      id: 'booked-rooms',
      label: 'Booked Rooms',
      icon: DoorOpen,
      path: '/booked-rooms'
    },
    {
      id: 'booked-halls',
      label: 'Booked Halls',
      icon: Building2,
      path: '/booked-halls'
    },
    {
      id: 'guests',
      label: 'Guests',
      icon: Users,
      path: '/guests'
    },
    {
      id: 'menu',
      label: 'Menu',
      icon: Menu,
      path: '/menu'
    },
    {
      id: 'availability-calendar',
      label: 'Availability Calendar',
      icon: CalendarCheck,
      path: '/availability-calendar'
    },
    {
      id: 'hotel-config',
      label: 'Hotel Configuration',
      icon: Hotel,
      isExpandable: true,
      subItems: [
        { id: 'room-types', label: 'Room Types', icon: BedDouble, path: '/hotel-config/room-types' },
        { id: 'rooms', label: 'Rooms', icon: DoorOpen, path: '/hotel-config/rooms' },
        { id: 'hall-types', label: 'Hall Types', icon: Warehouse, path: '/hotel-config/hall-types' },
        { id: 'halls', label: 'Halls', icon: Building2, path: '/hotel-config/halls' },
        { id: 'price-manager', label: 'Price Manager', icon: DollarSign, path: '/hotel-config/price-manager' },
        { id: 'paid-services', label: 'Paid Services', icon: ShoppingCart, path: '/hotel-config/paid-services' },
        { id: 'coupon-management', label: 'Coupon Management', icon: Ticket, path: '/hotel-config/coupon-management' },
        { id: 'floors', label: 'Floors', icon: Layers, path: '/hotel-config/floors' },
        { id: 'amenities', label: 'Amenities', icon: Sparkles, path: '/hotel-config/amenities' },
        { id: 'housekeeping-status', label: 'Housekeeping Status', icon: ClipboardList, path: '/hotel-config/housekeeping-status' }
      ]
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: BarChart3,
      isExpandable: true,
      subItems: [
        { id: 'occupancy-report', label: 'Occupancy Report', icon: PieChart, path: '/reports/occupancy' },
        { id: 'guest-report', label: 'Guest Report', icon: UserSquare2, path: '/reports/guest' },
        { id: 'financial-report', label: 'Financial Report', icon: CreditCard, path: '/reports/financial' },
        { id: 'coupon-report', label: 'Coupon Report', icon: Ticket, path: '/reports/coupon' },
        { id: 'expense-report', label: 'Expense Report', icon: FileBarChart, path: '/reports/expense' }
      ]
    },
    {
      id: 'hr-management',
      label: 'HR Management',
      icon: UsersRound,
      isExpandable: true,
      subItems: [
        { id: 'employees', label: 'Employees', icon: Users, path: '/hr/employees' },
        { id: 'departments', label: 'Departments', icon: Boxes, path: '/hr/departments' },
        { id: 'designations', label: 'Designations', icon: Star, path: '/hr/designations' }
      ]
    },
    {
      id: 'cms',
      label: 'CMS',
      icon: FileImage,
      isExpandable: true,
      subItems: [
        { id: 'pages', label: 'Pages', icon: FileText, path: '/cms/pages' },
        { id: 'banners', label: 'Banners', icon: Image, path: '/cms/banners' },
        { id: 'gallery', label: 'Gallery', icon: Grid3x3, path: '/cms/gallery' },
        { id: 'mail-templates', label: 'Mail Templates', icon: Mail, path: '/cms/mail-templates' }
      ]
    },
    {
      id: 'administrative',
      label: 'Administrative',
      icon: Settings,
      isExpandable: true,
      subItems: [
        { id: 'settings', label: 'Settings', icon: Settings, path: '/admin/settings' },
        { id: 'languages', label: 'Languages', icon: Languages, path: '/admin/languages' },
        { id: 'currency', label: 'Currency', icon: Coins, path: '/admin/currency' },
        { id: 'location', label: 'Location', icon: MapPin, path: '/admin/location' },
        { id: 'tax-manager', label: 'Tax Manager', icon: Receipt, path: '/admin/tax-manager' },
        { id: 'testimonials', label: 'Testimonials', icon: MessageSquare, path: '/admin/testimonials' }
      ]
    },
    {
      id: 'expenses',
      label: 'Expenses',
      icon: Receipt,
      isExpandable: true,
      subItems: [
        { id: 'expenses-list', label: 'Expenses', icon: Receipt, path: '/expenses' },
        { id: 'expense-categories', label: 'Expense Categories', icon: Layers, path: '/expenses/categories' }
      ]
    },
    {
      id: 'archived-bookings',
      label: 'Archived Bookings',
      icon: Archive,
      path: '/archived-bookings'
    }
  ]

  const handleItemClick = (item) => {
    if (item.isExpandable) {
      toggleMenu(item.id)
    } else {
      setActiveItem(item.id)
      router.push(item.path)
      if (window.innerWidth < 1024) {
        setIsOpen(false)
      }
    }
  }

  const handleSubItemClick = (parentId, subItem) => {
    setActiveItem(subItem.id)
    router.push(subItem.path)
    if (window.innerWidth < 1024) {
      setIsOpen(false)
    }
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 w-72 overflow-hidden flex flex-col shadow-xl`}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-center border-b border-gray-200 bg-gradient-to-r from-primary-600 to-primary-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-white opacity-5"></div>
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <Hotel className="w-6 h-6 text-primary-600" />
            </div>
            <div className="text-white">
              <h1 className="text-xl font-bold">Hotel Manager</h1>
              <p className="text-xs text-primary-100">Management System</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isExpanded = expandedMenus[item.id]
            const isActive = activeItem === item.id

            return (
              <div key={item.id}>
                {/* Main Menu Item */}
                <button
                  onClick={() => handleItemClick(item)}
                  // Removed inline style prop
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-300 group relative overflow-hidden focus:outline-none ${
                    isActive && !item.isExpandable
                      ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg shadow-primary-500/30'
                      : 'text-gray-700 hover:bg-gradient-to-r hover:from-primary-50 hover:to-primary-100 hover:text-primary-700'
                  }`}
                >
                  {/* Hover effect background */}
                  <div className={`absolute inset-0 bg-gradient-to-r from-primary-100 to-primary-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isActive && !item.isExpandable ? 'hidden' : ''}`}></div>
                  
                  <div className="flex items-center gap-3 relative z-10">
                    <Icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${isActive && !item.isExpandable ? 'text-white' : ''}`} />
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                  {item.isExpandable && (
                    <div className={`transition-transform duration-300 relative z-10 ${isExpanded ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  )}
                </button>

                {/* Sub Menu Items */}
                {item.isExpandable && isExpanded && (
                  <div className="mt-2 ml-4 space-y-1 border-l-2 border-primary-200 pl-4">
                    {item.subItems.map((subItem) => {
                      const SubIcon = subItem.icon
                      const isSubActive = activeItem === subItem.id

                      return (
                        <button
                          key={subItem.id}
                          onClick={() => handleSubItemClick(item.id, subItem)}
                          // Removed inline style prop
                          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-300 group relative overflow-hidden focus:outline-none ${
                            isSubActive
                              ? 'bg-primary-100 text-primary-700 font-semibold shadow-sm'
                              : 'text-gray-600 hover:bg-primary-50 hover:text-primary-600'
                          }`}
                        >
                          {/* Hover effect for sub items */}
                          <div className={`absolute inset-0 bg-gradient-to-r from-primary-50 to-primary-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isSubActive ? 'hidden' : ''}`}></div>
                          
                          <SubIcon className={`w-4 h-4 flex-shrink-0 relative z-10 transition-transform duration-300 group-hover:scale-110 ${isSubActive ? 'text-primary-700' : ''}`} />
                          <span className="relative z-10">{subItem.label}</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-center text-gray-500">
            <p className="font-semibold text-gray-700">Version 1.0.0</p>
            <p className="mt-1">© 2024 Hotel Management</p>
          </div>
        </div>
      </aside>
    </>
  )
}