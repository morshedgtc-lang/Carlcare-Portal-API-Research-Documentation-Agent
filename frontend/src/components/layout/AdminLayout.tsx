import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AdminSidebar collapsed={collapsed} />
      <div className={`transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="flex items-center h-16 px-6 glass border-b border-gray-200/50 dark:border-gray-700/30">
          <button onClick={() => setCollapsed(!collapsed)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            {collapsed ? <Bars3Icon className="w-5 h-5" /> : <XMarkIcon className="w-5 h-5" />}
          </button>
          <span className="ml-4 text-sm text-gray-500">Admin Panel</span>
        </div>
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
