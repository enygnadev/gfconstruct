import { Project, ProjectStatus, Priority } from '@/lib/types/projects'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import {
  MoreHorizontal,
  MapPin,
  Calendar,
  Users,
  AlertCircle,
  ChevronRight,
  DollarSign,
  Clock
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const statusConfig: Record<ProjectStatus, { label: string; color: string; bgColor: string }> = {
  'planejamento': { label: 'Planejamento', color: 'text-blue-600', bgColor: 'bg-blue-100 dark:bg-blue-900/20' },
  'analise': { label: 'Análise', color: 'text-purple-600', bgColor: 'bg-purple-100 dark:bg-purple-900/20' },
  'orcacao': { label: 'Orçação', color: 'text-orange-600', bgColor: 'bg-orange-100 dark:bg-orange-900/20' },
  'execucao': { label: 'Execução', color: 'text-amber-600', bgColor: 'bg-amber-100 dark:bg-amber-900/20' },
  'inspecao': { label: 'Inspeção', color: 'text-green-600', bgColor: 'bg-green-100 dark:bg-green-900/20' },
  'ajustes': { label: 'Ajustes', color: 'text-cyan-600', bgColor: 'bg-cyan-100 dark:bg-cyan-900/20' },
  'finalizacao': { label: 'Finalização', color: 'text-emerald-600', bgColor: 'bg-emerald-100 dark:bg-emerald-900/20' },
  'concluido': { label: 'Concluído', color: 'text-green-700', bgColor: 'bg-green-100 dark:bg-green-900/20' },
  'suspenso': { label: 'Suspenso', color: 'text-red-600', bgColor: 'bg-red-100 dark:bg-red-900/20' }
}

const priorityConfig: Record<Priority, { label: string; color: string; icon: string }> = {
  'baixa': { label: 'Baixa', color: 'bg-gray-500', icon: '◆' },
  'media': { label: 'Média', color: 'bg-yellow-500', icon: '◆' },
  'alta': { label: 'Alta', color: 'bg-orange-500', icon: '◆' },
  'critica': { label: 'Crítica', color: 'bg-red-500', icon: '◆' }
}

interface ProjectCardProps {
  project: Project
  onClick?: () => void
  onEdit?: () => void
  onDelete?: () => void
  showMenu?: boolean
}

export function ProjectCard({
  project,
  onClick,
  onEdit,
  onDelete,
  showMenu = true
}: ProjectCardProps) {
  const avgProgress = project.stages.length > 0
    ? Math.round(project.stages.reduce((sum, s) => sum + s.progress, 0) / project.stages.length)
    : 0

  const isOverdue = !['concluido', 'suspenso'].includes(project.status) && new Date() > project.plannedEndDate
  const isOverBudget = project.budget.actualCost > project.budget.plannedBudget * 1.1

  const status = statusConfig[project.status]
  const priority = priorityConfig[project.priority]

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full group" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-lg group-hover:text-gold-500 transition-colors">
              {project.projectName}
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {project.projectCode}
            </p>
          </div>
          {showMenu && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline" className={cn('text-xs', status.color, status.bgColor)}>
            {status.label}
          </Badge>
          <Badge
            variant="outline"
            className="text-xs"
            style={{ backgroundColor: priority.color + '20', color: priority.color }}
          >
            {priority.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Client Info */}
        <div className="space-y-2 text-sm">
          {project.client && (
            <>
              <p className="text-slate-600 dark:text-slate-400">
                <span className="font-medium">Cliente:</span> {project.client.name}
              </p>
            </>
          )}
          {project.location && (
            <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{project.location.city}, {project.location.state}</span>
            </div>
          )}
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Progresso</span>
            <span className="text-slate-600 dark:text-slate-400">{avgProgress}%</span>
          </div>
          <Progress value={avgProgress} className="h-2" />
        </div>

        {/* Dates & Alerts */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
            <Calendar className="h-3 w-3" />
            <span>{format(project.startDate, 'MMM yyyy', { locale: ptBR })}</span>
          </div>
          <div className={cn(
            'flex items-center gap-1',
            isOverdue ? 'text-red-600 font-medium' : 'text-slate-600 dark:text-slate-400'
          )}>
            <Clock className="h-3 w-3" />
            <span>{format(project.plannedEndDate, 'MMM yyyy', { locale: ptBR })}</span>
          </div>
        </div>

        {/* Budget & Alerts */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
            <DollarSign className="h-3 w-3" />
            <span>
              R$ {(project.budget.actualCost / 1000).toFixed(1)}k / {(project.budget.plannedBudget / 1000).toFixed(1)}k
            </span>
          </div>
          {isOverBudget && (
            <div className="flex items-center gap-1 text-red-600 font-medium">
              <AlertCircle className="h-3 w-3" />
              <span>Acima do orçamento</span>
            </div>
          )}
        </div>

        {/* Team */}
        <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
          <Users className="h-3 w-3" />
          <span>{project.team.length} {project.team.length === 1 ? 'membro' : 'membros'}</span>
        </div>

        {/* Alerts */}
        {project.alerts.length > 0 && !project.alerts.every(a => a.resolved) && (
          <div className="flex items-center gap-1 p-2 bg-red-50 dark:bg-red-900/20 rounded text-xs text-red-700 dark:text-red-400">
            <AlertCircle className="h-3 w-3" />
            <span>{project.alerts.filter(a => !a.resolved).length} alerta(s)</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
