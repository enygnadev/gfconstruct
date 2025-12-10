# 💻 Exemplos de Código - Sistema de Gestão de Projetos

## 1. Usando o Hook useProjects

### Exemplo Básico: Exibir todos os projetos

```typescript
'use client'

import { useEffect } from 'react'
import { useProjects } from '@/lib/hooks/useProjects'

export function ProjectsList() {
  const { projects, loading, fetchProjects } = useProjects()

  useEffect(() => {
    fetchProjects()
  }, [])

  if (loading) return <div>Carregando...</div>

  return (
    <div>
      <h1>Meus Projetos ({projects.length})</h1>
      {projects.map(project => (
        <div key={project.id}>
          <h2>{project.projectName}</h2>
          <p>Status: {project.status}</p>
          <p>Progresso: {Math.round(
            project.stages.reduce((sum, s) => sum + s.progress, 0) / 
            project.stages.length
          )}%</p>
        </div>
      ))}
    </div>
  )
}
```

### Exemplo 2: Filtrar projetos específicos

```typescript
import { useProjects } from '@/lib/hooks/useProjects'

export function ActiveProjects() {
  const { projects, fetchProjects } = useProjects()

  useEffect(() => {
    // Buscar apenas projetos em execução com alta prioridade
    fetchProjects({
      status: ['execucao'],
      priority: ['alta', 'critica']
    })
  }, [])

  return (
    <div>
      <h2>Projetos Críticos em Execução</h2>
      {/* Render projects */}
    </div>
  )
}
```

### Exemplo 3: Obter um projeto específico

```typescript
import { useProjects } from '@/lib/hooks/useProjects'

export function ProjectDetail({ projectId }: { projectId: string }) {
  const { getProjectById } = useProjects()
  
  const project = getProjectById(projectId)

  if (!project) {
    return <div>Projeto não encontrado</div>
  }

  return (
    <div>
      <h1>{project.projectName}</h1>
      <p>Cliente: {project.client?.name}</p>
      <p>Orçamento: R$ {project.budget.plannedBudget}</p>
      <p>Gasto: R$ {project.budget.actualCost}</p>
    </div>
  )
}
```

### Exemplo 4: Usar estatísticas

```typescript
import { useProjects } from '@/lib/hooks/useProjects'

export function ProjectStats() {
  const { getStats } = useProjects()
  
  const stats = getStats()

  return (
    <div>
      <p>Total de Projetos: {stats.totalProjects}</p>
      <p>Em Execução: {stats.activeProjects}</p>
      <p>Concluídos: {stats.completedProjects}</p>
      <p>Atrasados: {stats.delayedProjects}</p>
      <p>Progresso Médio: {stats.averageProgress}%</p>
      <p>Orçamento Total: R$ {stats.totalBudget}</p>
      <p>Total Gasto: R$ {stats.totalSpent}</p>
      <p>Equipe: {stats.teamSize} pessoas</p>
    </div>
  )
}
```

### Exemplo 5: Criar um novo projeto

```typescript
import { useProjects } from '@/lib/hooks/useProjects'
import { Project } from '@/lib/types/projects'

export function CreateProject() {
  const { createProject } = useProjects()

  const handleCreate = async () => {
    const newProject = {
      projectName: 'Novo Projeto',
      projectCode: 'PROJ-002',
      type: 'obra-civil' as const,
      status: 'planejamento' as const,
      priority: 'media' as const,
      owner: {
        id: 'user-1',
        name: 'Seu Nome',
        email: 'seu@email.com',
        role: 'dono' as const,
        isActive: true,
        joinDate: new Date()
      },
      startDate: new Date(),
      plannedEndDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      description: 'Descrição do projeto',
      objective: 'Objetivo do projeto',
      stages: [],
      materials: [],
      documents: [],
      team: [],
      tasks: [],
      alerts: [],
      budget: {
        id: 'budget-1',
        plannedBudget: 100000,
        actualCost: 0,
        laborCost: 0,
        materialsCost: 0,
        otherCost: 0,
        contingency: 10,
        currency: 'BRL',
        lastUpdated: new Date()
      },
      legalData: { hasART: false },
      isArchived: false
    }

    await createProject(newProject)
  }

  return <button onClick={handleCreate}>Criar Projeto</button>
}
```

## 2. Usando Componentes

### Exemplo 1: Card de Projeto

```typescript
import { ProjectCard } from '@/components/projects/project-card'
import { Project } from '@/lib/types/projects'

export function ProjectCardExample({ project }: { project: Project }) {
  return (
    <ProjectCard
      project={project}
      onClick={() => console.log('Clicou no projeto')}
      onEdit={() => console.log('Editar')}
      onDelete={() => console.log('Deletar')}
      showMenu={true}
    />
  )
}
```

### Exemplo 2: Card de Etapa

```typescript
import { StageCard } from '@/components/projects/stage-card'
import { Stage } from '@/lib/types/projects'

export function StageCardExample({ stage }: { stage: Stage }) {
  return (
    <StageCard
      stage={stage}
      projectId="proj-1"
      onClick={() => console.log('Clicou na etapa')}
    />
  )
}
```

### Exemplo 3: Filtros

```typescript
import { ProjectFiltersPanel } from '@/components/projects/projects-filters'
import { ProjectFilters } from '@/lib/types/projects'

export function FiltersExample() {
  const handleFilterChange = (filters: ProjectFilters) => {
    console.log('Filtros aplicados:', filters)
  }

  return (
    <ProjectFiltersPanel
      onFiltersChange={handleFilterChange}
      isOpen={true}
    />
  )
}
```

### Exemplo 4: Visão Geral (Overview)

```typescript
import { ProjectsOverview } from '@/components/projects/projects-overview'
import { useProjects } from '@/lib/hooks/useProjects'

export function OverviewExample() {
  const { projects, getStats } = useProjects()
  const stats = getStats()

  return (
    <ProjectsOverview
      stats={stats}
      projects={projects}
    />
  )
}
```

## 3. Tipos e Interfaces

### Exemplo 1: Criar um projeto com tipos

```typescript
import { Project, ProjectType, ProjectStatus, Priority } from '@/lib/types/projects'

const meuProjeto: Project = {
  id: 'proj-1',
  projectName: 'Casa Moderna',
  projectCode: 'PROJ-001',
  type: 'obra-civil',
  status: 'execucao',
  priority: 'alta',
  owner: {
    id: 'user-1',
    name: 'Carlos',
    email: 'carlos@email.com',
    role: 'dono',
    isActive: true,
    joinDate: new Date()
  },
  startDate: new Date('2024-01-01'),
  plannedEndDate: new Date('2024-06-30'),
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date(),
  description: 'Construção residencial',
  objective: 'Entregar casa de qualidade',
  stages: [],
  materials: [],
  documents: [],
  team: [],
  tasks: [],
  alerts: [],
  budget: {
    id: 'budget-1',
    plannedBudget: 250000,
    actualCost: 150000,
    laborCost: 80000,
    materialsCost: 70000,
    otherCost: 0,
    contingency: 10,
    currency: 'BRL',
    lastUpdated: new Date()
  },
  legalData: { hasART: true, artNumber: 'ART-001' },
  isArchived: false
}
```

### Exemplo 2: Adicionar uma etapa

```typescript
import { Stage } from '@/lib/types/projects'

const novaEtapa: Stage = {
  id: 'stage-1',
  name: 'Fundação',
  description: 'Escavação e fundação',
  status: 'em-progresso',
  startDate: new Date('2024-01-15'),
  dueDate: new Date('2024-01-30'),
  progress: 50,
  checklists: [
    {
      id: 'check-1',
      title: 'Escavação completa',
      completed: true,
      order: 1
    },
    {
      id: 'check-2',
      title: 'Forma de concreto',
      completed: false,
      order: 2
    }
  ],
  budget: 15000,
  actualCost: 8000,
  order: 1
}
```

### Exemplo 3: Usar tipos de filtro

```typescript
import { ProjectFilters, ProjectType, ProjectStatus } from '@/lib/types/projects'

const filtros: ProjectFilters = {
  searchText: 'São Paulo',
  type: ['obra-civil', 'reforma'],
  status: ['execucao', 'inspecao'],
  priority: ['alta'],
  includeArchived: false
}
```

## 4. Padrões Comuns

### Padrão 1: Buscar e listar

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useProjects } from '@/lib/hooks/useProjects'
import { ProjectFilters } from '@/lib/types/projects'

export function SearchAndList() {
  const { projects, fetchProjects } = useProjects()
  const [filters, setFilters] = useState<ProjectFilters>({})

  const handleSearch = (text: string) => {
    const newFilters = { ...filters, searchText: text }
    setFilters(newFilters)
    fetchProjects(newFilters)
  }

  useEffect(() => {
    fetchProjects(filters)
  }, [])

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar..."
        onChange={(e) => handleSearch(e.target.value)}
      />
      {projects.map(p => (
        <div key={p.id}>{p.projectName}</div>
      ))}
    </div>
  )
}
```

### Padrão 2: Grid responsivo

```typescript
'use client'

import { useProjects } from '@/lib/hooks/useProjects'
import { ProjectCard } from '@/components/projects/project-card'

export function ResponsiveGrid() {
  const { projects } = useProjects()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map(project => (
        <ProjectCard
          key={project.id}
          project={project}
        />
      ))}
    </div>
  )
}
```

### Padrão 3: Indicadores visuais

```typescript
'use client'

import { useProjects } from '@/lib/hooks/useProjects'
import { Badge } from '@/components/ui/badge'

export function ProjectStatus({ projectId }: { projectId: string }) {
  const { getProjectById } = useProjects()
  const project = getProjectById(projectId)

  if (!project) return null

  const isOverdue = new Date() > project.plannedEndDate
  const isOverBudget = project.budget.actualCost > project.budget.plannedBudget * 1.1

  return (
    <div className="flex gap-2">
      {isOverdue && (
        <Badge variant="destructive">Atrasado</Badge>
      )}
      {isOverBudget && (
        <Badge variant="secondary">Acima do Orçamento</Badge>
      )}
      {!isOverdue && !isOverBudget && (
        <Badge variant="default">No Prazo</Badge>
      )}
    </div>
  )
}
```

## 5. Integração com Página

### Exemplo: Página de Projetos Completa

```typescript
'use client'

import { useEffect, useState } from 'react'
import { useProjects } from '@/lib/hooks/useProjects'
import { ProjectFilters } from '@/lib/types/projects'
import { ProjectCard } from '@/components/projects/project-card'
import { ProjectFiltersPanel } from '@/components/projects/projects-filters'

export default function ProjectsPage() {
  const { projects, loading, fetchProjects, getStats } = useProjects()
  const [filters, setFilters] = useState<ProjectFilters>({})
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => {
    fetchProjects(filters)
  }, [filters])

  const stats = getStats()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold mb-2">Projetos</h1>
        <p className="text-gray-600">
          {stats.totalProjects} projetos • {stats.activeProjects} ativos
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <button onClick={() => setFiltersOpen(!filtersOpen)}>
          Filtros
        </button>
        {filtersOpen && (
          <ProjectFiltersPanel
            onFiltersChange={setFilters}
            isOpen={true}
          />
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div>Carregando...</div>
      ) : projects.length === 0 ? (
        <div>Nenhum projeto encontrado</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onClick={() => console.log('Clicar projeto')}
            />
          ))}
        </div>
      )}
    </div>
  )
}
```

---

## 📚 Referência Rápida

| O que quero fazer | Onde usar | Função |
|---|---|---|
| Listar todos os projetos | Hook | `fetchProjects()` |
| Obter um projeto | Hook | `getProjectById(id)` |
| Criar novo | Hook | `createProject()` |
| Atualizar | Hook | `updateProject()` |
| Deletar | Hook | `deleteProject()` |
| Arquivar | Hook | `archiveProject()` |
| Adicionar etapa | Hook | `addStage()` |
| Estatísticas | Hook | `getStats()` |
| Mostrar projeto | Componente | `<ProjectCard />` |
| Mostrar etapa | Componente | `<StageCard />` |
| Filtros | Componente | `<ProjectFiltersPanel />` |
| Overview | Componente | `<ProjectsOverview />` |

---

Esses exemplos cobrem os principais casos de uso do sistema. Consulte a documentação técnica para mais detalhes!
