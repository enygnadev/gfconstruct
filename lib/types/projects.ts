// Tipos para o Sistema de Gestão de Projetos/Obras

export type ProjectType = 'obra-civil' | 'instalacao' | 'manutencao' | 'projeto-digital' | 'reforma' | 'consultoría'
export type ProjectStatus = 'planejamento' | 'analise' | 'orcacao' | 'execucao' | 'inspecao' | 'ajustes' | 'finalizacao' | 'concluido' | 'suspenso'
export type Priority = 'baixa' | 'media' | 'alta' | 'critica'
export type StageStatus = 'pendente' | 'em-progresso' | 'concluida' | 'cancelada' | 'bloqueada'
export type DocumentType = 'contrato' | 'art-rrt' | 'licencamento' | 'nf' | 'checklist' | 'relatorio' | 'planta' | 'foto' | 'video' | 'laudo' | 'outro'
export type UserRole = 'dono' | 'supervisor' | 'engenheiro' | 'tecnico' | 'cliente' | 'terceirizado'
export type AlertType = 'aviso' | 'erro' | 'sucesso' | 'informacao'

export interface ProjectMember {
  id: string
  name: string
  email: string
  role: UserRole
  phone?: string
  permissions?: string[]
  joinDate: Date
  avatar?: string
  isActive: boolean
}

export interface StageChecklist {
  id: string
  title: string
  description?: string
  completed: boolean
  completedAt?: Date
  completedBy?: string
  evidence?: {
    photos: string[]
    videos: string[]
    documents: string[]
  }
  order: number
}

export interface Stage {
  id: string
  name: string
  description?: string
  status: StageStatus
  startDate: Date
  dueDate: Date
  completedDate?: Date
  responsible?: ProjectMember
  progress: number // 0-100
  checklists: StageChecklist[]
  budget: number
  actualCost: number
  attachments?: string[]
  notes?: string
  order: number
}

export interface ProjectMaterial {
  id: string
  name: string
  quantity: number
  unit: string
  quantityUsed?: number
  currentStock?: number
  unitPrice: number
  totalPrice: number
  supplier?: string
  deliveryDate?: Date
  status: 'pendente' | 'entregue' | 'parcial' | 'cancelada'
  specifications?: string
  qrCode?: string
}

export interface Document {
  id: string
  name: string
  type: DocumentType
  url: string
  uploadDate: Date
  uploadedBy: string
  size?: number
  mimeType?: string
  expirationDate?: Date
  isExpired?: boolean
  description?: string
  tags?: string[]
}

export interface Budget {
  id: string
  plannedBudget: number
  actualCost: number
  laborCost: number
  materialsCost: number
  otherCost: number
  contingency: number // percentual de segurança
  currency: string
  breakdown?: {
    category: string
    percentage: number
    value: number
  }[]
  lastUpdated: Date
}

export interface ProjectAlert {
  id: string
  type: AlertType
  title: string
  message: string
  relatedStage?: string
  relatedDocument?: string
  createdAt: Date
  resolved: boolean
  resolvedAt?: Date
  resolvedBy?: string
  priority: Priority
}

export interface ProjectTask {
  id: string
  title: string
  description?: string
  dueDate: Date
  assignedTo: ProjectMember
  status: 'pendente' | 'em-progresso' | 'concluida' | 'cancelada'
  priority: Priority
  stage?: string
  attachments?: string[]
  completedAt?: Date
  createdAt: Date
  createdBy: string
}

export interface Project {
  // Dados Gerais
  id: string
  projectName: string
  projectCode: string
  type: ProjectType
  status: ProjectStatus
  client?: {
    name: string
    email?: string
    phone?: string
    address?: string
  }
  location?: {
    address: string
    latitude?: number
    longitude?: number
    city: string
    state: string
  }
  
  // Responsáveis
  owner: ProjectMember
  supervisor?: ProjectMember
  technicalManager?: ProjectMember
  
  // Datas
  startDate: Date
  plannedEndDate: Date
  actualEndDate?: Date
  createdAt: Date
  updatedAt: Date
  
  // Dados Técnicos
  description: string
  objective: string
  scope?: string
  methodology?: string // PMI, Scrum, Engenharia, etc.
  technicalRequirements?: string
  applicableNorms?: string[]
  legalData?: {
    hasART: boolean
    artNumber?: string
    licenses?: Document[]
  }
  
  // Organização
  priority: Priority
  stages: Stage[]
  materials: ProjectMaterial[]
  documents: Document[]
  team: ProjectMember[]
  tasks: ProjectTask[]
  alerts: ProjectAlert[]
  
  // Financeiro
  budget: Budget
  
  // Metadados
  tags?: string[]
  notes?: string
  isArchived: boolean
  archivedAt?: Date
  archivedBy?: string
  
  // IA Insights
  aiInsights?: {
    estimatedCompletion?: Date
    riskLevel?: 'baixo' | 'medio' | 'alto' | 'critico'
    delayProbability?: number // percentual
    costOverrunRisk?: number // percentual
    recommendations?: string[]
    lastAnalysis?: Date
  }
}

export interface ProjectFilters {
  status?: ProjectStatus[]
  type?: ProjectType[]
  priority?: Priority[]
  owner?: string
  supervisor?: string
  dateRange?: {
    startDate: Date
    endDate: Date
  }
  searchText?: string
  includeArchived?: boolean
}

export interface ProjectStats {
  totalProjects: number
  activeProjects: number
  completedProjects: number
  delayedProjects: number
  overBudgetProjects: number
  totalBudget: number
  totalSpent: number
  averageProgress: number
  teamSize: number
}

export interface DashboardMetrics {
  projectsInProgress: number
  projectsDelayed: number
  projectsCompleted: number
  overallBudgetUtilization: number
  teamProductivity: number
  documentsPending: number
  pendingTasks: number
  criticalAlerts: number
}
