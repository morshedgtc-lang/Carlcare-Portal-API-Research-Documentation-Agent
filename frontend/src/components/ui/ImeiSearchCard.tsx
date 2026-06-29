import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MagnifyingGlassIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { imei as imeiApi } from '../../services/api'
import { SearchResult } from '../../types'
import StatusBadge from './StatusBadge'

export default function ImeiSearchCard() {
  const [imei, setImei] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<SearchResult | null>(null)
  const [error, setError] = useState('')

  const validate = (val: string) => /^\d{15}$/.test(val)

  const handleSearch = async () => {
    setError('')
    setResult(null)
    if (!validate(imei)) {
      setError('IMEI must be exactly 15 digits')
      return
    }
    setLoading(true)
    try {
      const { data } = await imeiApi.search(imei)
      setResult(data.data)
    } catch (err: any) {
      setError(err.response?.data?.error || 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-card p-6 md:p-8">
      <h3 className="text-xl font-bold mb-2">IMEI Lookup</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Enter a 15-digit IMEI number to check its status</p>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <input
            type="text"
            value={imei}
            onChange={(e) => { setImei(e.target.value.replace(/\D/g, '').slice(0, 15)); setError('') }}
            placeholder="Enter 15-digit IMEI"
            className="input-field pl-10"
            maxLength={15}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
        <button onClick={handleSearch} disabled={loading || imei.length !== 15} className="btn-primary flex items-center justify-center gap-2 min-w-[140px]">
          {loading ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : <MagnifyingGlassIcon className="w-5 h-5" />}
          {loading ? 'Searching...' : 'Search'}
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/30"
          >
            {'found' in result && result.found === false ? (
              <div className="text-center py-6">
                <p className="text-lg font-semibold text-gray-500">{result.message || 'No Record Found'}</p>
                {result.autoSubmitted && (
                  <div className="mt-4 p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900">
                    <p className="text-sm text-green-700 dark:text-green-400">Auto-submitted for Thailand</p>
                    <p className="text-xs mt-1">Service Number: {result.serviceNumber}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { label: 'Brand', value: result.brand },
                  { label: 'Model', value: result.model },
                  { label: 'IMEI', value: result.imei },
                  { label: 'Country', value: result.country },
                  { label: 'Service Number', value: result.serviceNumber },
                  { label: 'Application Time', value: result.applicationTime },
                  { label: 'Review Time', value: result.reviewTime },
                  { label: 'Status', value: result.status, badge: true },
                ].map((item) => (
                  <div key={item.label} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{item.label}</p>
                    {item.badge ? (
                      <StatusBadge status={item.value || ''} />
                    ) : (
                      <p className="text-sm font-medium truncate">{item.value || '-'}</p>
                    )}
                  </div>
                ))}
                {result.note && (
                  <div className="sm:col-span-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Note</p>
                    <p className="text-sm">{result.note}</p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
