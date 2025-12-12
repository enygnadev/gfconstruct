"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { List, FolderOpen, Brain, Calendar, Users, DollarSign, Box, Package, Leaf, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/sistema/dashboard', label: 'Dashboard', icon: BarChart3 },
  { href: '/sistema/projetos', label: 'Projetos & Obras', icon: FolderOpen },
  { href: '/sistema/orcamento-quantico', label: 'Orçamento Quântico', icon: Brain },
  { href: '/sistema/cronograma-adaptativo', label: 'Cronograma Adaptativo', icon: Calendar },
  { href: '/sistema/consultoria-ia', label: 'Consultoria IA', icon: Users },
  { href: '/sistema/financeiro', label: 'Financeiro', icon: DollarSign },
  { href: '/sistema/materiais', label: 'Materiais', icon: Box },
  { href: '/sistema/sustentabilidade', label: 'Sustentabilidade', icon: Leaf },
]

export default function AdvancedMenu({ className }: { className?: string }) {
  const path = usePathname()

  return (
    <nav className={cn('bg-slate-100 dark:bg-slate-800 rounded-lg p-3', className)}>
      <ul className="flex flex-col gap-2">
        {navItems.map(item => {
          const Icon = item.icon
          const active = path?.startsWith(item.href)
          return (
            <li key={item.href}>
              <Link href={item.href} className={cn('flex items-center gap-3 px-3 py-2 rounded-lg', active ? 'bg-gold-500 text-slate-900' : 'text-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700') }>
                <Icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
