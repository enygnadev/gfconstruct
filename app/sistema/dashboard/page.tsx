"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  BarChart3,
  Users,
  FolderOpen,
  Calculator,
  Settings,
  LogOut,
  Bell,
  Search,
  Plus,
  TrendingUp,
  Clock,
  CheckCircle,
  Brain,
  Calendar,
  DollarSign,
  Package,
  Box,
  MessageCircle,
  Leaf,
  Zap,
  Building,
  Hammer,
  PaintBucket,
  Wrench,
  Target,
  Globe,
  Lightbulb,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth-context'
import { Logo } from '@/components/logo'
import { useProjects } from '@/lib/hooks/useProjects'
import { ProjectCard } from '@/components/projects/project-card'
import { NewProjectForm, NewProjectData } from '@/components/projects/new-project-form'
import { useNotification } from '@/components/projects/project-notification'

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const { projects, getStats, fetchProjects } = useProjects()
  const { success: showSuccess, error: showError } = useNotification()
  const [newProjectOpen, setNewProjectOpen] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/sistema')
    }
  }, [user, loading, router])

  const handleSignOut = async () => {
    await signOut()
    router.push('/sistema')
  }

  const handleNewProject = async (data: NewProjectData) => {
    try {
      if (!data.projectName?.trim()) throw new Error('Nome do projeto obrigatorio')
      if (!data.projectCode?.trim()) throw new Error('Codigo do projeto obrigatorio')
      if (data.budget <= 0) throw new Error('Orcamento deve ser maior que zero')
      if (!data.client.name?.trim()) throw new Error('Nome do cliente obrigatorio')
      if (!data.startDate || !data.plannedEndDate) throw new Error('Datas sao obrigatorias')
      if (new Date(data.startDate) >= new Date(data.plannedEndDate)) {
        throw new Error('Data de termino deve ser apos a data de inicio')
      }
      await new Promise(resolve => setTimeout(resolve, 1500))
      await fetchProjects()
      showSuccess('Projeto criado com sucesso!', data.projectName + ' foi adicionado')
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erro ao criar projeto'
      showError('Erro ao criar projeto', errorMsg)
      throw error
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 border-4 border-gold-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-slate-600 dark:text-slate-400">Carregando...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: 'Administrador',
      colaborador: 'Colaborador',
      cliente: 'Cliente',
    }
    return labels[role] || role
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      Ativo: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      Beta: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  const handleAccessResource = (title: string, category: string) => {
    console.log('Acessando:', title, category)
    if (category === 'orcamento' && title.includes('Quantico')) {
      router.push('/sistema/orcamento-quantico')
    } else if (category === 'cronograma' && title.includes('Adaptativo')) {
      router.push('/sistema/cronograma-adaptativo')
    } else if (category === 'consultoria' && title.includes('Consultora')) {
      router.push('/sistema/consultoria-ia')
    } else {
      alert('Modulo em desenvolvimento')
    }
  }

  const stats = getStats()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Logo />
              <span className="text-xl font-bold text-slate-900 dark:text-white tracking-wide">
                PLATAFORMA NEURAL
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Buscar..."
                  className="pl-10 w-64 bg-slate-100 dark:bg-slate-700 border-0"
                />
              </div>

              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                  3
                </span>
              </Button>

              <div className="flex items-center space-x-3 pl-4 border-l border-slate-200 dark:border-slate-700">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {user.displayName}
                  </p>
                  <p className="text-xs text-slate-500">
                    {getRoleLabel(user.role)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSignOut}
                  className="text-slate-500 hover:text-red-500"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Navigation Tabs */}
          <Tabs defaultValue="neural" className="w-full">
            <TabsList className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg w-full justify-start gap-0 h-auto p-1 mb-6">
              <TabsTrigger
                value="neural"
                className="data-[state=active]:bg-gold-500 data-[state=active]:text-slate-900 rounded-md px-4 sm:px-6 py-3 text-sm sm:text-base"
              >
                <Brain className="h-4 w-4 mr-2" />
                Plataforma Neural IA
              </TabsTrigger>
              <TabsTrigger
                value="projects"
                className="data-[state=active]:bg-gold-500 data-[state=active]:text-slate-900 rounded-md px-4 sm:px-6 py-3 text-sm sm:text-base"
                onClick={() => router.push('/sistema/projetos')}
              >
                <FolderOpen className="h-4 w-4 mr-2" />
                Projetos e Obras
              </TabsTrigger>
            </TabsList>

            <TabsContent value="neural">
              {/* Welcome Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8"
              >
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  Bem-vindo, {user.displayName}!
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  Sistema inteligente de orcamento, planejamento e gestao de obras residenciais com IA.
                </p>
                <div className="flex items-center space-x-4">
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                    IA Neural Ativa
                  </Badge>
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                    6 Modulos Disponiveis
                  </Badge>
                </div>
              </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Orcamentos IA</p>
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">127</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Brain className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-purple-600 dark:text-purple-400">Cronogramas</p>
                    <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">89</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-green-600 dark:text-green-400">Economia Gerada</p>
                    <p className="text-2xl font-bold text-green-900 dark:text-green-100">R$ 2.8M</p>
                  </div>
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-600 dark:text-orange-400">Sustentabilidade</p>
                    <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">156</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                    <Leaf className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Projects Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1 sm:mb-2">
                  Gestao de Projetos e Obras
                </h2>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                  Sistema completo - ObraFlow / Project Core
                </p>
              </div>
              <Button 
                size="lg" 
                className="w-full sm:w-auto bg-gold-500 hover:bg-gold-600 text-slate-900 shadow-lg hover:shadow-xl transition-all"
                onClick={() => setNewProjectOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Novo Projeto
              </Button>
            </div>

            {/* Projects Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
              {[
                { label: 'Total', value: stats.totalProjects, icon: FolderOpen, color: 'bg-blue-500' },
                { label: 'Em Execucao', value: stats.activeProjects, icon: TrendingUp, color: 'bg-amber-500' },
                { label: 'Atrasados', value: stats.delayedProjects, icon: Clock, color: 'bg-red-500' },
                { label: 'Concluidos', value: stats.completedProjects, icon: CheckCircle, color: 'bg-green-500' },
                { label: 'Equipe', value: stats.teamSize, icon: Users, color: 'bg-cyan-500' }
              ].map((stat, idx) => {
                const Icon = stat.icon
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{stat.label}</p>
                            <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
                          </div>
                          <div className={`p-3 rounded-lg ${stat.color}`}>
                            <Icon className="h-6 w-6 text-white" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>

            {/* Projects Grid */}
            <div>
              {projects.length === 0 ? (
                <Card className="p-12 text-center">
                  <FolderOpen className="h-12 w-12 text-slate-400 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    Nenhum projeto ainda
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6">
                    Crie seu primeiro projeto para comecar a gerenciar suas obras
                  </p>
                  <Button 
                    className="bg-gold-500 hover:bg-gold-600 text-slate-900"
                    onClick={() => setNewProjectOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Projeto
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projects.slice(0, 6).map((project, idx) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (idx % 6) * 0.05 }}
                    >
                      <ProjectCard
                        project={project}
                        onClick={() => router.push('/sistema/projetos/' + project.id)}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {projects.length > 6 && (
              <div className="flex justify-center mt-8">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => router.push('/sistema/projetos')}
                >
                  Ver Todos os Projetos ({projects.length})
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </motion.div>
            </TabsContent>

            <TabsContent value="projects">
              {/* Redireciona automaticamente para página de projetos */}
            </TabsContent>
          </Tabs>
        </div>

        {/* New Project Form Modal */}
        <NewProjectForm 
          isOpen={newProjectOpen}
          onClose={() => setNewProjectOpen(false)}
          onSubmit={handleNewProject}
        />
      </main>
    </div>
  )
}
