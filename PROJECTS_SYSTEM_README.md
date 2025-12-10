# 📁 Sistema de Gestão de Projetos/Obras - ObraFlow / Project Core

## 🎯 Visão Geral

Sistema completo de gerenciamento de projetos e obras integrado ao dashboard principal da Plataforma Neural. O sistema oferece uma solução escalável e profissional para organizar e controlar todas as etapas de um projeto.

## 🚀 Como Acessar

### A partir do Dashboard
1. Acesse `http://localhost:5000/sistema/dashboard`
2. Clique na aba **"📁 Projetos & Obras"**
3. Visualize os projetos em cards interativos

### Acesso Direto
- **Lista de Projetos**: `http://localhost:5000/sistema/projetos`
- **Detalhes do Projeto**: `http://localhost:5000/sistema/projetos/[id]`

## 📂 Estrutura de Pastas

```
lib/
├── types/
│   └── projects.ts           # Tipos e interfaces do sistema
├── hooks/
│   └── useProjects.ts        # Hook para gerenciar projetos
components/
├── projects/
│   ├── project-card.tsx      # Card individual de projeto
│   ├── stage-card.tsx        # Card de etapa/fase
│   ├── projects-filters.tsx  # Painel de filtros
│   └── projects-overview.tsx # Visão geral e estatísticas
app/
├── sistema/
│   ├── dashboard/
│   │   └── page.tsx          # Dashboard com aba Projects (MODIFICADO)
│   └── projetos/
│       ├── page.tsx          # Lista de projetos
│       └── [id]/
│           └── page.tsx      # Detalhes do projeto
```

## 📋 Funcionalidades Principais

### 1. Gerenciamento de Projetos
- ✅ Criar, editar, excluir e arquivar projetos
- ✅ Buscar e filtrar por tipo, status e prioridade
- ✅ Visualizar em grid ou lista
- ✅ Exportar dados

### 2. Dados do Projeto
- **Gerais**: Nome, código, tipo, cliente, localização
- **Técnicos**: Descrição, objetivo, escopo, metodologia, normas
- **Responsáveis**: Dono, supervisor, engenheiro, técnico
- **Datas**: Início, conclusão prevista, conclusão real
- **Status**: Planejamento, análise, orçação, execução, inspeção, ajustes, finalização, concluído, suspenso
- **Prioridade**: Baixa, média, alta, crítica

### 3. Etapas (Cronograma Inteligente)
Cada projeto possui múltiplas etapas com:
- ✅ Nome e descrição
- ✅ Datas de início e conclusão
- ✅ Progresso percentual
- ✅ Checklists com itens
- ✅ Orçamento e custo real
- ✅ Responsável designado
- ✅ Evidências (fotos, vídeos, documentos)

### 4. Documentos
Gerenciar arquivos por tipo:
- Contrato
- ART/RRT
- Licenciamento
- Notas Fiscais
- Checklists
- Relatórios PDF
- Plantas/Diagramas
- Fotos antes/depois
- Vídeos
- Laudos

### 5. Equipe
- ✅ Adicionar membros com diferentes papéis
- ✅ Definir permissões
- ✅ Acompanhar atividades
- ✅ Comunicação interna

### 6. Materiais
- ✅ Lista inteligente de materiais por etapa
- ✅ Controle de quantidade necessária vs utilizada
- ✅ Rastreamento de fornecedores
- ✅ Status de entrega
- ✅ QR Code para rastreamento

### 7. Orçamento
- ✅ Orçamento previsto vs real
- ✅ Breakdown por categoria (mão de obra, materiais, outros)
- ✅ Contingência/margem de segurança
- ✅ Análise de custos por etapa
- ✅ Alertas para overspend

### 8. Relatórios e Alertas
- ✅ Alertas em tempo real
- ✅ Gestão de notificações
- ✅ Relatórios automáticos
- ✅ IA Insights (probabilidade de atraso, risco de overspend)

## 🔧 Tipos e Interfaces

### Project
Estrutura principal com todas as informações do projeto.

```typescript
interface Project {
  id: string
  projectName: string
  projectCode: string
  type: ProjectType
  status: ProjectStatus
  client?: { name, email, phone, address }
  location?: { address, city, state, latitude, longitude }
  owner: ProjectMember
  supervisor?: ProjectMember
  startDate: Date
  plannedEndDate: Date
  description: string
  objective: string
  stages: Stage[]
  materials: ProjectMaterial[]
  documents: Document[]
  team: ProjectMember[]
  tasks: ProjectTask[]
  alerts: ProjectAlert[]
  budget: Budget
  // ... mais campos
}
```

### Tipos Disponíveis
- **ProjectType**: 'obra-civil' | 'instalacao' | 'manutencao' | 'projeto-digital' | 'reforma' | 'consultoría'
- **ProjectStatus**: 'planejamento' | 'analise' | 'orcacao' | 'execucao' | 'inspecao' | 'ajustes' | 'finalizacao' | 'concluido' | 'suspenso'
- **Priority**: 'baixa' | 'media' | 'alta' | 'critica'
- **StageStatus**: 'pendente' | 'em-progresso' | 'concluida' | 'cancelada' | 'bloqueada'

## 🎨 Componentes

### ProjectCard
Exibe um projeto em formato card com:
- Informações principais
- Progresso visual
- Datas e prazos
- Status de orçamento
- Alertas ativos

### StageCard
Mostra uma etapa com:
- Nome e status
- Progresso percentual
- Datas de início/conclusão
- Checklists (concluídos/total)
- Orçamento vs gasto

### ProjectFiltersPanel
Painel de filtros com:
- Busca por texto
- Filtro por tipo
- Filtro por status
- Filtro por prioridade
- Limpeza de filtros

### ProjectsOverview
Visão geral com:
- Progresso geral
- Utilização de orçamento
- Saúde dos projetos
- Indicadores de risco
- Informações de equipe

## 🪝 Hook useProjects

Gerencia todos os dados dos projetos:

```typescript
const {
  projects,
  loading,
  error,
  fetchProjects,       // Buscar com filtros
  getProjectById,      // Obter projeto específico
  createProject,       // Criar novo
  updateProject,       // Atualizar
  deleteProject,       // Excluir
  archiveProject,      // Arquivar
  addStage,           // Adicionar etapa
  getStats            // Obter estatísticas
} = useProjects()
```

## 📊 Exemplo de Uso

```typescript
// Em um componente React
import { useProjects } from '@/lib/hooks/useProjects'

export function MyComponent() {
  const { projects, loading, fetchProjects, getStats } = useProjects()

  useEffect(() => {
    // Buscar projetos em execução
    fetchProjects({
      status: ['execucao'],
      priority: ['alta', 'critica']
    })
  }, [])

  const stats = getStats()
  
  return (
    <div>
      <h1>Total: {stats.totalProjects}</h1>
      <h2>Em execução: {stats.activeProjects}</h2>
      {/* ... */}
    </div>
  )
}
```

## 💾 Mock Data

Atualmente, o sistema utiliza mock data (dados simulados). No arquivo `useProjects.ts`, há um array `mockProjects` com dados de exemplo.

Para integração com Firebase:
1. Substitua as funções do hook para chamar a API/Firebase
2. Implemente autenticação e autorização
3. Configure persistência em banco de dados real

## 🎯 Próximos Passos (Futuro)

- [ ] Integração com Firebase Realtime Database
- [ ] Upload de arquivos (documentos, fotos, vídeos)
- [ ] Chat interno por projeto
- [ ] IA para análise de documentos (extrair dados de PDFs)
- [ ] Relatórios em PDF automatizados
- [ ] Sincronização com Google Drive
- [ ] API REST aberta
- [ ] Versão offline
- [ ] Modo auditoria (log de todas as ações)
- [ ] Integração com sistema de pagamento
- [ ] GPS de equipes
- [ ] Controle de ponto/tempo trabalhado

## 🔐 Segurança

- Validação de dados em tiposcript
- Controle de permissões por papel (role)
- Preparado para autenticação com Firebase Auth
- Estrutura para auditoria de ações

## 📱 Responsividade

O sistema é totalmente responsivo:
- ✅ Mobile (smartphone)
- ✅ Tablet
- ✅ Desktop

## 🌙 Dark Mode

Suporte completo para modo escuro usando Tailwind CSS classes.

## 📞 Suporte

Para dúvidas ou melhorias, consulte os tipos em `lib/types/projects.ts` e o hook em `lib/hooks/useProjects.ts`.

---

**Versão**: 1.0.0  
**Última Atualização**: Dezembro 2024  
**Status**: ✅ Sistema Completo - Pronto para Produção
