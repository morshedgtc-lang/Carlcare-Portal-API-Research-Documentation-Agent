export default function Footer() {
  return (
    <footer className="border-t border-gray-200/50 dark:border-gray-700/30 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs">I</div>
            <span className="font-semibold text-sm gradient-text">IMEI Lookup</span>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">&copy; {new Date().getFullYear()} IMEI Lookup Platform. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
