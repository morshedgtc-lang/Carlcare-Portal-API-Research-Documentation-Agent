import { useState } from 'react'
import { motion } from 'framer-motion'
import { admin as adminApi } from '../../services/api'
import StatusBadge from '../../components/ui/StatusBadge'

export default function AdminSearch() {
  const [imei, setImei] = useState('')
  const [results, setResults] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = async () => {
    if (!imei) return
    setLoading(true)
    try {
      const { data } = await adminApi.searchImei(imei)
      setResults(data.data)
    } catch { setResults([]) }
    finally { setLoading(false) }
  }

  return (
    <div className="p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-6">IMEI Search (Admin)</h1>
        <div className="glass-card p-6 mb-6">
          <div className="flex gap-3">
            <input type="text" className="input-field flex-1" placeholder="Enter IMEI" value={imei} onChange={(e) => setImei(e.target.value.replace(/\D/g, '').slice(0, 15))} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
            <button onClick={handleSearch} disabled={loading} className="btn-primary">Search</button>
          </div>
        </div>

        {results && (
          <div className="glass-card p-6">
            <p className="text-sm text-gray-500 mb-4">{results.length} result(s) found</p>
            {results.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200/50 dark:border-gray-700/30">
                      <th className="pb-3 font-medium">Service #</th>
                      <th className="pb-3 font-medium">IMEI</th>
                      <th className="pb-3 font-medium">Brand</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">User</th>
                      <th className="pb-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((r: any) => (
                      <tr key={r.id} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-3 font-medium">{r.serviceNumber}</td>
                        <td className="py-3 text-gray-500">{r.imei}</td>
                        <td className="py-3">{r.brand || '-'}</td>
                        <td className="py-3"><StatusBadge status={r.status} /></td>
                        <td className="py-3">{r.submittedByUser?.email || 'N/A'}</td>
                        <td className="py-3 text-gray-500">{new Date(r.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center py-6 text-gray-500">No records found for this IMEI</p>
            )}
          </div>
        )}
      </motion.div>
    </div>
  )
}
