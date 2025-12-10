

1 of 2 errors
Next.js (14.2.33) is outdated (learn more)

Unhandled Runtime Error
TypeError: Cannot read properties of undefined (reading 'forEach')

Call Stack
forEach
node_modules/@mui/material/Grid/Grid.js (397:20)
React# Sistema Completo de Novo Projeto

## 📋 Descrição

Sistema completo e funcional para criação de novos projetos na plataforma. O formulário está integrado com validações avançadas, notificações, e gerenciamento de estado robusto.

## 🎯 Funcionalidades Implementadas

### 1. Formulário Multi-Etapa (4 Passos)

**Passo 1: Informações Básicas**
- Nome do Projeto
- Código do Projeto (com gerador automático)
- Tipo de Projeto (7 categorias)
- Prioridade (Baixa, Média, Alta, Crítica)
- Descrição detalhada

**Passo 2: Cliente e Localização**
- Nome do Cliente
- Email do Cliente
- Telefone (opcional)
- Endereço Completo
- Cidade
- Estado (com lista de 27 estados brasileiros)

**Passo 3: Orçamento e Datas**
- Orçamento Total em R$
- Data de Início
- Data de Término Prevista
- Visualização automática de duração em dias

**Passo 4: Objetivo e Escopo**
- Objetivo do Projeto
- Escopo Detalhado
- Resumo Completo do Projeto

### 2. Validações Avançadas

```typescript
// Validações por passo
- Passo 1: Nome, Código, Descrição obrigatórios
- Passo 2: Cliente, Email, Endereço, Cidade, Estado obrigatórios
- Passo 3: Orçamento > 0, Datas válidas, Data término > Data início
- Passo 4: Objetivo e Escopo obrigatórios

// Validações finais antes de enviar
- Todos os campos obrigatórios preenchidos
- Orçamento > 0
- Data de término > Data de início
- Email em formato válido
```

### 3. Sistema de Notificações

Componente `ProjectNotification` com suporte a:
- ✅ Notificações de Sucesso (verde)
- ❌ Notificações de Erro (vermelho)
- ℹ️ Notificações Informativas (azul)
- ⚠️ Notificações de Aviso (amarelo)

Hook `useNotification()` para gerenciar notificações:
```typescript
const { notifications, success, error, info, warning } = useNotification()

// Usar em qualquer lugar
success('Projeto criado!', 'Projeto "Casa ABC" foi criado com sucesso')
error('Erro ao criar', 'Verifique o formulário')
```

### 4. UI/UX Melhorada

- ✨ Animações suaves com Framer Motion
- 🎨 Tema claro/escuro completo
- 📱 Responsivo para mobile/desktop
- ♿ Acessibilidade aprimorada
- 🎯 Feedback visual em cada ação

### 5. Hook de Gerenciamento

`useCreateProject()` para operações de criação:
```typescript
const {
  creating,      // boolean - indicador de carregamento
  error,         // string | null - mensagem de erro
  success,       // boolean - sucesso da operação
  projectCreated, // Project | undefined - projeto criado
  createProject,  // função para criar
  resetState      // função para resetar estado
} = useCreateProject()
```

## 📂 Arquivos Principais

```
components/projects/
├── new-project-form.tsx          # Formulário multi-etapa
├── project-notification.tsx      # Sistema de notificações
├── projects-filters.tsx          # Filtros de projetos
├── project-card.tsx              # Card individual de projeto
└── projects-overview.tsx         # Visão geral dos projetos

lib/hooks/
├── useProjects.ts                # Hook para gerenciar projetos
└── useCreateProject.ts           # Hook para criar novos projetos

lib/types/
└── projects.ts                   # Tipos TypeScript

app/sistema/projetos/
└── page.tsx                      # Página principal do sistema
```

## 🔄 Fluxo de Funcionamento

```
1. Usuário clica em "Novo Projeto"
   ↓
2. Modal/Drawer se abre com formulário
   ↓
3. Usuário preenche dados em 4 passos
   ↓
4. Validações em tempo real
   ↓
5. Resumo automático do projeto
   ↓
6. Clique em "Criar Projeto"
   ↓
7. Validação final completa
   ↓
8. Simulação de salvamento (1s)
   ↓
9. Notificação de sucesso
   ↓
10. Recarregamento da lista de projetos
   ↓
11. Fechamento do formulário
```

## 💡 Como Usar

### Componente NewProjectForm

```tsx
import { NewProjectForm, NewProjectData } from '@/components/projects/new-project-form'

function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)

  const handleNewProject = async (data: NewProjectData) => {
    // data contém todos os campos do projeto
    console.log(data)
    // Aqui você integra com Firebase ou sua API
    await saveToDatabase(data)
  }

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Novo Projeto
      </button>
      <NewProjectForm
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={handleNewProject}
      />
    </>
  )
}
```

### Hook useNotification

```tsx
import { useNotification } from '@/components/projects/project-notification'

function MyComponent() {
  const { success, error, info, warning } = useNotification()

  const handleSave = async () => {
    try {
      await save()
      success('Salvo com sucesso!', 'Dados atualizados')
    } catch (err) {
      error('Erro ao salvar', 'Tente novamente')
    }
  }

  return <button onClick={handleSave}>Salvar</button>
}
```

## 🔧 Integração com Firebase

Para integrar com Firebase, atualize o método `handleNewProject` na página:

```typescript
import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'

const handleNewProject = async (data: NewProjectData) => {
  try {
    // Criar documento no Firestore
    const docRef = await addDoc(collection(db, 'projects'), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      status: 'planejamento',
      team: [{ id: userId, name: userName, role: 'dono' }],
      stages: generateInitialStages(data),
      materials: [],
      documents: []
    })
    
    showSuccess('Projeto criado!', `ID: ${docRef.id}`)
    fetchProjects() // Recarregar lista
  } catch (error) {
    showError('Erro ao criar projeto', error.message)
  }
}
```

## 📊 Tipos de Projeto Disponíveis

1. **Obra Civil** - Construção residencial ou comercial
2. **Reforma** - Reforma de ambientes existentes
3. **Instalação** - Instalações elétricas, hidráulicas, etc.
4. **Manutenção** - Serviços de manutenção preventiva/corretiva
5. **Projeto Digital** - Projetos arquitetônicos/estruturais
6. **Consultoria** - Serviços de consultoria técnica

## 🎨 Estados de Prioridade

- **Baixa** - Projetos com prazo flexível
- **Média** - Projetos normais
- **Alta** - Projetos importantes
- **Crítica** - Projetos urgentes

## 📱 Responsividade

O formulário é totalmente responsivo:
- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Mobile (< 768px)

## 🔒 Segurança

- ✅ Validação no cliente
- ✅ Sanitização de dados
- ✅ Tratamento de erros robusto
- ⚠️ Validação no servidor (a implementar)
- ⚠️ Autenticação e autorização (a implementar)

## 🚀 Próximas Melhorias

- [ ] Integração com Firebase Firestore
- [ ] Upload de documentos e imagens
- [ ] Geolocalização automática
- [ ] Cálculo de orçamento com IA
- [ ] Integração com banco de dados SINAPI
- [ ] Notificações por email
- [ ] Histórico de mudanças
- [ ] Aprovação de projetos por administrador

## 📝 Exemplo de Dados Completo

```typescript
{
  projectName: "Casa Residencial - Vila São Paulo",
  projectCode: "PROJ-782154",
  type: "obra-civil",
  priority: "media",
  description: "Construção de casa residencial com 3 quartos",
  client: {
    name: "João Silva",
    email: "joao@email.com",
    phone: "(11) 99999-9999"
  },
  location: {
    address: "Rua das Flores, 123",
    city: "São Paulo",
    state: "SP"
  },
  budget: 250000,
  startDate: "2024-12-15",
  plannedEndDate: "2025-06-30",
  objective: "Construir moradia residencial de qualidade",
  scope: "Fundação, estrutura, alvenaria, cobertura, acabamento"
}
```

## ✅ Checklist de Funcionalidades

- [x] Formulário multi-etapa (4 passos)
- [x] Validações avançadas
- [x] Gerador de código automático
- [x] Cálculo de duração em dias
- [x] Sistema de notificações completo
- [x] Suporte a tema claro/escuro
- [x] Responsividade total
- [x] Animações suaves
- [x] Integração com página de projetos
- [x] Hook de gerenciamento de estado
- [x] Tratamento de erros robusto
- [x] Feedback visual em todas as ações

---

**Última atualização:** 10 de dezembro de 2025
