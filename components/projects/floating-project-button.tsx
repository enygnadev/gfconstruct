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
          'rounded-full shadow-lg hover:shadow-xl ring-1 ring-white/10',
          'flex items-center justify-center',
          'transition-all duration-200',
          'border border-white/20 bg-transparent',
          'glass glass-btn glass-pulse'
        )}
        aria-label="Criar novo projeto"
      >
        <motion.div
          animate={{ rotate: 0 }}
          whileHover={{ rotate: 90 }}
          transition={{ duration: 0.3 }}
        >
          <Plus className="h-6 w-6 sm:h-7 sm:w-7 text-gold-500" strokeWidth={3} />
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
            <div className="px-4 py-2 text-white rounded-lg glass text-sm font-medium relative overflow-hidden">
              <div className="glass-shine" />
              Novo Projeto
              <div className="absolute left-full top-1/2 -translate-y-1/2 w-2 h-2 bg-white/20 dark:bg-slate-900/30 transform rotate-45" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pulse effect */}
      <motion.div
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute inset-0 rounded-full bg-gold-500/20"
      />
      {/* glass-shine overlay */}
      <div className="absolute inset-0 rounded-full pointer-events-none overflow-hidden">
        <div className="glass-shine" />
      </div>
      {/* sparkle accents */}
      <div className="absolute -top-1 -left-1 w-2 h-2 sparkle opacity-80" />
      <div className="absolute -bottom-1 -right-2 w-2 h-2 sparkle opacity-60" />
    </motion.div>
  )
}
