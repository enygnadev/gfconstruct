
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { Logo } from "@/components/logo"
import { Drawer, DrawerContent, DrawerTrigger, DrawerTitle, DrawerDescription } from "@/components/ui/drawer"
import { MobileNav } from "@/components/mobile-nav"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

export function SiteHeader() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { href: "/", label: "Início" },
    { href: "/about", label: "Sobre" },
    { href: "/services", label: "Serviços" },
    { href: "/projects", label: "Projetos" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contato" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [scrolled])

  return (
    <header
      className={cn(
        "sticky top-0 w-full z-50 transition-all duration-300 backdrop-blur-md bg-white/5 dark:bg-slate-900/5 border-b border-white/10",
        scrolled && "bg-white/70 dark:bg-slate-900/70 shadow-sm",
      )}
    >
      <div className="container mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <Logo />
          <span className="text-xl font-semibold tracking-wider">GF CONSTRUTORA</span>
        </Link>

        <nav className="hidden lg:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-orange-500",
                pathname === item.href ? "text-orange-500" : "text-slate-300",
              )}
            >
              {item.label}
            </Link>
          ))}
          <Button
            asChild
            variant="outline"
            className="border-blue-500 text-blue-500 hover:bg-blue-500/10 bg-transparent"
          >
            <Link href="/sistema">Sistema</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-orange-500 text-orange-500 hover:bg-orange-500/10 bg-transparent"
          >
            <Link href="/contact">Solicitar Orçamento</Link>
          </Button>
        </nav>

        <div className="flex items-center space-x-4">
          <div className="hidden md:flex">
            <ThemeToggle />
          </div>

          <Drawer open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Alternar menu</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[90vh] glass">
              <DrawerTitle className="sr-only">Menu de Navegação</DrawerTitle>
              <DrawerDescription className="sr-only">
                Menu principal do site com links para todas as seções
              </DrawerDescription>
              <MobileNav navItems={navItems} currentPath={pathname} onClose={() => setIsMenuOpen(false)} />
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  )
}
