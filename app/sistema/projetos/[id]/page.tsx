"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Settings,
  MoreHorizontal,
  FileText,
  Users,
  DollarSign,
  Package,
  CheckCircle,
  AlertCircle,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Download,
  Share2,
  Edit,
  Archive,
  Bell,
  BarChart3
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { useProjects } from '@/lib/hooks/useProjects'
import { StageCard } from '@/components/projects/stage-card'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

export default function ProjectDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { getProjectById } = useProjects()
  const projectId = params.id as string

  const project = getProjectById(projectId)

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <Card className="w-full max-w-md text-center p-6">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Projeto não encontrado</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            O projeto que você procura não existe ou foi removido.
          </p>
          <Button onClick={() => router.push('/sistema/projetos')}>
            Voltar para Projetos
          </Button>
        </Card>
      </div>
    )
  }

  const avgProgress = project.stages.length > 0
    ? Math.round(project.stages.reduce((sum, s) => sum + s.progress, 0) / project.stages.length)
    : 0

  const isOverdue = !['concluido', 'suspenso'].includes(project.status) && new Date() > project.plannedEndDate
  const isOverBudget = project.budget.actualCost > project.budget.plannedBudget * 1.1

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/sistema/projetos')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Download className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Title Section */}
        <div className="space-y-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              {project.projectName}
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              {project.projectCode} • {project.type}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Progresso Geral</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{avgProgress}%</span>
                    </div>
                    <Progress value={avgProgress} />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Orçamento</p>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold">
                      R$ {(project.budget.actualCost / 1000).toFixed(1)}k
                    </p>
                    <p className={cn(
                      'text-xs',
                      isOverBudget ? 'text-red-600' : 'text-green-600'
                    )}>
                      {isOverBudget ? '❌ Acima' : '✓ Dentro'} do limite
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Prazo</p>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold">
                      {format(project.plannedEndDate, 'dd MMM', { locale: ptBR })}
                    </p>
                    <p className={cn(
                      'text-xs',
                      isOverdue ? 'text-red-600' : 'text-green-600'
                    )}>
                      {isOverdue ? '⚠️ Atrasado' : '✓ No prazo'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <p className="text-sm text-slate-500 dark:text-slate-400">Equipe</p>
                  <p className="text-2xl font-bold">{project.team.length}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">membros</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="resumo" className="space-y-6">
          <TabsList className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 rounded-none w-full justify-start">
            <TabsTrigger value="resumo">📋 Resumo</TabsTrigger>
            <TabsTrigger value="etapas">⚙️ Etapas</TabsTrigger>
            <TabsTrigger value="documentos">📄 Documentos</TabsTrigger>
            <TabsTrigger value="equipe">👥 Equipe</TabsTrigger>
            <TabsTrigger value="materiais">📦 Materiais</TabsTrigger>
            <TabsTrigger value="financeiro">💰 Financeiro</TabsTrigger>
            <TabsTrigger value="alertas">⚠️ Alertas</TabsTrigger>
          </TabsList>

          {/* Resumo Tab */}
          <TabsContent value="resumo" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Project Info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informações do Projeto</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Cliente</p>
                        <p className="text-slate-900 dark:text-white mt-1">{project.client?.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Tipo</p>
                        <p className="text-slate-900 dark:text-white mt-1 capitalize">{project.type}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Início</p>
                        <p className="text-slate-900 dark:text-white mt-1">
                          {format(project.startDate, 'dd MMM yyyy', { locale: ptBR })}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Conclusão Prevista</p>
                        <p className={cn(
                          'mt-1',
                          isOverdue ? 'text-red-600 font-medium' : 'text-slate-900 dark:text-white'
                        )}>
                          {format(project.plannedEndDate, 'dd MMM yyyy', { locale: ptBR })}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Descrição</p>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    {project.location && (
                      <>
                        <Separator />
                        <div>
                          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            Localização
                          </p>
                          <p className="text-slate-700 dark:text-slate-300">
                            {project.location.address}
                          </p>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                            {project.location.city}, {project.location.state}
                          </p>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Próximas Etapas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {project.stages.slice(0, 3).map((stage, idx) => (
                        <div key={stage.id} className="pb-4 last:pb-0 last:border-b-0 border-b border-slate-200 dark:border-slate-700">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-medium text-slate-900 dark:text-white">{stage.name}</p>
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                {format(stage.startDate, 'dd MMM', { locale: ptBR })} - {format(stage.dueDate, 'dd MMM', { locale: ptBR })}
                              </p>
                            </div>
                            <Badge variant="outline">{stage.progress}%</Badge>
                          </div>
                          <Progress value={stage.progress} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Responsible */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Responsável</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Dono do Projeto</p>
                      <p className="font-medium text-slate-900 dark:text-white">{project.owner.name}</p>
                      <a href={`mailto:${project.owner.email}`} className="text-sm text-gold-500 hover:underline">
                        {project.owner.email}
                      </a>
                    </div>

                    {project.supervisor && (
                      <>
                        <Separator />
                        <div>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Supervisor</p>
                          <p className="font-medium text-slate-900 dark:text-white">{project.supervisor.name}</p>
                          <a href={`mailto:${project.supervisor.email}`} className="text-sm text-gold-500 hover:underline">
                            {project.supervisor.email}
                          </a>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Alerts */}
                {project.alerts.length > 0 && !project.alerts.every(a => a.resolved) && (
                  <Card className="border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10">
                    <CardHeader>
                      <CardTitle className="text-base text-red-700 dark:text-red-400 flex items-center gap-2">
                        <Bell className="h-4 w-4" />
                        Alertas
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {project.alerts.filter(a => !a.resolved).map(alert => (
                          <div key={alert.id} className="text-sm space-y-1">
                            <p className="font-medium text-slate-900 dark:text-white">{alert.title}</p>
                            <p className="text-slate-600 dark:text-slate-400">{alert.message}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Etapas Tab */}
          <TabsContent value="etapas" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Etapas do Projeto ({project.stages.length})</h3>
              <Button size="sm">
                + Nova Etapa
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.stages.map(stage => (
                <StageCard key={stage.id} stage={stage} projectId={project.id} />
              ))}
            </div>
          </TabsContent>

          {/* Documentos Tab */}
          <TabsContent value="documentos" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Documentos ({project.documents.length})</h3>
              <Button size="sm">
                + Adicionar Documento
              </Button>
            </div>
            <div className="grid gap-3">
              {project.documents.map(doc => (
                <Card key={doc.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="h-6 w-6 text-blue-500" />
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{doc.name}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {doc.type} • {format(doc.uploadDate, 'dd MMM yyyy', { locale: ptBR })}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Equipe Tab */}
          <TabsContent value="equipe" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Equipe ({project.team.length})</h3>
              <Button size="sm">
                + Adicionar Membro
              </Button>
            </div>
            <div className="grid gap-3">
              {project.team.map(member => (
                <Card key={member.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{member.name}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 capitalize">{member.role}</p>
                        <a href={`mailto:${member.email}`} className="text-sm text-gold-500 hover:underline">
                          {member.email}
                        </a>
                      </div>
                      <Badge variant={member.isActive ? 'default' : 'outline'}>
                        {member.isActive ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Materiais Tab */}
          <TabsContent value="materiais" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Materiais ({project.materials.length})</h3>
              <Button size="sm">
                + Adicionar Material
              </Button>
            </div>
            <div className="space-y-3">
              {project.materials.map(material => (
                <Card key={material.id}>
                  <CardContent className="pt-6">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{material.name}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {material.supplier || 'Sem fornecedor'}
                          </p>
                        </div>
                        <Badge variant="outline">{material.status}</Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <p className="text-slate-500 dark:text-slate-400">Necessário</p>
                          <p className="font-medium">{material.quantity} {material.unit}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 dark:text-slate-400">Usado</p>
                          <p className="font-medium">{material.quantityUsed} {material.unit}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 dark:text-slate-400">Preço Unit.</p>
                          <p className="font-medium">R$ {material.unitPrice.toFixed(2)}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Financeiro Tab */}
          <TabsContent value="financeiro" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Orçamento Previsto</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    R$ {project.budget.plannedBudget.toLocaleString('pt-BR')}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Gasto Atual</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={cn(
                    'text-3xl font-bold',
                    isOverBudget ? 'text-red-600' : 'text-green-600'
                  )}>
                    R$ {project.budget.actualCost.toLocaleString('pt-BR')}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    {((project.budget.actualCost / project.budget.plannedBudget) * 100).toFixed(1)}% utilizado
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Mão de Obra</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    R$ {project.budget.laborCost.toLocaleString('pt-BR')}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Materiais</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    R$ {project.budget.materialsCost.toLocaleString('pt-BR')}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Alertas Tab */}
          <TabsContent value="alertas" className="space-y-4">
            <h3 className="text-lg font-semibold mb-4">Alertas e Notificações</h3>
            {project.alerts.length === 0 ? (
              <Card className="p-12 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4 opacity-50" />
                <p className="text-slate-600 dark:text-slate-400">Nenhum alerta no momento</p>
              </Card>
            ) : (
              <div className="space-y-3">
                {project.alerts.map(alert => (
                  <Card key={alert.id} className={cn(
                    alert.resolved ? 'opacity-60' : '',
                    alert.type === 'erro' ? 'border-red-200 dark:border-red-900' : ''
                  )}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <AlertCircle className={cn(
                              'h-4 w-4',
                              alert.type === 'erro' ? 'text-red-600' : 'text-yellow-600'
                            )} />
                            <p className="font-medium text-slate-900 dark:text-white">{alert.title}</p>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{alert.message}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {format(alert.createdAt, 'dd MMM yyyy HH:mm', { locale: ptBR })}
                          </p>
                        </div>
                        {!alert.resolved && (
                          <Button size="sm" variant="outline">
                            Resolver
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
