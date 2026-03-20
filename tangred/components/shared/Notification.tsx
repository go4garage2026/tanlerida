'use client'

import { useUIStore } from '@/store/uiStore'
import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, XCircle, Info, X } from 'lucide-react'

export function Notification() {
  const { notification, clearNotification } = useUIStore()

  const icons = {
    success: <CheckCircle size={16} className="text-green-400 shrink-0" />,
    error: <XCircle size={16} className="text-[#C0392B] shrink-0" />,
    info: <Info size={16} className="text-[#BFA07A] shrink-0" />,
  }

  return (
    <div className="fixed bottom-6 right-6 z-[300] pointer-events-none">
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto flex items-start gap-3 bg-[#1A1A1A] border border-[#2A2A2A] px-4 py-3 shadow-2xl max-w-sm"
            style={{ borderRadius: '2px' }}
          >
            {icons[notification.type]}
            <p className="font-body text-sm text-[#F5F5F5] flex-1">{notification.message}</p>
            <button
              onClick={clearNotification}
              className="text-[#A0A0A0] hover:text-[#F5F5F5] transition-luxury mt-0.5 shrink-0"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
