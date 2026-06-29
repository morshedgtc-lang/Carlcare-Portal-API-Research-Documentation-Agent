import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import {
  Bars3Icon, XMarkIcon, MoonIcon, SunIcon,
  UserCircleIcon, ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-200/50 dark:border-gray-700/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">I</div>
            <span className="font-bold text-lg gradient-text">IMEI Lookup</span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition">Home</Link>
            {user && (
              <Link to="/dashboard" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition">Dashboard</Link>
            )}
            {isAdmin && (
              <Link to="/admin" className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition">Admin</Link>
            )}
          </div>

          <div className="flex items-center space-x-3">
            <button onClick={toggle} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              {dark ? <SunIcon className="w-5 h-5 text-amber-400" /> : <MoonIcon className="w-5 h-5 text-gray-600" />}
            </button>

            {user ? (
              <div className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                  <UserCircleIcon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                  <span className="text-sm font-medium hidden sm:block">{user.name || user.email}</span>
                </button>
                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 glass rounded-xl shadow-xl border border-gray-200/50 dark:border-gray-700/30 z-20">
                      <div className="p-3 border-b border-gray-200/50 dark:border-gray-700/30">
                        <p className="text-sm font-medium truncate">{user.email}</p>
                        <p className="text-xs text-gray-500 capitalize">{user.role?.toLowerCase()}</p>
                      </div>
                      <div className="p-2">
                        <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm transition">Profile</Link>
                        <Link to="/dashboard" onClick={() => setProfileOpen(false)} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm transition">Dashboard</Link>
                      </div>
                      <div className="p-2 border-t border-gray-200/50 dark:border-gray-700/30">
                        <button onClick={handleLogout} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-sm text-red-600 w-full transition">
                          <ArrowRightOnRectangleIcon className="w-4 h-4" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm py-2 px-4">Sign In</Link>
            )}

            <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              {open ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="md:hidden glass border-t border-gray-200/50 dark:border-gray-700/30">
          <div className="px-4 py-3 space-y-2">
            <Link to="/" onClick={() => setOpen(false)} className="block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm">Home</Link>
            {user && <Link to="/dashboard" onClick={() => setOpen(false)} className="block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm">Dashboard</Link>}
            {isAdmin && <Link to="/admin" onClick={() => setOpen(false)} className="block p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm">Admin</Link>}
          </div>
        </div>
      )}
    </nav>
  )
}
