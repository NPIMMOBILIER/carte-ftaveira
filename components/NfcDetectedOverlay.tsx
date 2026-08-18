'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export function NfcDetectedOverlay() {
  const searchParams = useSearchParams()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (searchParams.get('src') === 'nfc') {
      setVisible(true)
      const timer = setTimeout(() => setVisible(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-primary/90 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="flex flex-col items-center gap-3 text-cream"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
          >
            <motion.div
              className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-accent text-3xl text-accent"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
            >
              ✓
            </motion.div>
            <p className="text-xl font-semibold tracking-wide">Carte détectée</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
