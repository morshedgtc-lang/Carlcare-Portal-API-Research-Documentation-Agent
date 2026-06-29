import { motion } from 'framer-motion'
import { MagnifyingGlassIcon, ShieldCheckIcon, GlobeAltIcon, ClockIcon } from '@heroicons/react/24/outline'
import ImeiSearchCard from '../components/ui/ImeiSearchCard'
import StatCard from '../components/ui/StatCard'

const stats = [
  { title: 'Devices Checked', value: '12,458', icon: <MagnifyingGlassIcon className="w-6 h-6" />, color: 'from-primary-500 to-blue-600' },
  { title: 'Success Rate', value: '94.2%', icon: <ShieldCheckIcon className="w-6 h-6" />, color: 'from-green-500 to-emerald-600' },
  { title: 'Countries', value: '36', icon: <GlobeAltIcon className="w-6 h-6" />, color: 'from-purple-500 to-pink-600' },
  { title: 'Avg Response', value: '< 1s', icon: <ClockIcon className="w-6 h-6" />, color: 'from-amber-500 to-orange-600' },
]

export default function Home() {
  return (
    <div className="min-h-screen">
      <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 via-purple-500/5 to-pink-500/5" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '-3s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-500/10 text-primary-600 dark:text-primary-400 mb-6">
              IMEI Verification Platform
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Check Your Device
              <span className="gradient-text block mt-2">Status Instantly</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              Enter your IMEI number to check the unlock status, service requests, and device information across our global network.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="max-w-lg mx-auto">
            <ImeiSearchCard />
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => <StatCard key={s.title} {...s} delay={0.3 + i * 0.1} />)}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-card p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">How It Works</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto mb-8">Three simple steps to check your device status</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Enter IMEI', desc: 'Type or paste the 15-digit IMEI number of your device' },
              { step: '02', title: 'Instant Search', desc: 'Our system checks the database and external sources in real-time' },
              { step: '03', title: 'Get Results', desc: 'View detailed status, service history, and next steps' },
            ].map((item) => (
              <div key={item.step} className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50">
                <span className="text-3xl font-bold gradient-text">{item.step}</span>
                <h3 className="text-lg font-semibold mt-3 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  )
}
