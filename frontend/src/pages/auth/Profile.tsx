import { useAuth } from '../../context/AuthContext'
import { motion } from 'framer-motion'
import { UserCircleIcon, EnvelopeIcon, ShieldCheckIcon, CalendarIcon } from '@heroicons/react/24/outline'

export default function Profile() {
  const { user } = useAuth()

  if (!user) return null

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
              {(user.name || user.email)[0].toUpperCase()}
            </div>
            <h1 className="text-2xl font-bold">{user.name || 'User'}</h1>
            <p className="text-sm text-gray-500 capitalize">{user.role?.toLowerCase()}</p>
          </div>
          <div className="space-y-4">
            {[
              { icon: UserCircleIcon, label: 'Name', value: user.name || 'Not set' },
              { icon: EnvelopeIcon, label: 'Email', value: user.email },
              { icon: ShieldCheckIcon, label: 'Role', value: user.role },
              { icon: CalendarIcon, label: 'Joined', value: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A' },
            ].map((item) => (
              <div key={item.label} className="flex items-center space-x-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <item.icon className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">{item.label}</p>
                  <p className="text-sm font-medium">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
