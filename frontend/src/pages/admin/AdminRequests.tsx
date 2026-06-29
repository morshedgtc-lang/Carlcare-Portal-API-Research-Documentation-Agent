import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { admin as adminApi } from '../../services/api'
import StatusBadge from '../../components/ui/StatusBadge'
import { TableSkeleton } from '../../components/ui/LoadingSkeleton'
import toast from 'react-hot-toast'

const statuses = ['', 'PENDING', 'PROCESSING', 'APPROVED', 'DISAPPROVED', 'CANCELLED']

interface Pagination { page: number; limit: number; total: number; pages: number }

export default function AdminRequests() {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editStatus, setEditStatus] = useState('')
  const [editNote, setEditNote] = useState('')
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-requests', page, status, search],
    queryFn: () => adminApi.requests({ page, limit: 20, status: status || undefined, search: search || undefined }),
    select: (r) => r.data,
  })

  const updateMutation = useMutation({
    mutationFn: (vars: { id: number; status: string; note: string }) =>
      adminApi.updateRequest(vars.id, { status: vars.status, adminNote: vars.note }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-requests'] })
      toast.success('Request updated')
      setEditingId(null)
    },
    onError: (err: any) => toast.error(err.response?.data?.error || 'Update failed'),
  })

  const handleExport = async () => {
    try {
      const res = await adminApi.exportCsv()
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url; a.download = `requests-${Date.now()}.csv`; a.click()
      toast.success('CSV exported')
    } catch { toast.error('Export failed') }
  }

  const pagination = data?.pagination as Pagination | undefined

  return (
    <div className="p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold">Service Requests</h1>
          <button onClick={handleExport} className="btn-secondary text-sm">Export CSV</button>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }} className="input-field sm:w-40">
            {statuses.map(s => <option key={s} value={s}>{s || 'All Statuses'}</option>)}
          </select>
          <input type="text" className="input-field flex-1" placeholder="Search IMEI, service number, brand..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1) }} />
        </div>

        <div className="glass-card p-6">
          {isLoading ? <TableSkeleton /> : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200/50 dark:border-gray-700/30">
                      <th className="pb-3 font-medium">Service #</th>
                      <th className="pb-3 font-medium">IMEI</th>
                      <th className="pb-3 font-medium">Brand</th>
                      <th className="pb-3 font-medium">Country</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">User</th>
                      <th className="pb-3 font-medium">Date</th>
                      <th className="pb-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data?.data as any[])?.map((r: any) => (
                      <tr key={r.id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                        <td className="py-3 font-medium">{r.serviceNumber}</td>
                        <td className="py-3 text-gray-500">{r.imei}</td>
                        <td className="py-3">{r.brand || '-'}</td>
                        <td className="py-3">{r.country || '-'}</td>
                        <td className="py-3">
                          {editingId === r.id ? (
                            <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} className="input-field text-xs py-1">
                              {statuses.filter(Boolean).map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          ) : <StatusBadge status={r.status} />}
                        </td>
                        <td className="py-3 text-gray-500">{r.submittedByUser?.email || 'N/A'}</td>
                        <td className="py-3 text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                        <td className="py-3">
                          {editingId === r.id ? (
                            <div className="flex gap-2">
                              <button onClick={() => updateMutation.mutate({ id: r.id, status: editStatus, note: editNote })} className="text-xs btn-primary py-1 px-3">Save</button>
                              <button onClick={() => setEditingId(null)} className="text-xs btn-secondary py-1 px-3">Cancel</button>
                            </div>
                          ) : (
                            <button onClick={() => { setEditingId(r.id); setEditStatus(r.status); setEditNote(r.adminNote || '') }} className="text-sm text-primary-600 hover:text-primary-500 font-medium">Edit</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {pagination && pagination.pages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200/50 dark:border-gray-700/30">
                  <p className="text-sm text-gray-500">Page {page} of {pagination.pages}</p>
                  <div className="flex space-x-2">
                    <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="btn-secondary text-sm py-2 px-4 disabled:opacity-50">Prev</button>
                    <button disabled={page >= pagination.pages} onClick={() => setPage(page + 1)} className="btn-secondary text-sm py-2 px-4 disabled:opacity-50">Next</button>
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
