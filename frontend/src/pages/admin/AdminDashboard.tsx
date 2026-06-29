import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { admin as adminApi } from '../../services/api'
import StatCard from '../../components/ui/StatCard'
import StatusBadge from '../../components/ui/StatusBadge'
import { CardSkeleton, TableSkeleton } from '../../components/ui/LoadingSkeleton'
import {
  UsersIcon, MagnifyingGlassIcon, ClipboardDocumentListIcon, ClockIcon,
} from '@heroicons/react/24/outline'
import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface Stats { totalUsers: number; totalSearches: number; totalRequests: number; pendingRequests: number; approvedRequests: number; todaySearches: number; monthSearches: number }

export default function AdminDashboard() {
  const { data: dashData, isLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminApi.dashboard(),
    select: (r: any) => r.data.data,
  })
  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ['admin-charts'],
    queryFn: () => adminApi.charts(14),
    select: (r: any) => r.data.data,
  })

  if (isLoading) return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1,2,3,4].map(i => <CardSkeleton key={i} />)}
      </div>
      <TableSkeleton />
    </div>
  )

  const stats = dashData?.stats as Stats | undefined
  const chartConfig = {
    labels: chartData?.labels || [],
    datasets: [{
      label: 'Searches',
      data: chartData?.values || [],
      backgroundColor: 'rgba(99, 102, 241, 0.6)',
      borderRadius: 8,
    }],
  }

  return (
    <div className="p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Users" value={stats?.totalUsers || 0} icon={<UsersIcon className="w-5 h-5" />} color="from-primary-500 to-blue-600" delay={0} />
        <StatCard title="Total Searches" value={stats?.totalSearches || 0} icon={<MagnifyingGlassIcon className="w-5 h-5" />} color="from-purple-500 to-pink-600" delay={0.1} />
        <StatCard title="Total Requests" value={stats?.totalRequests || 0} icon={<ClipboardDocumentListIcon className="w-5 h-5" />} color="from-amber-500 to-orange-600" delay={0.2} />
        <StatCard title="Pending" value={stats?.pendingRequests || 0} icon={<ClockIcon className="w-5 h-5" />} color="from-green-500 to-emerald-600" delay={0.3} />
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="text-lg font-bold mb-4">Daily Searches (14 days)</h3>
          {chartLoading ? <div className="h-48 animate-pulse bg-gray-100 dark:bg-gray-800 rounded-xl" /> : (
            <Bar data={chartConfig} options={{ responsive: true, plugins: { legend: { display: false } } }} />
          )}
        </div>
        <div className="glass-card p-6">
          <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
          <div className="space-y-3">
            {[
              { label: 'Today Searches', value: stats?.todaySearches || 0 },
              { label: 'This Month', value: stats?.monthSearches || 0 },
              { label: 'Approved', value: stats?.approvedRequests || 0 },
            ].map((s) => (
              <div key={s.label} className="flex justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <span className="text-sm text-gray-500">{s.label}</span>
                <span className="font-bold">{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-lg font-bold mb-4">Recent Requests</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200/50 dark:border-gray-700/30">
                <th className="pb-3 font-medium">Service #</th>
                <th className="pb-3 font-medium">IMEI</th>
                <th className="pb-3 font-medium">User</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {(dashData?.recentRequests as any[])?.map((r: any) => (
                <tr key={r.id} className="border-b border-gray-100 dark:border-gray-800">
                  <td className="py-3 font-medium">{r.serviceNumber}</td>
                  <td className="py-3 text-gray-500">{r.imei}</td>
                  <td className="py-3">{r.submittedByUser?.email || 'Anonymous'}</td>
                  <td className="py-3"><StatusBadge status={r.status} /></td>
                  <td className="py-3 text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
