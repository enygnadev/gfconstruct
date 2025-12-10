
"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Construction, Sparkles } from 'lucide-react'
import { LoginForm } from '@/components/auth/login-form'
import { RegisterForm } from '@/components/auth/register-form'
import { Logo } from '@/components/logo'

export default function SistemaPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=400')] opacity-5 bg-repeat" />
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gold-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-lg"
          >
            <div className="flex items-center mb-8">
              <Logo />
              <span className="ml-3 text-2xl font-bold text-white tracking-wide">
                GF CONSTRUTORA
              </span>
            </div>

            <h1 className="text-4xl xl:text-5xl font-bold text-white mb-6 leading-tight">
              Sistema de Gestão
              <span className="block bg-gradient-to-r from-gold-400 to-orange-500 bg-clip-text text-transparent">
                Inteligente de Obras
              </span>
            </h1>

            <p className="text-lg text-slate-300 mb-8 leading-relaxed">
              Plataforma neural de orçamento, planejamento e gestão de obras residenciais. 
              Una IA, dados regionais, automação financeira e realidade aumentada para 
              transformar seus projetos de construção.
            </p>

            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center text-slate-300"
              >
                <Construction className="h-5 w-5 text-gold-500 mr-3" />
                <span>Orçamento Quântico-Inteligente com IA</span>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex items-center text-slate-300"
              >
                <Sparkles className="h-5 w-5 text-gold-500 mr-3" />
                <span>Cronograma Adaptativo e Realidade Aumentada</span>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center text-slate-300"
              >
                <Construction className="h-5 w-5 text-gold-500 mr-3" />
                <span>Fluxo de Caixa Automatizado</span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Right Side - Auth Forms */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full max-w-md"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
              {/* Mobile Logo */}
              <div className="lg:hidden text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <Logo />
                  <span className="ml-3 text-xl font-bold text-white tracking-wide">
                    GF CONSTRUTORA
                  </span>
                </div>
                <p className="text-slate-300 text-sm">
                  Sistema de Gestão Inteligente de Obras
                </p>
              </div>

              {/* Form Toggle */}
              <div className="flex rounded-lg bg-white/5 p-1 mb-8">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    isLogin
                      ? 'bg-gold-500 text-slate-900 shadow-md'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                    !isLogin
                      ? 'bg-gold-500 text-slate-900 shadow-md'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Registrar
                </button>
              </div>

              {/* Forms */}
              <motion.div
                key={isLogin ? 'login' : 'register'}
                initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                {isLogin ? (
                  <LoginForm onToggleForm={() => setIsLogin(false)} />
                ) : (
                  <RegisterForm onToggleForm={() => setIsLogin(true)} />
                )}
              </motion.div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-slate-400 text-sm">
                © 2024 GF Construtora. Todos os direitos reservados.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
