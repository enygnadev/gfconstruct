import { Project, ProjectStats } from '@/lib/types/projects'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Zap,
  Users,
  Target,
  Calendar
} from 'lucide-react'

interface ProjectsOverviewProps {
  stats: ProjectStats
  projects: Project[]
}

export function ProjectsOverview({ stats, projects }: ProjectsOverviewProps) {
  const costUtilization = stats.totalBudget > 0 
    ? Math.round((stats.totalSpent / stats.totalBudget) * 100)
    : 0

  const delayPercentage = stats.totalProjects > 0
    ? Math.round((stats.delayedProjects / stats.totalProjects) * 100)
    : 0

  const overBudgetPercentage = stats.totalProjects > 0
    ? Math.round((stats.overBudgetProjects / stats.totalProjects) * 100)
    : 0

  const completionRate = stats.totalProjects > 0
    ? Math.round((stats.completedProjects / stats.totalProjects) * 100)
    : 0

  return (
    <div className="space-y-4">
      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Overall Progress */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-500" />
              Progresso Geral
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium">{stats.averageProgress}%</span>
                <span className="text-slate-500">do total</span>
              </div>
              <Progress value={stats.averageProgress} className="h-2" />
            </div>
            <p className="text-xs text-slate-500">
              {stats.completedProjects} de {stats.totalProjects} completos
            </p>
          </CardContent>
        </Card>

        {/* Budget Utilization */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-500" />
              Orçamento
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium">{costUtilization}%</span>
                <span className="text-slate-500">utilizado</span>
              </div>
              <Progress value={costUtilization} className="h-2" />
            </div>
            <p className="text-xs text-slate-500">
              R$ {(stats.totalSpent / 1000000).toFixed(2)}M de R$ {(stats.totalBudget / 1000000).toFixed(2)}M
            </p>
          </CardContent>
        </Card>

        {/* Health Score */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              Saúde dos Projetos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-lg">
                {Math.round(100 - (delayPercentage * 0.5 + overBudgetPercentage * 0.3))}%
              </span>
              <Badge variant="outline" className="text-green-600 bg-green-50 dark:bg-green-900/20">
                Saudável
              </Badge>
            </div>
            <p className="text-xs text-slate-500">
              {stats.delayedProjects} atrasados, {stats.overBudgetProjects} acima do orçamento
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Risk Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Delays */}
        <Card className={delayPercentage > 20 ? 'border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10' : ''}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangle className={`h-4 w-4 ${delayPercentage > 20 ? 'text-red-600' : 'text-amber-500'}`} />
              Atrasos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className={`text-2xl font-bold ${delayPercentage > 20 ? 'text-red-600' : 'text-amber-600'}`}>
                  {stats.delayedProjects}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {delayPercentage}% dos projetos
                </p>
              </div>
              <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Over Budget */}
        <Card className={overBudgetPercentage > 15 ? 'border-orange-200 dark:border-orange-900/30 bg-orange-50 dark:bg-orange-900/10' : ''}>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className={`h-4 w-4 ${overBudgetPercentage > 15 ? 'text-orange-600' : 'text-orange-500'}`} />
              Acima do Orçamento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div>
                <p className={`text-2xl font-bold ${overBudgetPercentage > 15 ? 'text-orange-600' : 'text-orange-600'}`}>
                  {stats.overBudgetProjects}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {overBudgetPercentage}% dos projetos
                </p>
              </div>
              <div className="w-12 h-12 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Team Info */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4 text-blue-500" />
            Equipes em Projetos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">
                {stats.teamSize}
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Profissionais engajados
              </p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <p className="font-medium">Média: {stats.totalProjects > 0 ? Math.round(stats.teamSize / stats.totalProjects) : 0}</p>
              <p>por projeto</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
