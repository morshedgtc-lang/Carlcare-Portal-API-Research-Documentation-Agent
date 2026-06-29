import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { admin as adminApi } from '../../services/api'
import { TableSkeleton } from '../../components/ui/LoadingSkeleton'

interface Pagination { page: number; limit: number; total: number; pages: number }

export default function AdminUsers() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page],
    queryFn: () => adminApi.users(page),
    select: (r) => r.data,
  })

  const pagination = data?.pagination as Pagination | undefined

  return (
    <div className="p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-6">Users</h1>
        <div className="glass-card p-6">
          {isLoading ? <TableSkeleton /> : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200/50 dark:border-gray-700/30">
                      <th className="pb-3 font-medium">ID</th>
                      <th className="pb-3 font-medium">Name</th>
                      <th className="pb-3 font-medium">Email</th>
                      <th className="pb-3 font-medium">Role</th>
                      <th className="pb-3 font-medium">Requests</th>
                      <th className="pb-3 font-medium">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data?.data as any[])?.map((u: any) => (
                      <tr key={u.id} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-3">{u.id}</td>
                        <td className="py-3 font-medium">{u.name || '-'}</td>
                        <td className="py-3 text-gray-500">{u.email}</td>
                        <td className="py-3">
                          <span className={`status-badge ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>{u.role}</span>
                        </td>
                        <td className="py-3">{u._count?.serviceRequests || 0}</td>
                        <td className="py-3 text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {pagination && pagination.pages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200/50 dark:border-gray-700/30">
                  <p className="text-sm text-gray-500">Page {page} of {pagination.pages}</p>
                  <div className="flex space-x-2">
                    <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="btn-secondary text-sm py-2 px-4">Prev</button>
                    <button disabled={page >= pagination.pages} onClick={() => setPage(page + 1)} className="btn-secondary text-sm py-2 px-4">Next</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  )
}
