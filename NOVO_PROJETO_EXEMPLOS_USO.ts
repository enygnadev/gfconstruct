/**
 * EXEMPLOS DE USO - Sistema Completo de Novo Projeto
 * ====================================================
 * 
 * Este arquivo contém exemplos práticos de como usar
 * todas as funcionalidades do sistema de novo projeto.
 */

// ============================================
// 1. USANDO O COMPONENTE NewProjectForm
// ============================================

import { NewProjectForm, NewProjectData } from '@/components/projects/new-project-form'
import { useState } from 'react'

function ExampleBasicUsage() {
  const [isOpen, setIsOpen] = useState(false)

  const handleCreateProject = async (data: NewProjectData) => {
    console.log('Dados do projeto:', data)
    
    // Aqui você integraria com Firebase ou sua API
    // const response = await api.post('/projects', data)
    
    // Simular salvamento
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>
        Abrir Formulário
      </button>

      <NewProjectForm
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleCreateProject}
      />
    </div>
  )
}

// ============================================
// 2. USANDO O HOOK useNotification
// ============================================

import { useNotification } from '@/components/projects/project-notification'

function ExampleWithNotifications() {
  const { success, error, info, warning } = useNotification()

  const handleSaveProject = async () => {
    try {
      // Simular operação
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      success(
        '✓ Projeto criado com sucesso!',
        'Casa Residencial foi adicionada ao sistema'
      )
    } catch (err) {
      error(
        '❌ Erro ao criar projeto',
        'Verifique os dados e tente novamente'
      )
    }
  }

  const handleShowInfo = () => {
    info('Informação', 'Este é um exemplo de notificação informativa')
  }

  const handleShowWarning = () => {
    warning('Atenção', 'Este é um aviso importante')
  }

  return (
    <div className="space-y-2">
      <button onClick={handleSaveProject}>Criar Projeto</button>
      <button onClick={handleShowInfo}>Mostrar Info</button>
      <button onClick={handleShowWarning}>Mostrar Aviso</button>
    </div>
  )
}

// ============================================
// 3. USANDO COM FIREBASE
// ============================================

import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

async function handleCreateProjectWithFirebase(data: NewProjectData) {
  try {
    const projectsRef = collection(db, 'projects')
    
    const docRef = await addDoc(projectsRef, {
      projectName: data.projectName,
      projectCode: data.projectCode,
      type: data.type,
      priority: data.priority,
      description: data.description,
      client: data.client,
      location: data.location,
      budget: {
        plannedBudget: data.budget,
        actualCost: 0,
        currency: 'BRL'
      },
      startDate: new Date(data.startDate),
      plannedEndDate: new Date(data.plannedEndDate),
      objective: data.objective,
      scope: data.scope,
      status: 'planejamento',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      createdBy: 'current_user_id', // Obter do contexto de autenticação
      team: [
        {
          id: 'current_user_id',
          name: 'Nome do Usuário',
          email: 'user@email.com',
          role: 'dono',
          joinDate: new Date()
        }
      ],
      stages: [],
      materials: [],
      documents: [],
      tasks: [],
      alerts: []
    })

    return docRef.id
  } catch (error) {
    console.error('Erro ao criar projeto no Firebase:', error)
    throw error
  }
}

// ============================================
// 4. USANDO COM CONTEXTO DE AUTENTICAÇÃO
// ============================================

import { useAuth } from '@/lib/auth-context'

function ExampleWithAuth() {
  const { user } = useAuth()
  const { success, error } = useNotification()

  const handleCreateProject = async (data: NewProjectData) => {
    if (!user) {
      error('Erro', 'Usuário não autenticado')
      return
    }

    try {
      const projectsRef = collection(db, 'projects')
      
      await addDoc(projectsRef, {
        ...data,
        createdBy: user.uid,
        createdByEmail: user.email,
        createdAt: serverTimestamp(),
        team: [
          {
            id: user.uid,
            name: user.displayName || 'Usuário',
            email: user.email,
            role: 'dono',
            joinDate: new Date()
          }
        ]
      })

      success('Projeto criado!', `Olá ${user.displayName}!`)
    } catch (err) {
      error('Erro ao criar projeto', (err as Error).message)
    }
  }

  return (
    <div>
      {user && <p>Bem-vindo, {user.displayName}!</p>}
    </div>
  )
}

// ============================================
// 5. USANDO COM VALIDAÇÕES CUSTOMIZADAS
// ============================================

function validateProjectData(data: NewProjectData): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  // Validação de nome
  if (data.projectName.length < 5) {
    errors.push('Nome do projeto deve ter pelo menos 5 caracteres')
  }

  // Validação de orçamento
  if (data.budget < 1000) {
    errors.push('Orçamento mínimo é R$ 1.000,00')
  }

  if (data.budget > 10000000) {
    errors.push('Orçamento máximo é R$ 10.000.000,00')
  }

  // Validação de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(data.client.email)) {
    errors.push('Email do cliente inválido')
  }

  // Validação de datas
  const startDate = new Date(data.startDate)
  const endDate = new Date(data.plannedEndDate)
  const today = new Date()

  if (startDate < today) {
    errors.push('Data de início não pode ser no passado')
  }

  const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  if (duration < 7) {
    errors.push('Duração mínima do projeto é 7 dias')
  }

  if (duration > 1095) {
    errors.push('Duração máxima do projeto é 3 anos')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

// Usar em um componente
function ExampleWithCustomValidation() {
  const { error } = useNotification()

  const handleCreateProject = async (data: NewProjectData) => {
    const { valid, errors } = validateProjectData(data)

    if (!valid) {
      errors.forEach(err => {
        error('Validação falhou', err)
      })
      return
    }

    // Prosseguir com criação
  }

  return null
}

// ============================================
// 6. USANDO COM HISTÓRICO E AUDITORIA
// ============================================

async function createProjectWithAudit(data: NewProjectData, userId: string) {
  try {
    const db = getFirestore()
    
    // Criar projeto
    const projectRef = await addDoc(collection(db, 'projects'), {
      ...data,
      createdBy: userId,
      createdAt: serverTimestamp(),
      status: 'planejamento'
    })

    // Registrar no histórico de auditoria
    await addDoc(collection(db, 'audit_logs'), {
      action: 'CREATE_PROJECT',
      entityType: 'project',
      entityId: projectRef.id,
      userId: userId,
      timestamp: serverTimestamp(),
      changes: {
        projectName: data.projectName,
        projectCode: data.projectCode,
        budget: data.budget
      },
      status: 'success'
    })

    return projectRef.id
  } catch (error) {
    // Registrar erro na auditoria
    await addDoc(collection(db, 'audit_logs'), {
      action: 'CREATE_PROJECT',
      entityType: 'project',
      userId: userId,
      timestamp: serverTimestamp(),
      status: 'failed',
      errorMessage: (error as Error).message
    })

    throw error
  }
}

// ============================================
// 7. EXEMPLO COMPLETO INTEGRADO
// ============================================

import { useEffect } from 'react'
import { useProjects } from '@/lib/hooks/useProjects'

function CompleteExampleComponent() {
  const { projects, fetchProjects, getStats } = useProjects()
  const { notifications, success, error, remove } = useNotification()
  const [isFormOpen, setIsFormOpen] = useState(false)

  useEffect(() => {
    // Carregar projetos ao montar
    fetchProjects()
  }, [])

  const handleCreateProject = async (data: NewProjectData) => {
    try {
      const { valid, errors } = validateProjectData(data)
      
      if (!valid) {
        errors.forEach(err => error('Validação', err))
        return
      }

      // Criar no Firebase
      const projectId = await handleCreateProjectWithFirebase(data)
      
      // Recarregar lista
      await fetchProjects()
      
      // Mostrar sucesso
      success(
        '✓ Projeto Criado!',
        `Projeto "${data.projectName}" foi criado com ID: ${projectId}`
      )
      
      // Fechar formulário
      setIsFormOpen(false)

    } catch (err) {
      error(
        '❌ Erro ao Criar',
        (err as Error).message
      )
    }
  }

  const stats = getStats()

  return (
    <div className="space-y-6">
      {/* Notificações */}
      <div className="fixed top-6 right-6 space-y-2">
        {notifications.map(notif => (
          <div key={notif.id} className="p-4 bg-white rounded shadow-lg">
            {notif.title}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1>Gestão de Projetos</h1>
        <button onClick={() => setIsFormOpen(true)}>
          Novo Projeto
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div>Total: {stats.totalProjects}</div>
        <div>Em Execução: {stats.activeProjects}</div>
        <div>Concluídos: {stats.completedProjects}</div>
        <div>Atrasados: {stats.delayedProjects}</div>
      </div>

      {/* Formulário */}
      <NewProjectForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateProject}
      />

      {/* Lista de Projetos */}
      <div className="grid grid-cols-3 gap-4">
        {projects.map(project => (
          <div key={project.id} className="p-4 border rounded">
            <h3>{project.projectName}</h3>
            <p>{project.projectCode}</p>
            <p>R$ {project.budget.plannedBudget.toLocaleString('pt-BR')}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CompleteExampleComponent

// ============================================
// 8. EXEMPLOS DE DADOS PARA TESTES
// ============================================

const mockProjectData: NewProjectData = {
  projectName: 'Casa Residencial - Vila São Paulo',
  projectCode: 'PROJ-001',
  type: 'obra-civil',
  priority: 'media',
  description: 'Construção de casa residencial com 3 quartos, sala, cozinha e área de serviço',
  client: {
    name: 'João Silva Santos',
    email: 'joao.silva@email.com',
    phone: '(11) 99999-9999'
  },
  location: {
    address: 'Rua das Flores, 123',
    city: 'São Paulo',
    state: 'SP'
  },
  budget: 350000,
  startDate: '2024-12-15',
  plannedEndDate: '2025-06-30',
  objective: 'Construir uma moradia residencial de qualidade com acabamento premium',
  scope: 'Fundação, estrutura, alvenaria, cobertura, acabamento, pintura, hidráulica, elétrica'
}

const mockReformaData: NewProjectData = {
  projectName: 'Reforma de Apartamento - Pinheiros',
  projectCode: 'PROJ-002',
  type: 'reforma',
  priority: 'alta',
  description: 'Reforma completa de apartamento com 2 quartos',
  client: {
    name: 'Maria Oliveira',
    email: 'maria.oliveira@email.com',
    phone: '(11) 98888-8888'
  },
  location: {
    address: 'Avenida Brasil, 456, Apto 502',
    city: 'São Paulo',
    state: 'SP'
  },
  budget: 75000,
  startDate: '2024-12-20',
  plannedEndDate: '2025-03-20',
  objective: 'Modernizar o apartamento com novo layout e acabamentos atualizados',
  scope: 'Demolição, alvenaria, piso, azulejo, pintura, acabamentos'
}

// ============================================
// TESTES
// ============================================

// Teste 1: Validação de dados
console.log('Teste 1: Validação')
console.log(validateProjectData(mockProjectData))

// Teste 2: Cálculo de duração
function calculateDuration(startDate: string, endDate: string): number {
  return Math.ceil(
    (new Date(endDate).getTime() - new Date(startDate).getTime()) / 
    (1000 * 60 * 60 * 24)
  )
}

console.log('Duração do projeto:', calculateDuration(
  mockProjectData.startDate,
  mockProjectData.plannedEndDate
) + ' dias')

// Teste 3: Formatação de orçamento
function formatBudget(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

console.log('Orçamento formatado:', formatBudget(mockProjectData.budget))
