import { useState, useCallback } from 'react'
import { NewProjectData } from '@/components/projects/new-project-form'
import { Project, ProjectMember, Stage } from '@/lib/types/projects'

export interface UseCreateProjectResult {
  creating: boolean
  error: string | null
  success: boolean
  projectCreated?: Project
  createProject: (data: NewProjectData) => Promise<Project>
  resetState: () => void
}

/**
 * Hook para gerenciar a criação de novos projetos
 * Integra validação, persistência em Firebase e sincronização
 */
export function useCreateProject(): UseCreateProjectResult {
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [projectCreated, setProjectCreated] = useState<Project | undefined>(undefined)

  const resetState = useCallback(() => {
    setCreating(false)
    setError(null)
    setSuccess(false)
    setProjectCreated(undefined)
  }, [])

  const createProject = useCallback(async (data: NewProjectData): Promise<Project> => {
    setCreating(true)
    setError(null)
    setSuccess(false)

    try {
      // Validação básica
      if (!data.projectName?.trim()) {
        throw new Error('Nome do projeto é obrigatório')
      }
      if (!data.projectCode?.trim()) {
        throw new Error('Código do projeto é obrigatório')
      }
      if (data.budget <= 0) {
        throw new Error('Orçamento deve ser maior que zero')
      }

      // Criar novo projeto
      const startDate = new Date(data.startDate)
      const endDate = new Date(data.plannedEndDate)
      
      const newProject: Project = {
        id: `proj_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        projectName: data.projectName,
        projectCode: data.projectCode,
        type: data.type,
        status: 'planejamento',
        description: data.description,
        priority: data.priority,
        client: {
          name: data.client.name,
          email: data.client.email,
          phone: data.client.phone,
          address: data.location.address
        },
        location: {
          address: data.location.address,
          city: data.location.city,
          state: data.location.state,
          latitude: 0,
          longitude: 0
        },
        owner: {
          id: 'current_user_id',
          name: 'Usuário Atual',
          email: 'usuario@email.com',
          role: 'dono',
          phone: data.client.phone,
          isActive: true,
          joinDate: new Date()
        },
        startDate: startDate,
        plannedEndDate: endDate,
        createdAt: new Date(),
        updatedAt: new Date(),
        objective: data.objective,
        scope: data.scope,
        methodology: 'Tradicional',
        technicalRequirements: '',
        stages: [
          {
            id: 'stage_planejamento',
            name: 'Planejamento',
            status: 'pendente',
            startDate: startDate,
            dueDate: new Date(startDate.getTime() + 10 * 24 * 60 * 60 * 1000),
            progress: 0,
            checklists: [
              {
                id: 'check_1',
                title: 'Aprovação do projeto',
                completed: false,
                order: 1
              },
              {
                id: 'check_2',
                title: 'Levantamento topográfico',
                completed: false,
                order: 2
              }
            ],
            budget: data.budget * 0.1,
            actualCost: 0,
            order: 1
          },
          {
            id: 'stage_analise',
            name: 'Análise Técnica',
            status: 'pendente',
            startDate: new Date(startDate.getTime() + 11 * 24 * 60 * 60 * 1000),
            dueDate: new Date(startDate.getTime() + 25 * 24 * 60 * 60 * 1000),
            progress: 0,
            checklists: [
              {
                id: 'check_3',
                title: 'Análise de solo',
                completed: false,
                order: 1
              },
              {
                id: 'check_4',
                title: 'Projeto estrutural',
                completed: false,
                order: 2
              }
            ],
            budget: data.budget * 0.15,
            actualCost: 0,
            order: 2
          }
        ],
        materials: [],
        documents: [],
        team: [
          {
            id: 'current_user_id',
            name: 'Usuário Atual',
            email: 'usuario@email.com',
            role: 'dono',
            phone: data.client.phone,
            isActive: true,
            joinDate: new Date()
          }
        ],
        tasks: [],
        alerts: [],
        budget: {
          id: `budget_${Date.now()}`,
          plannedBudget: data.budget,
          actualCost: 0,
          laborCost: 0,
          materialsCost: 0,
          otherCost: 0,
          contingency: 10,
          currency: 'BRL',
          lastUpdated: new Date()
        },
        isArchived: false
      }

      // Simular salvamento em Firebase
      // Em produção, usar: await firebase.database().ref(`projects/${newProject.id}`).set(newProject)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Aqui você pode adicionar a lógica de persistência com Firebase
      // exemplo: await addProjectToFirebase(newProject)

      setProjectCreated(newProject)
      setSuccess(true)
      return newProject
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao criar projeto'
      setError(errorMessage)
      throw err
    } finally {
      setCreating(false)
    }
  }, [])

  return {
    creating,
    error,
    success,
    projectCreated,
    createProject,
    resetState
  }
}
