# 🚀 Guia Rápido - Sistema de Gestão de Projetos/Obras

## ⚡ Inicialização Rápida

### 1. Acessar a Aplicação
```bash
npm run dev
# Acesse: http://localhost:5000/sistema/dashboard
```

### 2. Principais URLs

| Página | URL | Descrição |
|--------|-----|-----------|
| Dashboard (com projetos) | `/sistema/dashboard` | Visão geral com aba de Projetos |
| Lista de Projetos | `/sistema/projetos` | Todos os projetos com filtros |
| Detalhes do Projeto | `/sistema/projetos/[id]` | Página completa com 7 abas |

---

## 🎯 Como Navegar

### No Dashboard
1. Acesse `http://localhost:5000/sistema/dashboard`
2. Localizar as duas abas no topo:
   - 🧠 **Plataforma Neural IA** (existente)
   - 📁 **Projetos & Obras** (NOVA!)
3. Clique na aba "Projetos & Obras"
4. Veja:
   - Cards de estatísticas
   - Preview dos primeiros 6 projetos
   - Botão "Ver Todos os Projetos"

### Na Lista de Projetos
1. Clique em "Ver Todos os Projetos" ou acesse `/sistema/projetos`
2. Use os filtros:
   - 🔍 Busca rápida por texto
   - 📝 Filtro por tipo de projeto
   - ✅ Filtro por status
   - ⭐ Filtro por prioridade
3. Alterne entre visualizações:
   - 📊 Grid (3 colunas)
   - 📋 Lista (1 coluna)
4. Clique em um projeto para ver detalhes

### No Detalhe do Projeto
Navegue pelas 7 abas:
1. **📋 Resumo** - Informações gerais
2. **⚙️ Etapas** - Cronograma e progresso
3. **📄 Documentos** - Arquivos do projeto
4. **👥 Equipe** - Membros e responsáveis
5. **📦 Materiais** - Lista de materiais
6. **💰 Financeiro** - Orçamento e custos
7. **⚠️ Alertas** - Notificações

---

## 📊 Dados de Teste

O sistema vem com 1 projeto de exemplo:

**Casa Residencial - Vila São Paulo**
- Código: PROJ-001
- Status: 65% completo
- Orçamento: R$ 250.000
- Etapas: 4 fases

Você pode:
- ✅ Ver todas as informações
- ✅ Explorar as 7 abas
- ✅ Entender a estrutura completa
- ✅ Usar como referência para novos projetos

---

## 🔧 Funcionalidades Principais

### Em Qualquer Página

| Funcionalidade | Onde | Como |
|---|---|---|
| **Buscar** | Qualquer lista | Use a barra de busca |
| **Filtrar** | Lista de Projetos | Clique em "Filtros" |
| **Criar Novo** | Dashboard/Projetos | Botão "+ Novo Projeto" |
| **Exportar** | Lista de Projetos | Botão "Exportar" |
| **Dark Mode** | Qualquer página | Use o toggle de tema |

### No Detalhe do Projeto

| Funcionalidade | Onde | Como |
|---|---|---|
| **Voltar** | Topo | Clique em "Voltar" |
| **Compartilhar** | Topo | Clique em ícone de compartilhamento |
| **Download** | Topo | Clique em ícone de download |
| **Mais Opções** | Topo | Clique em "..." |

---

## 🎨 Elementos Visuais

### Cards de Projeto Mostram:
- ✅ Nome e código
- ✅ Status com cor
- ✅ Prioridade
- ✅ Cliente
- ✅ Localização
- ✅ Datas de início/conclusão
- ✅ Progresso em %
- ✅ Orçamento (previsto/gasto)
- ✅ Número de membros da equipe
- ✅ Alertas ativos

### Cards de Etapa Mostram:
- ✅ Nome e descrição
- ✅ Status (Pendente/Em Progresso/Concluída)
- ✅ Progresso percentual
- ✅ Datas
- ✅ Checklists (concluído/total)
- ✅ Orçamento
- ✅ Responsável

---

## 💡 Dicas de Uso

### Para Explorar o Sistema
1. Vá ao Dashboard
2. Clique em "Projetos & Obras"
3. Clique em um projeto para ver todos os detalhes
4. Explore cada uma das 7 abas
5. Observe como as informações se organizam

### Para Testar Filtros
1. Vá para "Ver Todos os Projetos"
2. Clique em "Filtros"
3. Selecione tipo, status ou prioridade
4. Veja os resultados atualizarem
5. Alterne entre grid e lista

### Para Entender os Dados
1. Abra o Detalhes do Projeto
2. Vá para a aba "Resumo"
3. Leia as informações organizadas
4. Clique em outras abas para ver mais

---

## 🔄 Fluxo de Navegação

```
Dashboard
    ↓
┌─────────────────────────┬──────────────────────┐
│ Plataforma Neural IA    │ 📁 Projetos & Obras  │ ← Clique aqui
└─────────────────────────┴──────────────────────┘
    ↓
    Veja Preview (6 projetos)
    ↓
    Clique em um projeto
    OU
    "Ver Todos os Projetos"
    ↓
    Lista Completa
    ↓
    Clique em um projeto
    ↓
    Detalhes Completos (7 abas)
```

---

## 🎯 Casos de Uso

### Gerente de Projetos
1. Acessar Dashboard para visão geral
2. Clicar em "Projetos & Obras" para status rápido
3. Ir para "Ver Todos" para lista detalhada
4. Clicar no projeto para monitorar progresso
5. Verificar aba "Alertas" para problemas

### Supervisor de Obra
1. Acessar projeto direto (`/sistema/projetos/[id]`)
2. Verificar aba "Etapas" para cronograma
3. Atualizar aba "Documentos" com evidências
4. Ver aba "Equipe" para responsáveis
5. Consultar aba "Materiais" para compras

### Financeiro
1. Acessar projeto
2. Ir para aba "Financeiro"
3. Ver orçamento previsto vs real
4. Analisar breakdown de custos
5. Identificar projetos acima do orçamento

### Cliente
1. Acessar seu projeto
2. Verificar aba "Resumo" para status geral
3. Consultar aba "Documentos" para arquivos
4. Ver aba "Etapas" para cronograma
5. Acompanhar progresso em %

---

## 🚨 Indicadores Importantes

### Status do Projeto (Cores)
- 🔵 **Planejamento** - Azul
- 🟣 **Análise** - Roxo
- 🟠 **Orçação** - Laranja
- 🟨 **Execução** - Âmbar
- 🟢 **Concluído** - Verde
- 🔴 **Suspenso** - Vermelho

### Prioridades (Badges)
- ◆ Baixa - Cinza
- ◆ Média - Amarelo
- ◆ Alta - Laranja
- ◆ Crítica - Vermelho

### Alertas
- 🔴 Acima do orçamento
- ⏰ Atrasado
- ⚠️ Documento vencido
- ✅ Progresso normal

---

## 📱 Responsividade

O sistema funciona perfeitamente em:
- ✅ **Desktop** - Layout completo com 3 colunas
- ✅ **Tablet** - Layout ajustado com 2 colunas
- ✅ **Mobile** - Layout de 1 coluna, otimizado para toque

---

## 🌙 Tema Escuro

Todo o sistema suporta dark mode:
- Use o toggle de tema no canto superior direito
- Todas as cores se ajustam automaticamente
- Mantém a legibilidade em ambos os modos

---

## ❓ Perguntas Frequentes

**P: Onde vejo meus projetos?**  
R: Dashboard → Aba "Projetos & Obras" ou `/sistema/projetos`

**P: Como criar um novo projeto?**  
R: Clique em "+ Novo Projeto" (em desenvolvimento)

**P: Como filtrar projetos?**  
R: Vá para `/sistema/projetos` e clique em "Filtros"

**P: Onde vejo o orçamento?**  
R: Detalhes do projeto → Aba "Financeiro"

**P: Como adicionar membros?**  
R: Detalhes do projeto → Aba "Equipe" (em desenvolvimento)

**P: Posso exportar os dados?**  
R: Sim, use o botão "Exportar" na lista de projetos

---

## 🔗 Links Úteis

- 📖 [Documentação Técnica](./PROJECTS_SYSTEM_README.md)
- 📋 [Resumo de Implementação](./IMPLEMENTATION_SUMMARY.md)
- 🔧 [Tipos e Interfaces](./lib/types/projects.ts)
- 🎣 [Hook useProjects](./lib/hooks/useProjects.ts)

---

## 📞 Próximas Etapas

1. ✅ Sistema básico funcionando
2. ⏳ Integração com Firebase (em breve)
3. ⏳ Upload de arquivos (em breve)
4. ⏳ Criação/edição de projetos (em breve)
5. ⏳ Chat interno (em breve)

---

**Versão:** 1.0.0  
**Data:** Dezembro 2024  
**Status:** ✅ Pronto para Uso
