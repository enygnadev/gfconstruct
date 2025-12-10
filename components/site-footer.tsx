
import Link from "next/link"
import { Mail, MapPin, Phone, Heart } from "lucide-react"

import { Logo } from "@/components/logo"

export function SiteFooter() {
  return (
    <footer className="bg-slate-950 text-white py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Logo className="h-10 w-auto" />
              <span className="text-xl font-semibold tracking-wider">GF CONSTRUTORA</span>
            </div>
            <p className="text-slate-400">Construção civil completa, reformas e acabamentos com excelência. Mais de 8 anos transformando projetos em realidade em Santa Catarina.</p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-slate-400 hover:text-orange-500 transition-colors">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-400 hover:text-orange-500 transition-colors">
                  Sobre Nós
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-slate-400 hover:text-orange-500 transition-colors">
                  Serviços
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-slate-400 hover:text-orange-500 transition-colors">
                  Projetos
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-slate-400 hover:text-orange-500 transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-orange-500 transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Serviços</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/services" className="text-slate-400 hover:text-orange-500 transition-colors">
                  Construção Residencial
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-slate-400 hover:text-orange-500 transition-colors">
                  Construção Comercial
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-slate-400 hover:text-orange-500 transition-colors">
                  Reformas e Renovações
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-slate-400 hover:text-orange-500 transition-colors">
                  Acabamentos Premium
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-slate-400 hover:text-orange-500 transition-colors">
                  Estruturas e Fundações
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-orange-500" />
                <span className="text-slate-400">+55 (48) 99999-9999</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-orange-500" />
                <span className="text-slate-400">contato@gfconstrutora.com.br</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-orange-500" />
                <span className="text-slate-400">Centro, Tubarão - SC, Brasil</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6">
          <div className="text-center mb-6">
            <p className="text-slate-400 text-sm flex items-center justify-center gap-2">
              Criado com <Heart className="h-4 w-4 text-red-500 fill-current" /> por
              <span className="text-orange-400 font-semibold">Enygna</span>
              <span className="text-slate-500">•</span>
              <span className="text-blue-400 font-semibold">GF Construtora</span>
            </p>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © {new Date().getFullYear()} GF CONSTRUTORA. Todos os direitos reservados.
            </p>
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="#" className="text-slate-400 hover:text-orange-500 transition-colors text-sm">
                Política de Privacidade
              </Link>
              <Link href="#" className="text-slate-400 hover:text-orange-500 transition-colors text-sm">
                Termos de Serviço
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
