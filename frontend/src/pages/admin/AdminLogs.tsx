import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { admin as adminApi } from '../../services/api'
import { TableSkeleton } from '../../components/ui/LoadingSkeleton'

interface Pagination { page: number; limit: number; total: number; pages: number }

export default function AdminLogs() {
  const [page, setPage] = useState(1)
  const [imei, setImei] = useState('')
  const { data, isLoading } = useQuery({
    queryKey: ['admin-logs', page, imei],
    queryFn: () => adminApi.logs({ page, limit: 50, imei: imei || undefined }),
    select: (r) => r.data,
  })

  const pagination = data?.pagination as Pagination | undefined

  return (
    <div className="p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-6">System Logs</h1>
        <div className="glass-card p-6 mb-6">
          <input type="text" className="input-field" placeholder="Filter by IMEI..." value={imei} onChange={(e) => { setImei(e.target.value); setPage(1) }} />
        </div>
        <div className="glass-card p-6">
          {isLoading ? <TableSkeleton rows={8} /> : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200/50 dark:border-gray-700/30">
                      <th className="pb-3 font-medium">ID</th>
                      <th className="pb-3 font-medium">IMEI</th>
                      <th className="pb-3 font-medium">Source</th>
                      <th className="pb-3 font-medium">Found</th>
                      <th className="pb-3 font-medium">Duration</th>
                      <th className="pb-3 font-medium">IP</th>
                      <th className="pb-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data?.data as any[])?.map((log: any) => (
                      <tr key={log.id} className="border-b border-gray-100 dark:border-gray-800 text-xs">
                        <td className="py-2">{log.id}</td>
                        <td className="py-2 font-mono">{log.imei}</td>
                        <td className="py-2">{log.source}</td>
                        <td className="py-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${log.found ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                            {log.found ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="py-2">{log.duration ? `${log.duration}ms` : '-'}</td>
                        <td className="py-2 text-gray-400">{log.ip || '-'}</td>
                        <td className="py-2 text-gray-500">{new Date(log.createdAt).toLocaleString()}</td>
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
