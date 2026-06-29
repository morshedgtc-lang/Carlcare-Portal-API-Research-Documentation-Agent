import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { service as serviceApi } from '../../services/api'
import { Link } from 'react-router-dom'
import ImeiSearchCard from '../../components/ui/ImeiSearchCard'
import StatusBadge from '../../components/ui/StatusBadge'
import { TableSkeleton } from '../../components/ui/LoadingSkeleton'
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['my-requests'],
    queryFn: () => serviceApi.myRequests(1, 10),
    select: (r) => r.data,
  })

  const copyNumber = (num: string) => {
    navigator.clipboard.writeText(num)
    toast.success('Service number copied')
  }

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8">Search IMEIs and manage your service requests</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <ImeiSearchCard />
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 md:p-8">
            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/dashboard/requests" className="block p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                <p className="font-semibold">My Requests</p>
                <p className="text-sm text-gray-500">View all your service requests</p>
              </Link>
              <Link to="/profile" className="block p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                <p className="font-semibold">Profile Settings</p>
                <p className="text-sm text-gray-500">Manage your account</p>
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6 md:p-8">
          <h3 className="text-xl font-bold mb-4">Recent Requests</h3>
          {isLoading ? <TableSkeleton rows={4} /> : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200/50 dark:border-gray-700/30">
                    <th className="pb-3 font-medium">Service #</th>
                    <th className="pb-3 font-medium">IMEI</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Date</th>
                    <th className="pb-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {(data?.data as any[])?.map((r: any) => (
                    <tr key={r.id} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-3 font-medium">{r.serviceNumber}</td>
                      <td className="py-3 text-gray-500">{r.imei}</td>
                      <td className="py-3"><StatusBadge status={r.status} /></td>
                      <td className="py-3 text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                      <td className="py-3">
                        <button onClick={() => copyNumber(r.serviceNumber)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                          <ClipboardDocumentIcon className="w-4 h-4 text-gray-400" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {(!data?.data || (data.data as any[]).length === 0) && (
                    <tr><td colSpan={5} className="py-6 text-center text-gray-500">No requests yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
