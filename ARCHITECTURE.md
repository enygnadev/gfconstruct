# 🏗️ Arquitetura Visual do Sistema

## 📊 Diagrama de Navegação

```
┌─────────────────────────────────────────────────────────┐
│                    DASHBOARD                             │
│  http://localhost:5000/sistema/dashboard               │
└────────┬────────────────────────────────────┬───────────┘
         │                                    │
    ┌────▼──────────────────┐      ┌────────▼─────────────┐
    │ 🧠 Plataforma Neural  │      │ 📁 Projetos & Obras  │
    │                       │      │  (NOVA ABA!)         │
    │ Orcamento IA          │      │                      │
    │ Cronograma Adaptativo │      ├─ Stats Cards (6)    │
    │ Financeiro            │      │  - Total            │
    │ Materiais             │      │  - Em Execução      │
    │ 3D/AR                 │      │  - Atrasados        │
    │ IA Consultora         │      │  - Concluídos       │
    │ Sustentável           │      │  - Orçamento        │
    │                       │      │  - Equipe           │
    │                       │      │                      │
    │                       │      ├─ Preview (6 cards)  │
    │                       │      │  ProjectCard x 6    │
    │                       │      │                      │
    │                       │      └─ "Ver Todos" button │
    └───────────────────────┘      └──────────┬──────────┘
                                              │
                                    ┌─────────▼────────────┐
                                    │ PROJETOS PAGE        │
                                    │ /sistema/projetos    │
                                    │                      │
                                    ├─ Search + Filters   │
                                    │ - Busca por texto   │
                                    │ - Tipo projeto      │
                                    │ - Status            │
                                    │ - Prioridade        │
                                    │                      │
                                    ├─ View Toggle        │
                                    │ - Grid (3 cols)     │
                                    │ - List (1 col)      │
                                    │                      │
                                    ├─ Grid/List          │
                                    │ ProjectCard x N     │
                                    │                      │
                                    └──────────┬──────────┘
                                              │
                                    ┌─────────▼──────────────┐
                                    │ PROJECT DETAIL        │
                                    │ /sistema/projetos/:id │
                                    │                       │
                                    ├─ 7 TABS ◄────┐        │
                                    │               │        │
        ┌───────────────────────────┼───┬───┬───┬──┼────┐   │
        │                           │   │   │   │  │    │   │
        ▼                           ▼   ▼   ▼   ▼  ▼    ▼   │
    ┌────────┐ ┌────────┐ ┌────────┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐   │
    │ Resumo │ │ Etapas │ │Documts │ │Eq│ │Mt│ │Fn│ │Al│   │
    │        │ │        │ │        │ │ui│ │ls│ │an│ │rt│   │
    │ • Info │ │ • List │ │ • List │ │pa│ │  │ │ci│ │as│   │
    │ • Geral│ │ • Prog │ │ • Dwld │ │ │ │ • │ │ei│ │  │   │
    │ • Resp │ │ • Check│ │ • Type │ │ │ │ F │ │ro│ │ • │   │
    │ • Prox │ │ • Resp │ │ • Date │ │ │ │ o │ │ │ │Txt│   │
    │ • Alrt │ │ • Orça │ │ • Exp  │ │ │ │ r │ │ │ │ • │   │
    │        │ │        │ │        │ │ │ │ n │ │ │ │Res│   │
    └────────┘ └────────┘ └────────┘ │ │ │ c │ │ │ │olv│   │
                                    │ │ │ d │ │ │ │   │   │
                                    │ │ │ r │ │ │ │   │   │
                                    │ │ │   │ │ │ │   │   │
                                    │ │ │   │ │ │ │   │   │
                                    └──┘ └──┘ └──┘ └───┘   │
                                    │                       │
                                    └───────────────────────┘
```

## 🎨 Estrutura de Componentes

```
┌─ Layout
│  ├─ Header
│  │  ├─ Logo
│  │  ├─ Search
│  │  ├─ Notifications
│  │  └─ User Menu
│  │
│  └─ Main
│     ├─ TabsList
│     │  ├─ Tab: Plataforma Neural
│     │  └─ Tab: Projetos & Obras
│     │
│     ├─ ProjectsTab
│     │  ├─ StatsGrid
│     │  │  └─ StatCard x 6
│     │  │
│     │  └─ ProjectsGrid
│     │     └─ ProjectCard x N
│     │
│     ├─ ProjectsList
│     │  ├─ FilterPanel
│     │  │  ├─ Search
│     │  │  ├─ TypeFilter
│     │  │  ├─ StatusFilter
│     │  │  └─ PriorityFilter
│     │  │
│     │  ├─ ViewToggle
│     │  │  ├─ GridView
│     │  │  └─ ListView
│     │  │
│     │  └─ ProjectsGrid/List
│     │     └─ ProjectCard x N
│     │
│     └─ ProjectDetail
│        ├─ Header
│        │  ├─ BackButton
│        │  ├─ Share
│        │  ├─ Download
│        │  └─ Menu
│        │
│        ├─ QuickStats
│        │  ├─ Progress
│        │  ├─ Budget
│        │  ├─ Deadline
│        │  └─ Team
│        │
│        └─ TabsContainer
│           ├─ ResumoTab
│           │  ├─ ProjectInfo
│           │  ├─ Timeline
│           │  ├─ Responsible
│           │  └─ Alerts
│           │
│           ├─ EtapasTab
│           │  └─ StageCard x N
│           │
│           ├─ DocumentosTab
│           │  └─ DocumentCard x N
│           │
│           ├─ EquipeTab
│           │  └─ MemberCard x N
│           │
│           ├─ MateriaisTab
│           │  └─ MaterialCard x N
│           │
│           ├─ FinanceiroTab
│           │  ├─ BudgetCard
│           │  ├─ SpentCard
│           │  ├─ LaborCard
│           │  └─ MaterialsCard
│           │
│           └─ AlertasTab
│              └─ AlertCard x N
```

## 📦 Estrutura de Dados

```
Project
├─ id
├─ projectName
├─ projectCode
├─ type: ProjectType
├─ status: ProjectStatus
├─ priority: Priority
│
├─ Client Info
│  ├─ name
│  ├─ email
│  ├─ phone
│  └─ address
│
├─ Location
│  ├─ address
│  ├─ city
│  ├─ state
│  ├─ latitude
│  └─ longitude
│
├─ People
│  ├─ owner: ProjectMember
│  ├─ supervisor?: ProjectMember
│  ├─ technicalManager?: ProjectMember
│  ├─ team: ProjectMember[]
│  │  ├─ id
│  │  ├─ name
│  │  ├─ email
│  │  ├─ role
│  │  ├─ phone
│  │  └─ isActive
│
├─ Dates
│  ├─ startDate
│  ├─ plannedEndDate
│  ├─ actualEndDate?
│  ├─ createdAt
│  └─ updatedAt
│
├─ Content
│  ├─ description
│  ├─ objective
│  ├─ scope?
│  ├─ methodology?
│  ├─ technicalRequirements?
│  └─ applicableNorms?
│
├─ Stages: Stage[]
│  ├─ id
│  ├─ name
│  ├─ description
│  ├─ status: StageStatus
│  ├─ startDate
│  ├─ dueDate
│  ├─ progress: 0-100
│  ├─ responsible?: ProjectMember
│  ├─ budget
│  ├─ actualCost
│  ├─ checklists: StageChecklist[]
│  │  ├─ id
│  │  ├─ title
│  │  ├─ completed
│  │  ├─ evidence?
│  │  │  ├─ photos
│  │  │  ├─ videos
│  │  │  └─ documents
│  │  └─ order
│  └─ attachments?
│
├─ Documents: Document[]
│  ├─ id
│  ├─ name
│  ├─ type: DocumentType
│  ├─ url
│  ├─ uploadDate
│  ├─ uploadedBy
│  ├─ expirationDate?
│  ├─ tags?
│  └─ description?
│
├─ Materials: ProjectMaterial[]
│  ├─ id
│  ├─ name
│  ├─ quantity
│  ├─ unit
│  ├─ quantityUsed?
│  ├─ currentStock?
│  ├─ unitPrice
│  ├─ supplier?
│  ├─ deliveryDate?
│  ├─ status
│  ├─ specifications?
│  └─ qrCode?
│
├─ Budget
│  ├─ id
│  ├─ plannedBudget
│  ├─ actualCost
│  ├─ laborCost
│  ├─ materialsCost
│  ├─ otherCost
│  ├─ contingency (%)
│  ├─ currency
│  ├─ breakdown?
│  │  └─ category, percentage, value
│  └─ lastUpdated
│
├─ Tasks: ProjectTask[]
│  ├─ id
│  ├─ title
│  ├─ description
│  ├─ dueDate
│  ├─ assignedTo: ProjectMember
│  ├─ status
│  ├─ priority
│  ├─ stage?
│  ├─ attachments?
│  └─ createdAt
│
├─ Alerts: ProjectAlert[]
│  ├─ id
│  ├─ type: AlertType
│  ├─ title
│  ├─ message
│  ├─ relatedStage?
│  ├─ relatedDocument?
│  ├─ createdAt
│  ├─ resolved
│  ├─ priority
│  └─ resolvedAt?
│
├─ Legal Data
│  ├─ hasART
│  ├─ artNumber?
│  └─ licenses?
│
├─ Metadata
│  ├─ tags?
│  ├─ notes?
│  ├─ isArchived
│  ├─ archivedAt?
│  └─ archivedBy?
│
└─ AI Insights
   ├─ estimatedCompletion?
   ├─ riskLevel?
   ├─ delayProbability?
   ├─ costOverrunRisk?
   ├─ recommendations?
   └─ lastAnalysis?
```

## 🎯 Fluxo de Dados

```
Dashboard Component
    ↓
useProjects Hook
    ↓
┌────────────────────────┐
│  Mock Data (mockProjects) or Firebase
└────────────────────────┘
    ↓
┌─ fetchProjects(filters)
├─ getProjectById(id)
├─ createProject()
├─ updateProject()
├─ deleteProject()
├─ archiveProject()
├─ addStage()
└─ getStats()
    ↓
Projects Array + Stats
    ↓
┌─ Project Card Grid
├─ Project Detail Page
├─ Filters
└─ Statistics
```

## 🔄 Ciclo de Vida

```
1. INIT
   ↓
2. FETCH PROJECTS
   ├─ With Filters (optional)
   └─ Parse Mock Data / Firebase
   ↓
3. DISPLAY RESULTS
   ├─ Grid/List View
   ├─ Stats Calculated
   └─ Cards Rendered
   ↓
4. USER INTERACTION
   ├─ Click Project → Detail Page
   ├─ Apply Filters → Re-fetch
   ├─ View Toggle → Re-render
   └─ Search → Filter & Display
   ↓
5. DETAIL PAGE
   ├─ Get Project by ID
   ├─ Render 7 Tabs
   ├─ Display All Data
   └─ Show Stats/Alerts
```

## 📊 Estado da Aplicação

```
useProjects Hook State:
├─ projects: Project[] = mockProjects
├─ loading: boolean = false
├─ error: string | null = null
├─ selectedFilters: ProjectFilters = {}
│
└─ Derived State (getStats):
   ├─ totalProjects
   ├─ activeProjects
   ├─ completedProjects
   ├─ delayedProjects
   ├─ overBudgetProjects
   ├─ totalBudget
   ├─ totalSpent
   ├─ averageProgress
   └─ teamSize
```

## 🎨 Design System

```
Colors:
├─ Primary: Gold (#FFD700)
├─ Slate: Various (#0F172A - #F8FAFC)
├─ Status:
│  ├─ Planejamento: Blue
│  ├─ Análise: Purple
│  ├─ Orçação: Orange
│  ├─ Execução: Amber
│  ├─ Concluído: Green
│  ├─ Suspenso: Red
│
Typography:
├─ H1: text-4xl font-bold
├─ H2: text-3xl font-bold
├─ H3: text-lg font-semibold
├─ Body: text-sm/base
├─ Caption: text-xs
│
Spacing (Tailwind):
├─ xs: 0.25rem
├─ sm: 0.5rem
├─ md: 1rem
├─ lg: 1.5rem
├─ xl: 2rem
│
Shadows:
├─ None: shadow-none
├─ Default: shadow
├─ Hover: shadow-lg
│
Borders:
├─ None: border-0
├─ Default: border
├─ Rounded: rounded-lg
│
Animations:
├─ Transition: transition-all
├─ Duration: 300ms-500ms
├─ Easing: ease-in-out
```

## 🔌 Integração Futura

```
Current (Mock):
├─ Mock Data in Hook
└─ Console Logging

Future (Firebase):
├─ Authentication
│  ├─ Firebase Auth
│  └─ User Context
├─ Database
│  ├─ Firestore Collections
│  │  ├─ /projects
│  │  ├─ /stages
│  │  ├─ /documents
│  │  ├─ /team
│  │  ├─ /materials
│  │  ├─ /budget
│  │  └─ /alerts
│  └─ Real-time Listeners
├─ Storage
│  └─ Cloud Storage (files)
└─ Analytics
   └─ Firebase Analytics

Future (Extras):
├─ Email Notifications
├─ Push Notifications
├─ Chat (Firebase/Socket.io)
├─ File Parsing (PDFs)
├─ Map Integration
└─ Video Hosting
```

---

Essa arquitetura mantém o código **escalável, modular e fácil de manter** para crescimento futuro! 🚀
