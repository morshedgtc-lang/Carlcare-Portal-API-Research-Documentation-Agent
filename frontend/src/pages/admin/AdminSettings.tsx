import { motion } from 'framer-motion'

export default function AdminSettings() {
  return (
    <div className="p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        <div className="glass-card p-6">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Carlcare API Configuration</h3>
              <p className="text-sm text-gray-500 mb-4">Configure the external Carlcare API integration</p>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">API Base URL</label>
                  <input type="text" className="input-field" defaultValue="https://service.carlcare.com/CarlcareClient" readOnly />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">API Key</label>
                  <input type="password" className="input-field" placeholder="Enter API key" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">API Secret</label>
                  <input type="password" className="input-field" placeholder="Enter API secret" />
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200/50 dark:border-gray-700/30">
              <h3 className="font-semibold mb-2">Thailand Auto-Submit</h3>
              <p className="text-sm text-gray-500 mb-4">Automatically create service requests for Thailand devices</p>
              <div className="flex items-center space-x-3">
                <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500" defaultChecked />
                <span className="text-sm">Enable auto-submit for Thailand (MCC: 520)</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
