# Sistema de Criação de Projetos - Documentação

## Visão Geral

O sistema de criação de projetos foi completamente implementado com um fluxo intuitivo de 4 etapas, garantindo que todos os dados necessários sejam capturados de forma organizada e validada.

## Arquivos Criados/Modificados

### 1. **components/projects/new-project-form.tsx** ✨ NOVO
Componente principal que implementa o formulário de criação de projetos em um drawer.

**Características:**
- ✅ Formulário em 4 etapas com validação progressiva
- ✅ Interface intuitiva com indicadores de progresso
- ✅ Suporte a múltiplos tipos de projetos
- ✅ Definição de prioridades com badges coloridas
- ✅ Geração automática de código de projeto
- ✅ Cálculo automático de duração do projeto
- ✅ Feedback visual com estados de sucesso/erro
- ✅ Estados de carregamento e validação

**Etapas do Formulário:**

#### Etapa 1: Informações Básicas
- Nome do projeto
- Código do projeto (com geração automática)
- Tipo de projeto (obra-civil, reforma, instalação, manutenção, projeto-digital, consultoria)
- Prioridade (baixa, média, alta, crítica)
- Descrição do projeto

#### Etapa 2: Cliente e Localização
- Nome do cliente
- Email e telefone do cliente
- Endereço completo
- Cidade e estado

#### Etapa 3: Orçamento e Datas
- Orçamento total (em R$)
- Data de início
- Data de término prevista
- Cálculo automático de duração

#### Etapa 4: Objetivo e Escopo
- Objetivo do projeto
- Escopo detalhado
- Resumo completo do projeto

### 2. **lib/hooks/useCreateProject.ts** ✨ NOVO
Hook customizado para gerenciar a lógica de criação de projetos.

**Funcionalidades:**
- Validação completa de dados
- Criação de objeto Project com estrutura completa
- Criação automática de estágios iniciais
- Inicialização de orçamento
- Estado de carregamento, erro e sucesso

### 3. **app/sistema/projetos/page.tsx** ✏️ MODIFICADO
Página principal de gestão de projetos atualizada.

**Mudanças:**
- Importação do componente `NewProjectForm`
- Estado `newProjectOpen` para controlar o drawer
- Função `handleNewProject` para processar submissão
- Botões "Novo Projeto" agora funcionais em dois lugares:
  - Header principal
  - Card de "Nenhum projeto encontrado"

## Como Usar

### Abrir o Formulário de Novo Projeto

```tsx
import { useState } from 'react'
import { NewProjectForm } from '@/components/projects/new-project-form'

export default function MyComponent() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        Novo Projeto
      </button>

      <NewProjectForm
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSubmit={async (data) => {
          // Processar dados do projeto
          console.log('Novo projeto:', data)
        }}
      />
    </>
  )
}
```

### Integração com Firebase

Para integrar com Firebase, adicione a seguinte lógica no arquivo `lib/hooks/useCreateProject.ts`:

```typescript
import { db } from '@/lib/firebase'
import { collection, addDoc } from 'firebase/firestore'

// Dentro da função createProject, após criar o objeto newProject:
const docRef = await addDoc(collection(db, 'projects'), newProject)
newProject.id = docRef.id // Atualizar com ID do Firebase
```

## Fluxo de Dados

```
Usuário clica "Novo Projeto"
        ↓
Drawer abre com Formulário
        ↓
Preenche Etapa 1: Informações Básicas
        ↓
Valida e avança para Etapa 2
        ↓
Preenche Etapa 2: Cliente e Localização
        ↓
Valida e avança para Etapa 3
        ↓
Preenche Etapa 3: Orçamento e Datas
        ↓
Valida e avança para Etapa 4
        ↓
Preenche Etapa 4: Objetivo e Escopo
        ↓
Clica "Criar Projeto"
        ↓
Valida todos os dados
        ↓
Chama onSubmit(data)
        ↓
Mostra sucesso ou erro
        ↓
Fecha drawer e recarrega lista
```

## Estrutura de Dados

O objeto `NewProjectData` contém:

```typescript
interface NewProjectData {
  projectName: string           // Nome do projeto
  projectCode: string           // Código único
  type: ProjectType             // Tipo de projeto
  description: string           // Descrição
  priority: Priority            // Prioridade
  client: {
    name: string                // Nome do cliente
    email: string               // Email
    phone: string               // Telefone
  }
  location: {
    address: string             // Endereço
    city: string                // Cidade
    state: string               // Estado (UF)
  }
  budget: number                // Orçamento em R$
  startDate: string             // Data de início (YYYY-MM-DD)
  plannedEndDate: string        // Data fim (YYYY-MM-DD)
  objective: string             // Objetivo
  scope: string                 // Escopo
}
```

## Validações Implementadas

- ✅ Nome do projeto obrigatório
- ✅ Código do projeto obrigatório (com geração automática)
- ✅ Descrição obrigatória
- ✅ Nome do cliente obrigatório
- ✅ Email do cliente obrigatório
- ✅ Endereço obrigatório
- ✅ Cidade obrigatória
- ✅ Orçamento > 0
- ✅ Data de início obrigatória
- ✅ Data de término obrigatória
- ✅ Data de término > data de início
- ✅ Objetivo obrigatório
- ✅ Escopo obrigatório

## Estados do Componente

### Loading
Exibido durante o envio do formulário

### Sucesso
Mensagem verde com CheckCircle2, fecha após 2 segundos

### Erro
Mensagem vermelha com AlertCircle, permite correção

## Personalização

### Alterar cores
Edite as classes Tailwind em `NewProjectForm`:
- `bg-gold-500` → Cor primária
- `bg-green-500` → Cor de sucesso
- `bg-red-500` → Cor de erro

### Adicionar mais etapas
1. Atualize o array `steps`
2. Adicione novo `if (step === 5)` bloco
3. Atualize validação em `validateStep`

### Alterar tipos de projeto
Edite o array `projectTypes` em `new-project-form.tsx`

## Próximas Integrações

1. **Firebase Realtime Database** - Para persistência
2. **Autenticação** - Usar usuário logado como owner
3. **Notificações** - Toast/Notification ao criar
4. **Email** - Enviar confirmação para cliente
5. **Storage** - Permitir upload de documentos
6. **Analytics** - Rastrear criação de projetos

## Troubleshooting

### Formulário não abre?
- Verifique se `isOpen={true}` está sendo passado
- Confira se `DrawerContent` está importado corretamente

### Validação não funciona?
- Verifique se `validateStep()` está sendo chamado
- Confira mensagens de erro em `error` state

### Dados não salvam?
- Verifique implementação de `onSubmit`
- Adicione console.log para debug
- Teste com Firebase emulator

## Funcionalidades Completas Implementadas

✅ Formulário em 4 etapas  
✅ Validação progressiva  
✅ Geração automática de código  
✅ Cálculo de duração  
✅ Estados visuais (loading, sucesso, erro)  
✅ Integração com página de projetos  
✅ Estrutura completa de Project criada  
✅ Estágios iniciais automáticos  
✅ Orçamento inicializado  
✅ Equipe inicializada com owner  
✅ Resposta responsiva (mobile/desktop)  
✅ Dark mode completo  
✅ Animações suaves (Framer Motion)  
✅ Acessibilidade (labels, inputs)  
✅ Feedback visual em tempo real  
