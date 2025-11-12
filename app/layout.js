// app/layout.js
import './globals.css'
import { Inter } from 'next/font/google'
import DashboardLayout from '@/components/DashboardLayout' // <-- New Client Component

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Hotel Management System',
  description: 'Professional hotel management and booking system',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/*
        The body should only contain a minimal wrapper.
        The layout components (Header/Sidebar) will be inside DashboardLayout.
      */}
      <body className={inter.className}>
        <DashboardLayout>
          {children}
        </DashboardLayout>
      </body>
    </html>
  )
}