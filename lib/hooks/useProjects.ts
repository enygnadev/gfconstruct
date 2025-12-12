import { useState, useCallback, useEffect } from 'react'
import { 
  Project, 
  ProjectFilters, 
  ProjectStats,
  Stage,
  ProjectMember,
  Document,
  ProjectTask,
  ProjectAlert
} from '@/lib/types/projects'
import {
  getProjectsFromFirestore,
  createProjectInFirestore,
  getProjectByIdFromFirestore,
  updateProjectInFirestore,
  deleteProjectInFirestore,
  archiveProjectInFirestore
} from '@/lib/backend/projects'

// Empty default; we will fetch data from Firestore in production
const mockProjects: Project[] = [
  {
    id: 'proj-001',
    projectName: 'Casa Residencial João Silva',
    projectCode: 'PROJ-001',
    type: 'obra-civil',
    status: 'execucao',
    client: {
      name: 'João Silva',
      email: 'joao@email.com',
      phone: '(11) 99999-9999',
      address: 'Rua das Flores, 123'
    },
    location: {
      address: 'Vila São Paulo - SP',
      city: 'São Paulo',
      state: 'SP',
      latitude: -23.5505,
      longitude: -46.6333
    },
    owner: {
      id: 'user-1',
      name: 'Carlos Contractor',
      email: 'carlos@email.com',
      role: 'dono',
      phone: '(11) 98888-8888',
      isActive: true,
      joinDate: new Date('2024-01-01')
    },
    startDate: new Date('2024-01-15'),
    plannedEndDate: new Date('2024-06-30'),
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-12-03'),
    description: 'Construção de casa residencial com 3 quartos, sala, cozinha e área de serviço',
    objective: 'Construir moradia residencial de qualidade',
    scope: 'Fundação, estrutura, alvenaria, cobertura, acabamento',
    methodology: 'Tradicional',
    technicalRequirements: 'Conforme NBR 15575',
    priority: 'alta',
    stages: [
      {
        id: 'stage-1',
        name: 'Planejamento',
        status: 'concluida',
        startDate: new Date('2024-01-15'),
        dueDate: new Date('2024-01-25'),
        completedDate: new Date('2024-01-25'),
        progress: 100,
        checklists: [
          { id: '1', title: 'Aprovação do projeto', completed: true, order: 1 },
          { id: '2', title: 'Levantamento topográfico', completed: true, order: 2 }
        ],
        budget: 5000,
        actualCost: 4800,
        order: 1
      },
      {
        id: 'stage-2',
        name: 'Análise Técnica',
        status: 'concluida',
        startDate: new Date('2024-01-26'),
        dueDate: new Date('2024-02-10'),
        completedDate: new Date('2024-02-08'),
        progress: 100,
        checklists: [
          { id: '3', title: 'Análise de solo', completed: true, order: 1 },
          { id: '4', title: 'Projeto estrutural', completed: true, order: 2 }
        ],
        budget: 8000,
        actualCost: 7950,
        order: 2
      },
      {
        id: 'stage-3',
        name: 'Cotação',
        status: 'concluida',
        startDate: new Date('2024-02-11'),
        dueDate: new Date('2024-03-01'),
        completedDate: new Date('2024-02-28'),
        progress: 100,
        checklists: [
          { id: '5', title: 'Cotação materiais', completed: true, order: 1 },
          { id: '6', title: 'Negociação com fornecedores', completed: true, order: 2 }
        ],
        budget: 3000,
        actualCost: 2900,
        order: 3
      },
      {
        id: 'stage-4',
        name: 'Execução',
        status: 'em-progresso',
        startDate: new Date('2024-03-02'),
        dueDate: new Date('2024-05-31'),
        progress: 65,
        checklists: [
          { id: '7', title: 'Fundação', completed: true, order: 1 },
          { id: '8', title: 'Estrutura', completed: true, order: 2 },
          { id: '9', title: 'Alvenaria', completed: true, order: 3 },
          { id: '10', title: 'Cobertura', completed: false, order: 4 },
          { id: '11', title: 'Acabamento', completed: false, order: 5 }
        ],
        budget: 150000,
        actualCost: 95000,
        order: 4
      }
    ],
    materials: [
      {
        id: 'mat-1',
        name: 'Cimento Portland CP-32',
        quantity: 250,
        unit: 'sacos',
        quantityUsed: 180,
        currentStock: 70,
        unitPrice: 35.00,
        totalPrice: 8750,
        supplier: 'Fornecedor A',
        deliveryDate: new Date('2024-03-05'),
        status: 'entregue'
      },
      {
        id: 'mat-2',
        name: 'Tijolos Cerâmicos 6 furos',
        quantity: 5000,
        unit: 'unidades',
        quantityUsed: 4200,
        currentStock: 800,
        unitPrice: 0.80,
        totalPrice: 4000,
        supplier: 'Fornecedor B',
        deliveryDate: new Date('2024-03-10'),
        status: 'entregue'
      }
    ],
    documents: [
      {
        id: 'doc-1',
        name: 'Contrato de Execução',
        type: 'contrato',
        url: '/docs/contrato.pdf',
        uploadDate: new Date('2024-01-10'),
        uploadedBy: 'admin'
      },
      {
        id: 'doc-2',
        name: 'ART - Anotação de Responsabilidade Técnica',
        type: 'art-rrt',
        url: '/docs/art.pdf',
        uploadDate: new Date('2024-01-15'),
        uploadedBy: 'admin'
      }
    ],
    team: [
      {
        id: 'user-1',
        name: 'Carlos Contractor',
        email: 'carlos@email.com',
        role: 'dono',
        isActive: true,
        joinDate: new Date('2024-01-01')
      },
      {
        id: 'user-2',
        name: 'Paulo Supervisor',
        email: 'paulo@email.com',
        role: 'supervisor',
        isActive: true,
        joinDate: new Date('2024-01-05')
      },
      {
        id: 'user-3',
        name: 'Eng. Roberto Silva',
        email: 'roberto@email.com',
        role: 'engenheiro',
        isActive: true,
        joinDate: new Date('2024-01-10')
      }
    ],
    tasks: [
      {
        id: 'task-1',
        title: 'Realizar inspeção da cobertura',
        dueDate: new Date('2024-12-10'),
        assignedTo: {
          id: 'user-2',
          name: 'Paulo Supervisor',
          email: 'paulo@email.com',
          role: 'supervisor',
          isActive: true,
          joinDate: new Date('2024-01-05')
        },
        status: 'pendente',
        priority: 'alta',
        createdAt: new Date('2024-12-01'),
        createdBy: 'admin'
      }
    ],
    alerts: [
      {
        id: 'alert-1',
        type: 'aviso',
        title: 'Atraso na Etapa de Cobertura',
        message: 'A etapa de cobertura está 5 dias atrasada',
        relatedStage: 'stage-4',
        createdAt: new Date('2024-11-28'),
        resolved: false,
        priority: 'alta'
      }
    ],
    budget: {
      id: 'budget-1',
      plannedBudget: 250000,
      actualCost: 187750,
      laborCost: 95000,
      materialsCost: 92750,
      otherCost: 0,
      contingency: 10,
      currency: 'BRL',
      lastUpdated: new Date('2024-12-03')
    },
    legalData: {
      hasART: true,
      artNumber: 'ART-2024-001'
    },
    isArchived: false
  }
]

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(mockProjects)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Buscar todos os projetos
  const fetchProjects = useCallback(async (filters?: ProjectFilters) => {
    setLoading(true)
    setError(null)
    try {
      const data = await getProjectsFromFirestore(filters)
      setProjects(data)
      return data
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao buscar projetos'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [projects])

  // Fetch initial projects on mount
  useEffect(() => {
    fetchProjects().catch(err => console.error('Failed to fetch projects on mount', err))
  }, [])

  // Buscar projeto por ID (sincrono a partir do cache local)
  const getProjectById = useCallback((projectId: string) => {
    return projects.find(p => p.id === projectId)
  }, [projects])

  // Garantir carregamento de um projeto por ID (async, fetch do Firestore se necessario)
  const fetchProjectById = useCallback(async (projectId: string) => {
    const local = projects.find(p => p.id === projectId)
    if (local) return local
    const remote = await getProjectByIdFromFirestore(projectId)
    if (remote) setProjects(prev => [...prev, remote])
    return remote
  }, [projects])

  // Criar novo projeto
  const createProject = useCallback(async (newProject: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true)
    setError(null)
    try {
      const created = await createProjectInFirestore(newProject as Partial<Project>)
      setProjects(prev => [...prev, created])
      return created
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao criar projeto'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [projects])

  // Atualizar projeto
  const updateProject = useCallback(async (projectId: string, updates: Partial<Project>) => {
    setLoading(true)
    setError(null)
    try {
      await updateProjectInFirestore(projectId, updates)
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, ...updates, updatedAt: new Date() } : p))
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao atualizar projeto'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [projects])

  // Excluir projeto
  const deleteProject = useCallback(async (projectId: string) => {
    setLoading(true)
    setError(null)
    try {
      await deleteProjectInFirestore(projectId)
      setProjects(prev => prev.filter(p => p.id !== projectId))
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao excluir projeto'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [projects])

  // Arquivar projeto
  const archiveProject = useCallback(async (projectId: string, userId: string) => {
    setLoading(true)
    setError(null)
    try {
      await archiveProjectInFirestore(projectId, userId)
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, isArchived: true, archivedAt: new Date(), archivedBy: userId, updatedAt: new Date() } : p))
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao arquivar projeto'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [projects])

  // Adicionar etapa
  const addStage = useCallback(async (projectId: string, stage: Omit<Stage, 'id'>) => {
    setLoading(true)
    setError(null)
    try {
      const newStage: Stage = { ...stage, id: `stage-${Date.now()}` }
      const projectDoc = await getProjectByIdFromFirestore(projectId)
      if (!projectDoc) throw new Error('Projeto não encontrado')
      const updatedStages = [...projectDoc.stages, newStage]
      await updateProjectInFirestore(projectId, { stages: updatedStages })
      setProjects(prev => prev.map(p => p.id === projectId ? { ...p, stages: updatedStages, updatedAt: new Date() } : p))
      return newStage
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao adicionar etapa'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }, [projects])

  // Obter estatísticas dos projetos
  const getStats = useCallback((): ProjectStats => {
    const total = projects.length
    const active = projects.filter(p => ['planejamento', 'analise', 'orcacao', 'execucao', 'inspecao', 'ajustes', 'finalizacao'].includes(p.status)).length
    const completed = projects.filter(p => p.status === 'concluido').length
    const delayed = projects.filter(p => p.status !== 'concluido' && new Date() > p.plannedEndDate).length
    const overBudget = projects.filter(p => p.budget.actualCost > p.budget.plannedBudget * 1.1).length
    const totalBudget = projects.reduce((sum, p) => sum + p.budget.plannedBudget, 0)
    const totalSpent = projects.reduce((sum, p) => sum + p.budget.actualCost, 0)
    const avgProgress = projects.length > 0 
      ? Math.round(projects.reduce((sum, p) => {
          const avgStageProgress = p.stages.length > 0
            ? p.stages.reduce((s, stage) => s + stage.progress, 0) / p.stages.length
            : 0
          return sum + avgStageProgress
        }, 0) / projects.length)
      : 0
    const teamSize = new Set(projects.flatMap(p => p.team.map(t => t.id))).size

    return {
      totalProjects: total,
      activeProjects: active,
      completedProjects: completed,
      delayedProjects: delayed,
      overBudgetProjects: overBudget,
      totalBudget,
      totalSpent,
      averageProgress: avgProgress,
      teamSize
    }
  }, [projects])

  return {
    projects,
    loading,
    error,
    fetchProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
    archiveProject,
    addStage,
    getStats
  }
}
