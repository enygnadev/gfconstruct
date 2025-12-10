import React from 'react'
import { Stage, StageStatus } from '@/lib/types/projects'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  MoreHorizontal,
  Users,
  FileText,
  Calendar
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

const stageStatusConfig: Record<StageStatus, { label: string; color: string; icon: React.ReactNode }> = {
  'pendente': {
    label: 'Pendente',
    color: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
    icon: <Clock className="h-4 w-4" />
  },
  'em-progresso': {
    label: 'Em Progresso',
    color: 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400',
    icon: <Clock className="h-4 w-4 animate-spin" />
  },
  'concluida': {
    label: 'Concluída',
    color: 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400',
    icon: <CheckCircle2 className="h-4 w-4" />
  },
  'cancelada': {
    label: 'Cancelada',
    color: 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400',
    icon: <AlertCircle className="h-4 w-4" />
  },
  'bloqueada': {
    label: 'Bloqueada',
    color: 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400',
    icon: <AlertCircle className="h-4 w-4" />
  }
}

interface StageCardProps {
  stage: Stage
  projectId: string
  onClick?: () => void
}

export function StageCard({ stage, projectId, onClick }: StageCardProps) {
  const config = stageStatusConfig[stage.status]
  const isOverdue = stage.status !== 'concluida' && new Date() > stage.dueDate
  const completedChecklists = stage.checklists.filter(c => c.completed).length

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="text-base">{stage.name}</CardTitle>
            {stage.description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                {stage.description}
              </p>
            )}
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>

        <Badge className={cn('w-fit text-xs mt-2', config.color)}>
          <span className="mr-1">{config.icon}</span>
          {config.label}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Progresso</span>
            <span className="text-slate-600 dark:text-slate-400">{stage.progress}%</span>
          </div>
          <Progress value={stage.progress} className="h-2" />
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <p className="text-slate-500 dark:text-slate-400 font-medium">Início</p>
            <p className="text-slate-700 dark:text-slate-300">
              {format(stage.startDate, 'dd MMM', { locale: ptBR })}
            </p>
          </div>
          <div className="space-y-1">
            <p className={cn(
              'font-medium',
              isOverdue ? 'text-red-600' : 'text-slate-500 dark:text-slate-400'
            )}>
              Conclusão
            </p>
            <p className={cn(
              isOverdue ? 'text-red-600 font-medium' : 'text-slate-700 dark:text-slate-300'
            )}>
              {format(stage.dueDate, 'dd MMM', { locale: ptBR })}
            </p>
          </div>
        </div>

        {/* Checklists */}
        <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
          <FileText className="h-3 w-3" />
          <span>{completedChecklists}/{stage.checklists.length} checklists</span>
        </div>

        {/* Budget */}
        <div className="flex items-center justify-between text-xs">
          <div className="space-y-1">
            <p className="text-slate-500 dark:text-slate-400">Orçamento</p>
            <p className="font-medium">R$ {stage.budget.toLocaleString('pt-BR')}</p>
          </div>
          <div className="space-y-1">
            <p className="text-slate-500 dark:text-slate-400">Gasto</p>
            <p className={cn(
              'font-medium',
              stage.actualCost > stage.budget ? 'text-red-600' : 'text-green-600'
            )}>
              R$ {stage.actualCost.toLocaleString('pt-BR')}
            </p>
          </div>
        </div>

        {/* Responsible */}
        {stage.responsible && (
          <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700">
            <Users className="h-3 w-3" />
            <span>{stage.responsible.name}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
