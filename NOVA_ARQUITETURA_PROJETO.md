# ARQUITETURA - SISTEMA DE NOVO PROJETO

## 🏗️ Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────┐
│                    app/sistema/projetos                     │
│                      (page.tsx)                             │
└──────────────────────────┬──────────────────────────────────┘
                           │
                ┌──────────┼──────────┐
                │          │          │
         ┌──────▼───┐  ┌───▼──────┐ ┌▼──────────────┐
         │  Botão   │  │  useProjects │ useNotification │
         │Novo      │  │  Hook        │  Hook           │
         │Projeto   │  └──────────┘  └────────────────┘
         └──────┬───┘
                │
         ┌──────▼──────────────────────┐
         │  NewProjectForm              │
         │  (new-project-form.tsx)      │
         │                              │
         │  ┌────────────────────────┐ │
         │  │ Step 1: Básicas        │ │
         │  ├────────────────────────┤ │
         │  │ Step 2: Cliente        │ │
         │  ├────────────────────────┤ │
         │  │ Step 3: Orçamento      │ │
         │  ├────────────────────────┤ │
         │  │ Step 4: Objetivo       │ │
         │  └────────────────────────┘ │
         │                              │
         │  + Validações              │
         │  + Gerador de Código       │
         │  + Cálculo de Duração      │
         │  + Estados de Erro/Sucesso │
         └──────┬───────────────────────┘
                │
         ┌──────▼──────────────────────┐
         │  ProjectNotification         │
         │  (project-notification.tsx)  │
         │                              │
         │  • Success (Verde)           │
         │  • Error (Vermelho)          │
         │  • Info (Azul)               │
         │  • Warning (Amarelo)         │
         └──────────────────────────────┘
```

---

## 📊 Fluxo de Dados

```
Usuario Input
    │
    ▼
┌─────────────────┐
│ Validação       │ ◄── validateStep()
│ em Tempo Real   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Próximo Passo   │
│ ou Anterior     │
└────────┬────────┘
         │
    ┌────┴────────────────────────┐
    │ (Passo Final)               │
    │ Validação Final Completa    │
    │                             │
    ▼                             ▼
┌─────────────────┐    ┌──────────────┐
│ Erro Detected   │    │ Tudo OK      │
└────────┬────────┘    └───────┬──────┘
         │                     │
         ▼                     ▼
  ┌────────────┐      ┌─────────────────┐
  │ Mostrar    │      │ Simulação de    │
  │ Notificação│      │ Salvamento (1s) │
  │ de Erro    │      └────────┬────────┘
  └────────────┘               │
                               ▼
                       ┌──────────────────┐
                       │ onSubmit Handler │
                       │ (dados validados)│
                       └────────┬─────────┘
                                │
                    ┌───────────┴───────────┐
                    │ Firebase Integration   │
                    │ ou API Call            │
                    └───────────┬───────────┘
                                │
                    ┌───────────▼────────┐
                    │ Sucesso ou Erro    │
                    └───────────┬────────┘
                                │
                    ┌───────────▼──────────┐
                    │ Notificação de       │
                    │ Sucesso/Erro Exibida │
                    └───────────┬──────────┘
                                │
                    ┌───────────▼──────────┐
                    │ Recarregar Projetos  │
                    │ ou Fechar Modal      │
                    └──────────────────────┘
```

---

## 🔄 Estado do Componente

```typescript
Interface NewProjectData {
  projectName: string           // Obrigatório
  projectCode: string           // Obrigatório (gerado)
  type: ProjectType             // Obrigatório (6 opções)
  description: string           // Obrigatório
  priority: Priority            // Obrigatório (4 opções)
  client: {
    name: string               // Obrigatório
    email: string              // Obrigatório
    phone: string              // Opcional
  }
  location: {
    address: string            // Obrigatório
    city: string               // Obrigatório
    state: string              // Obrigatório (27 opções)
  }
  budget: number               // Obrigatório (> 0)
  startDate: string            // Obrigatório (YYYY-MM-DD)
  plannedEndDate: string       // Obrigatório (YYYY-MM-DD)
  objective: string            // Obrigatório
  scope: string                // Obrigatório
}
```

---

## 🎯 Estados Possíveis

```
INICIAL
  │
  ├─► CARREGANDO (loading = true)
  │     │
  │     ├─► SUCESSO (success = true)
  │     │     │
  │     │     └─► FECHANDO MODAL
  │     │
  │     └─► ERRO (error = "mensagem")
  │           │
  │           └─► CORRIGINDO DADOS
  │
  └─► VALIDAÇÃO
        │
        ├─► Passo Inválido ──► Mostrar Erro
        │
        └─► Tudo OK ─────────► Próximo Passo
```

---

## 💾 Persistência (Firebase Integration)

```
NewProjectData
    │
    ▼
┌──────────────────────────┐
│ Salvar em Firestore      │
│                          │
│ collection('projects')   │
│   - projectName          │
│   - projectCode          │
│   - type                 │
│   - status: 'planejamento'
│   - createdAt            │
│   - createdBy: userId    │
│   - team: [owner]        │
│   - stages: []           │
│   - materials: []        │
│   - documents: []        │
│   - tasks: []            │
│   - alerts: []           │
└──────────────┬───────────┘
               │
               ▼
        ┌─────────────┐
        │ Sucesso ou  │
        │ Erro        │
        └─────────────┘
```

---

## 🔐 Validações por Camada

### 1. Validação no Cliente (Formulário)
```
├─ Passo 1: Básicas
│   ├─ Nome não vazio
│   ├─ Código não vazio
│   └─ Descrição não vazia
│
├─ Passo 2: Cliente
│   ├─ Nome cliente não vazio
│   ├─ Email válido
│   ├─ Endereço não vazio
│   ├─ Cidade não vazia
│   └─ Estado selecionado
│
├─ Passo 3: Orçamento
│   ├─ Orçamento > 0
│   ├─ Data início selecionada
│   ├─ Data término selecionada
│   └─ Término > Início
│
└─ Passo 4: Objetivo
    ├─ Objetivo não vazio
    └─ Escopo não vazio
```

### 2. Validação Final
```
✓ Todos os campos obrigatórios preenchidos
✓ Orçamento > 0
✓ Datas válidas e em sequência
✓ Email em formato correto
✓ Texto sem caracteres inválidos
```

### 3. Validação no Servidor (A Implementar)
```
✓ Autenticação do usuário
✓ Autorização para criar projetos
✓ Duplicação de código de projeto
✓ Limites de projetos por usuário
✓ Validação de SINAPI (se houver integração)
```

---

## 📱 Responsividade

```
Desktop (1200px+)
┌────────────────────────────────────┐
│  Drawer com 90% da altura          │
│  Campos em grid de 2 colunas       │
│  Botões lado a lado                │
└────────────────────────────────────┘

Tablet (768px - 1199px)
┌──────────────────────┐
│  Drawer com 90%      │
│  Campos dinâmicos    │
│  Botões empilhados   │
└──────────────────────┘

Mobile (< 768px)
┌─────────────┐
│Drawer 100%  │
│Campos 1 col │
│Botões stack │
└─────────────┘
```

---

## 🎨 Sistema de Notificações

```
Hook useNotification()
│
├─ state: notifications[]
│   └─ { id, type, title, message, duration, action }
│
├─ method: success(title, message?)
├─ method: error(title, message?)
├─ method: info(title, message?)
├─ method: warning(title, message?)
├─ method: add(notification)
├─ method: remove(id)
└─ method: resetState()

ProjectNotification Component
│
├─ Props:
│   ├─ type: 'success' | 'error' | 'info' | 'warning'
│   ├─ title: string
│   ├─ message?: string
│   ├─ duration?: number (default: 5000)
│   ├─ onClose?: callback
│   └─ action?: { label, onClick }
│
├─ Features:
│   ├─ Auto-dismiss
│   ├─ Ícone dinâmico
│   ├─ Tema claro/escuro
│   ├─ Animações suaves
│   └─ Botão de fechar
│
└─ Container:
    └─ fixed top-6 right-6 z-50
```

---

## 🔄 Ciclo de Vida do Componente

```
MONTAGEM
  │
  ├─► useState (formData, step, loading, error, success)
  │
  ├─► useCallback (handlers: Input, Select, Generate, etc.)
  │
  └─► Render Form

INTERAÇÃO
  │
  ├─► Usuário digita
  │     └─► handleInputChange atualiza state
  │
  ├─► Usuário clica Next
  │     └─► validateStep verifica se pode avançar
  │
  ├─► Usuário clica Criar
  │     └─► handleSubmit valida e envia dados
  │
  └─► Notificação aparece
        └─► Auto-dismiss após 5s

DESMONTAGEM
  │
  └─► resetForm() limpa estados
```

---

## 🚀 Performance

```
Otimizações Implementadas:
├─ useCallback para funções de handler
├─ Validação apenas quando necessário
├─ Animações com Framer Motion (GPU)
├─ Código gerado com timestamp (garantido único)
├─ Debounce em mudanças de campo
└─ Lazy loading de componentes (via Drawer)
```

---

## 📋 Checklist de Implementação

- [x] Formulário com 4 passos
- [x] Validações por passo
- [x] Validação final completa
- [x] Gerador de código automático
- [x] Cálculo de duração em dias
- [x] Sistema de notificações completo
- [x] Hook useCreateProject aprimorado
- [x] Integração com página de projetos
- [x] Suporte a dark mode
- [x] Animações suaves
- [x] Tratamento de erros robusto
- [x] Feedback visual em todas as ações
- [x] Documentação detalhada
- [x] Exemplos de uso práticos
- [x] Sem erros de TypeScript

---

## 📝 Próximas Implementações

```
Fase 2 - Backend Integration:
  ├─ Firebase Firestore
  ├─ Cloud Functions
  ├─ Autenticação
  └─ Real-time Sync

Fase 3 - Features Avançadas:
  ├─ Upload de documentos
  ├─ Geolocalização automática
  ├─ Cálculo de orçamento com IA
  ├─ Integração SINAPI
  └─ Notificações por email

Fase 4 - Otimizações:
  ├─ Performance (lazy loading)
  ├─ Caching (IndexedDB)
  ├─ Offline Mode
  └─ PWA Support
```

---

**Arquitetura Documentada:** 10 de dezembro de 2025
**Versão:** 1.0
**Pronto para Integração:** ✅ SIM
