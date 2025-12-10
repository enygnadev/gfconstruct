"use client"

import Link from "next/link"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { DrawerTitle, DrawerDescription } from "@/components/ui/drawer"


interface NavItem {
  href: string
  label: string
}

interface MobileNavProps {
  navItems: NavItem[]
  currentPath: string
  onClose: () => void
}

export function MobileNav({ navItems, currentPath, onClose }: MobileNavProps) {
  return (
    <div className="flex flex-col h-full p-6">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
          <Logo />
          <span className="text-xl font-semibold tracking-wider">GF CONSTRUTORA</span>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-6 w-6" />
          <span className="sr-only">Fechar</span>
        </Button>
      </div>

      <nav className="flex flex-col space-y-6">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "text-lg font-medium transition-colors",
              currentPath === item.href ? "text-orange-500" : "text-slate-300 hover:text-orange-500",
            )}
            onClick={onClose}
          >
            {item.label}
          </Link>
        ))}
        <Link
          href="/sistema"
          className={cn(
            "text-lg font-medium transition-colors",
            currentPath === "/sistema" ? "text-orange-500" : "text-slate-300 hover:text-orange-500",
          )}
          onClick={onClose}
        >
          Sistema
        </Link>
      </nav>

      <div className="mt-8 pt-8 border-t border-white/10">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Tema</span>
          <ThemeToggle />
        </div>
      </div>

      <div className="mt-auto pt-8">
        <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white" onClick={onClose} asChild>
          <Link href="/contact">Solicitar Orçamento</Link>
        </Button>
      </div>
    </div>
  )
}