import { NavLink } from 'react-router-dom'
import {
  ChartBarIcon, MagnifyingGlassIcon, ClipboardDocumentListIcon,
  UsersIcon, ClockIcon, Cog6ToothIcon, ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const links = [
  { to: '/admin', icon: ChartBarIcon, label: 'Dashboard', end: true },
  { to: '/admin/search', icon: MagnifyingGlassIcon, label: 'Search IMEI' },
  { to: '/admin/requests', icon: ClipboardDocumentListIcon, label: 'Requests' },
  { to: '/admin/users', icon: UsersIcon, label: 'Users' },
  { to: '/admin/logs', icon: ClockIcon, label: 'Logs' },
  { to: '/admin/settings', icon: Cog6ToothIcon, label: 'Settings' },
]

export default function AdminSidebar({ collapsed }: { collapsed: boolean }) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <aside className={`fixed left-0 top-16 bottom-0 z-40 glass border-r border-gray-200/50 dark:border-gray-700/30 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex flex-col h-full py-4">
        <nav className="flex-1 space-y-1 px-3">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} p-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-primary-500/10 text-primary-600 dark:text-primary-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`
              }
            >
              <link.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{link.label}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="px-3">
          <button onClick={handleLogout} className={`flex items-center ${collapsed ? 'justify-center' : 'space-x-3'} p-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 w-full transition`}>
            <ArrowLeftOnRectangleIcon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  )
}
