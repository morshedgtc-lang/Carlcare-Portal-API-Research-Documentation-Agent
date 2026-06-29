import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { service as serviceApi } from '../../services/api'
import StatusBadge from '../../components/ui/StatusBadge'
import { TableSkeleton } from '../../components/ui/LoadingSkeleton'
import { ClipboardDocumentIcon } from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

interface Pagination { page: number; limit: number; total: number; pages: number }

export default function MyRequests() {
  const [page, setPage] = useState(1)
  const { data, isLoading } = useQuery({
    queryKey: ['my-requests-page', page],
    queryFn: () => serviceApi.myRequests(page),
    select: (r) => r.data,
  })

  const copy = (text: string) => { navigator.clipboard.writeText(text); toast.success('Copied') }

  const pagination = data?.pagination as Pagination | undefined

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-6">My Service Requests</h1>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 md:p-8">
          {isLoading ? <TableSkeleton /> : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200/50 dark:border-gray-700/30">
                      <th className="pb-3 font-medium">Service #</th>
                      <th className="pb-3 font-medium">IMEI</th>
                      <th className="pb-3 font-medium">Brand</th>
                      <th className="pb-3 font-medium">Model</th>
                      <th className="pb-3 font-medium">Country</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data?.data as any[])?.map((r: any) => (
                      <tr key={r.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                        <td className="py-3 font-medium">{r.serviceNumber}</td>
                        <td className="py-3 text-gray-500">{r.imei}</td>
                        <td className="py-3">{r.brand || '-'}</td>
                        <td className="py-3">{r.model || '-'}</td>
                        <td className="py-3">{r.country || '-'}</td>
                        <td className="py-3"><StatusBadge status={r.status} /></td>
                        <td className="py-3 text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                        <td className="py-3">
                          <button onClick={() => copy(r.serviceNumber)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition">
                            <ClipboardDocumentIcon className="w-4 h-4 text-gray-400" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {(!data?.data || (data.data as any[]).length === 0) && (
                      <tr><td colSpan={8} className="py-8 text-center text-gray-500">No service requests found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              {pagination && pagination.pages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200/50 dark:border-gray-700/30">
                  <p className="text-sm text-gray-500">Page {page} of {pagination.pages}</p>
                  <div className="flex space-x-2">
                    <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="btn-secondary text-sm py-2 px-4 disabled:opacity-50">Previous</button>
                    <button disabled={page >= pagination.pages} onClick={() => setPage(page + 1)} className="btn-secondary text-sm py-2 px-4 disabled:opacity-50">Next</button>
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}
