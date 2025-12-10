"use client"

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Plus,
  Folder,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  Users,
  Filter,
  Grid,
  List,
  Download,
  Share2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useProjects } from '@/lib/hooks/useProjects'
import { ProjectFilters } from '@/lib/types/projects'
import { ProjectCard } from '@/components/projects/project-card'
import { ProjectFiltersPanel } from '@/components/projects/projects-filters'
import { NewProjectForm, NewProjectData } from '@/components/projects/new-project-form'
import { FloatingProjectButton } from '@/components/projects/floating-project-button'
import { ProjectNotification, useNotification } from '@/components/projects/project-notification'
import { cn } from '@/lib/utils'

export default function ProjectsPage() {
  const { projects, loading, getStats, fetchProjects } = useProjects()
  const { notifications, success: showSuccess, error: showError } = useNotification()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [currentFilters, setCurrentFilters] = useState<ProjectFilters>({})
  const [newProjectOpen, setNewProjectOpen] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const stats = getStats()

  const handleFiltersChange = (filters: ProjectFilters) => {
    setCurrentFilters(filters)
    fetchProjects(filters)
  }

  const handleNewProject = async (data: NewProjectData) => {
    try {
      // Validações adicionais
      if (!data.projectName?.trim()) {
        throw new Error('Nome do projeto é obrigatório')
      }
      if (!data.projectCode?.trim()) {
        throw new Error('Código do projeto é obrigatório')
      }
      if (data.budget <= 0) {
        throw new Error('Orçamento deve ser maior que zero')
      }
      if (!data.client.name?.trim()) {
        throw new Error('Nome do cliente é obrigatório')
      }
      if (!data.startDate || !data.plannedEndDate) {
        throw new Error('Datas de início e término são obrigatórias')
      }
      if (new Date(data.startDate) >= new Date(data.plannedEndDate)) {
        throw new Error('Data de término deve ser após a data de início')
      }

      console.log('Novo projeto criado:', data)
      
      // Simular criação de projeto com Firebase
      // Em produção: await createProjectInFirebase(data)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Recarregar projetos
      await fetchProjects()
      
      // Mostrar notificação de sucesso
      showSuccess(
        '✓ Projeto criado com sucesso!',
        `${data.projectName} foi adicionado ao sistema`
      )
      
      console.log(`✓ Projeto '${data.projectName}' criado com sucesso!`)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erro ao criar projeto'
      console.error('Erro ao criar projeto:', error)
      showError('Erro ao criar projeto', errorMsg)
      throw error
    }
  }

  const statCards = [
    {
      title: 'Total de Projetos',
      value: stats.totalProjects,
      icon: Folder,
      color: 'bg-blue-500',
      change: '+2 este mês'
    },
    {
      title: 'Em Execução',
      value: stats.activeProjects,
      icon: TrendingUp,
      color: 'bg-amber-500',
      change: `${Math.round((stats.activeProjects / stats.totalProjects) * 100)}%`
    },
    {
      title: 'Projetos Atrasados',
      value: stats.delayedProjects,
      icon: AlertCircle,
      color: 'bg-red-500',
      change: `${stats.delayedProjects} em risco`
    },
    {
      title: 'Concluídos',
      value: stats.completedProjects,
      icon: CheckCircle,
      color: 'bg-green-500',
      change: '95% de sucesso'
    },
    {
      title: 'Orçamento Total',
      value: `R$ ${(stats.totalBudget / 1000000).toFixed(1)}M`,
      icon: DollarSign,
      color: 'bg-purple-500',
      change: `Gasto: ${((stats.totalSpent / stats.totalBudget) * 100).toFixed(1)}%`
    },
    {
      title: 'Equipe',
      value: stats.teamSize,
      icon: Users,
      color: 'bg-cyan-500',
      change: 'profissionais'
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Notifications Container */}
        {notifications.length > 0 && (
          <div className="fixed top-6 right-6 z-50 space-y-2 max-w-md">
            {notifications.map(notif => (
              <ProjectNotification
                key={notif.id}
                type={notif.type}
                title={notif.title}
                message={notif.message}
                duration={notif.duration}
                onClose={notif.onClose}
                action={notif.action}
              />
            ))}
          </div>
        )}
        {/* Header */}
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Gestão de Projetos e Obras
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Sistema completo de gerenciamento com IA inteligente
            </p>
          </div>
          <Button 
            size="lg" 
            className="bg-gold-500 hover:bg-gold-600 text-slate-900"
            onClick={() => setNewProjectOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Projeto
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        {stat.title}
                      </CardTitle>
                      <div className={cn('p-2 rounded-lg', stat.color)}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">
                        {stat.value}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {stat.change}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Filters & View Controls */}
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Button
                variant={filtersOpen ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFiltersOpen(!filtersOpen)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
              <Badge variant="outline">
                {projects.length} projetos
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>

          {/* Filters Panel */}
          {filtersOpen && (
            <Card className="p-6 bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700">
              <ProjectFiltersPanel
                onFiltersChange={handleFiltersChange}
                isOpen={true}
              />
            </Card>
          )}
        </div>

        {/* Projects Grid/List */}
        <div>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="w-12 h-12 border-4 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">Carregando projetos...</p>
              </div>
            </div>
          ) : projects.length === 0 ? (
            <Card className="p-12 text-center">
              <Folder className="h-12 w-12 text-slate-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                Nenhum projeto encontrado
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Crie seu primeiro projeto para começar
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
            <div className={cn(
              'gap-4',
              viewMode === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                : 'space-y-4'
            )}>
              {projects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (idx % 12) * 0.05 }}
                >
                  <ProjectCard
                    project={project}
                    onClick={() => {
                      // Navegar para detalhes do projeto
                      console.log('Abrir projeto:', project.id)
                    }}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* New Project Form Modal */}
        <NewProjectForm 
          isOpen={newProjectOpen}
          onClose={() => setNewProjectOpen(false)}
          onSubmit={handleNewProject}
        />

        {/* Floating Action Button */}
        <FloatingProjectButton onClick={() => setNewProjectOpen(true)} />
      </div>
    </div>
  )
}
