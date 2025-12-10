"use client"

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type NotificationType = 'success' | 'error' | 'info' | 'warning'

interface ProjectNotificationProps {
  type: NotificationType
  title: string
  message?: string
  duration?: number
  onClose?: () => void
  action?: {
    label: string
    onClick: () => void
  }
}

export function ProjectNotification({
  type,
  title,
  message,
  duration = 5000,
  onClose,
  action
}: ProjectNotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (duration && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const iconMap = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
    warning: AlertCircle
  }

  const colorMap = {
    success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
  }

  const textColorMap = {
    success: 'text-green-900 dark:text-green-100',
    error: 'text-red-900 dark:text-red-100',
    info: 'text-blue-900 dark:text-blue-100',
    warning: 'text-yellow-900 dark:text-yellow-100'
  }

  const iconColorMap = {
    success: 'text-green-600 dark:text-green-400',
    error: 'text-red-600 dark:text-red-400',
    info: 'text-blue-600 dark:text-blue-400',
    warning: 'text-yellow-600 dark:text-yellow-400'
  }

  const Icon = iconMap[type]

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className={cn(
            'p-4 rounded-lg border flex items-start gap-3 relative',
            colorMap[type]
          )}
        >
          <Icon className={cn('h-5 w-5 flex-shrink-0 mt-0.5', iconColorMap[type])} />
          
          <div className="flex-1">
            <p className={cn('font-medium', textColorMap[type])}>
              {title}
            </p>
            {message && (
              <p className={cn('text-sm mt-1', textColorMap[type])}>
                {message}
              </p>
            )}
            {action && (
              <button
                onClick={action.onClick}
                className={cn(
                  'text-sm font-medium mt-2 hover:underline',
                  textColorMap[type]
                )}
              >
                {action.label}
              </button>
            )}
          </div>

          <button
            onClick={() => {
              setIsVisible(false)
              onClose?.()
            }}
            className={cn(
              'p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded transition-colors flex-shrink-0',
              textColorMap[type]
            )}
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Hook para gerenciar notificações
export function useNotification() {
  const [notifications, setNotifications] = useState<(ProjectNotificationProps & { id: string })[]>([])

  const add = (notification: Omit<ProjectNotificationProps, 'onClose'>) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newNotification = {
      ...notification,
      id,
      onClose: () => remove(id)
    }
    setNotifications(prev => [...prev, newNotification])
    return id
  }

  const remove = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const success = (title: string, message?: string) => {
    return add({ type: 'success', title, message })
  }

  const error = (title: string, message?: string) => {
    return add({ type: 'error', title, message })
  }

  const info = (title: string, message?: string) => {
    return add({ type: 'info', title, message })
  }

  const warning = (title: string, message?: string) => {
    return add({ type: 'warning', title, message })
  }

  return {
    notifications,
    add,
    remove,
    success,
    error,
    info,
    warning
  }
}
