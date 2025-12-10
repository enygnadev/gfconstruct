"use client"

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FloatingProjectButtonProps {
  onClick: () => void
  className?: string
}

export function FloatingProjectButton({ onClick, className }: FloatingProjectButtonProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showLabel, setShowLabel] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, y: 20 }}
      animate={isVisible ? { opacity: 1, scale: 1, y: 0 } : {}}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className={cn(
        'fixed bottom-8 right-8 z-40',
        'sm:bottom-10 sm:right-10 lg:bottom-12 lg:right-12',
        className
      )}
      onMouseEnter={() => setShowLabel(true)}
      onMouseLeave={() => setShowLabel(false)}
    >
      <motion.button
        onClick={onClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className={cn(
          'relative h-14 w-14 sm:h-16 sm:w-16',
          'rounded-full shadow-lg hover:shadow-xl',
          'bg-gradient-to-br from-gold-500 to-gold-600',
          'text-white font-bold',
          'flex items-center justify-center',
          'transition-all duration-200',
          'hover:from-gold-600 hover:to-gold-700',
          'active:from-gold-700 active:to-gold-800',
          'border border-gold-700/20'
        )}
        aria-label="Criar novo projeto"
      >
        <motion.div
          animate={{ rotate: 0 }}
          whileHover={{ rotate: 90 }}
          transition={{ duration: 0.3 }}
        >
          <Plus className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={3} />
        </motion.div>
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {showLabel && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-full mr-4 top-1/2 -translate-y-1/2 whitespace-nowrap"
          >
            <div className="px-4 py-2 bg-slate-900 dark:bg-slate-950 text-white rounded-lg shadow-lg text-sm font-medium">
              Novo Projeto
              <div className="absolute left-full top-1/2 -translate-y-1/2 w-2 h-2 bg-slate-900 dark:bg-slate-950 transform rotate-45" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pulse effect */}
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute inset-0 rounded-full bg-gold-500/20"
      />
    </motion.div>
  )
}
