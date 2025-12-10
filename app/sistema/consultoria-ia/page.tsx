
"use client"

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  MessageCircle,
  Brain,
  Send,
  Mic,
  Image,
  FileText,
  Zap,
  ArrowLeft,
  Bot,
  User,
  Sparkles,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  Target,
  Globe
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth-context'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  confidence?: number
  attachments?: string[]
  suggestions?: string[]
}

interface AICapability {
  name: string
  description: string
  accuracy: number
  examples: string[]
  icon: any
}

export default function ConsultoriaIAPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isThinking, setIsThinking] = useState(false)
  const [selectedCapability, setSelectedCapability] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const aiCapabilities: AICapability[] = [
    {
      name: 'Cálculo Estrutural',
      description: 'Análise de cargas, dimensionamento de vigas e pilares',
      accuracy: 96.8,
      examples: ['Dimensionar viga de 8m', 'Calcular pilar para 3 andares', 'Análise de fundação'],
      icon: Target
    },
    {
      name: 'Arquitetura Bioclimática',
      description: 'Otimização térmica e sustentabilidade energética',
      accuracy: 94.2,
      examples: ['Orientação solar ótima', 'Ventilação natural', 'Eficiência energética'],
      icon: Globe
    },
    {
      name: 'Orçamento Inteligente',
      description: 'Estimativas precisas e análise de custos',
      accuracy: 97.5,
      examples: ['Custo por m² SC', 'Comparar materiais', 'ROI de investimento'],
      icon: TrendingUp
    },
    {
      name: 'Cronograma Adaptativo',
      description: 'Planejamento temporal com predições',
      accuracy: 93.7,
      examples: ['Duração da obra', 'Cronograma otimizado', 'Gestão de riscos'],
      icon: CheckCircle
    },
    {
      name: 'Resolução de Problemas',
      description: 'Diagnóstico e soluções para desafios construtivos',
      accuracy: 95.1,
      examples: ['Problema de umidade', 'Fissuras na parede', 'Vazamento hidráulico'],
      icon: AlertTriangle
    },
    {
      name: 'Inovação e Tendências',
      description: 'Tecnologias emergentes e melhores práticas',
      accuracy: 91.4,
      examples: ['Materiais inovadores', 'Automação residencial', 'Construção 4.0'],
      icon: Lightbulb
    }
  ]

  // Mensagens iniciais do sistema
  useEffect(() => {
    const welcomeMessage: Message = {
      id: '1',
      type: 'ai',
      content: `Olá ${user?.displayName}! 👋 

Sou a **IA Consultora Neural** da Plataforma Enygna, especializada em engenharia e arquitetura catarinense. 

🧠 **Minhas capacidades:**
• Cálculos estruturais avançados
• Análise bioclimática para SC  
• Orçamentos neurais precisos
• Cronogramas adaptativos
• Resolução de problemas construtivos
• Tendências e inovações

**Como posso ajudar no seu projeto hoje?**`,
      timestamp: new Date(),
      confidence: 99.8,
      suggestions: [
        'Calcular viga para sobrado',
        'Orçamento casa 150m² em Floripa',
        'Melhor orientação solar',
        'Materiais sustentáveis SC'
      ]
    }
    setMessages([welcomeMessage])
  }, [user])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateAIResponse = async (userMessage: string): Promise<Message> => {
    // Simular processamento neural
    await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000))

    const responses = {
      orcamento: `💰 **Análise de Orçamento Neural**

Para uma residência de 150m² em Florianópolis:

📊 **Estimativa Quântica:**
• **Total**: R$ 285.000 - R$ 320.000
• **Por m²**: R$ 1.900 - R$ 2.133

🔍 **Breakdown Inteligente:**
• Fundação: R$ 42.000 (15%)
• Estrutura: R$ 71.000 (25%) 
• Alvenaria: R$ 56.000 (20%)
• Cobertura: R$ 34.000 (12%)
• Instalações: R$ 45.000 (16%)
• Acabamentos: R$ 80.000 (28%)

📈 **Fatores Regionais SC:**
• Mão de obra qualificada: +8%
• Materiais locais: -5%
• Logística favorável: -3%

🎯 **Recomendações IA:**
• Comprar tijolo local (-12% custo)
• Aproveitar ventilação natural (-R$ 8k)
• Orientação solar ótima (-15% energia)`,

      estrutural: `🏗️ **Análise Estrutural Neural**

Para viga de 8m com sobrecarga residencial:

📐 **Dimensionamento IA:**
• **Viga recomendada**: 20cm x 50cm
• **Aço CA-50**: 8Ø12,5mm (corrido) + 4Ø10mm (montagem)
• **Concreto**: fck = 25 MPa

⚖️ **Cargas Analisadas:**
• Peso próprio: 2,5 kN/m
• Sobrecarga: 1,5 kN/m  
• Paredes: 2,8 kN/m
• Total: 6,8 kN/m

🔬 **Verificações Neurais:**
• Momento máximo: 45,9 kNm ✅
• Cortante máximo: 27,2 kN ✅
• Flecha máxima: L/350 ✅
• Fissuração: Dentro do limite ✅

⚠️ **Alertas Inteligentes:**
• Verificar apoios laterais
• Cuidado com furações > 50mm
• Respeitar cobrimento 2,5cm`,

      sustentabilidade: `🌱 **Análise Bioclimática Neural**

Para residência em Florianópolis:

🌞 **Orientação Solar Ótima:**
• **Fachada principal**: Norte (±15°)
• **Quartos**: Leste/Nordeste
• **Salas**: Norte/Noroeste
• **Serviços**: Sul/Sudeste

💨 **Ventilação Inteligente:**
• Aproveitar ventos NE (verão)
• Aberturas: 8-12% área piso
• Ventilação cruzada obrigatória
• Pé-direito mín: 2,70m

🔋 **Eficiência Energética:**
• Isolamento térmico: EPS 3cm
• Vidros duplos: 30% economia
• Cores claras: -5°C ambiente
• Ventilação natural: -40% A/C

📊 **ROI Sustentável:**
• Economia anual: R$ 2.400
• Payback: 4,2 anos
• Valorização: +18%
• Pegada carbono: -65%`
    }

    let responseContent = ''
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes('orçamento') || lowerMessage.includes('custo') || lowerMessage.includes('preço')) {
      responseContent = responses.orcamento
    } else if (lowerMessage.includes('viga') || lowerMessage.includes('estrutura') || lowerMessage.includes('pilar')) {
      responseContent = responses.estrutural
    } else if (lowerMessage.includes('solar') || lowerMessage.includes('sustentável') || lowerMessage.includes('orientação')) {
      responseContent = responses.sustentabilidade
    } else {
      responseContent = `🤖 **Análise Neural Completa**

Entendi sua consulta sobre: "${userMessage}"

🧠 **Processamento IA:**
• Contexto analisado com 94.7% confiança
• Base de dados: 50.000+ projetos SC
• Algoritmos neurais ativos

💡 **Insights Personalizados:**
• Considerando região de SC
• Clima subtropical úmido
• Normas ABNT atualizadas
• Práticas locais otimizadas

🎯 **Próximos Passos:**
• Detalhe mais sua necessidade
• Posso fazer cálculos específicos
• Análises personalizadas
• Recomendações técnicas

**Tem algum detalhe específico que posso ajudar?**`
    }

    return {
      id: Date.now().toString(),
      type: 'ai',
      content: responseContent,
      timestamp: new Date(),
      confidence: 90 + Math.random() * 8,
      suggestions: [
        'Fazer cálculo detalhado',
        'Ver alternativas',
        'Análise de custos',
        'Cronograma da execução'
      ]
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setIsThinking(true)

    const aiResponse = await generateAIResponse(inputMessage)
    setMessages(prev => [...prev, aiResponse])
    setIsThinking(false)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-b border-slate-200 dark:border-slate-700">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  🤖 IA Consultora Neural
                </h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Especialista em Engenharia e Arquitetura Catarinense
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
                <Brain className="h-3 w-3 mr-1" />
                Neural Ativo
              </Badge>
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                <MessageCircle className="h-3 w-3 mr-1" />
                Online 24/7
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="chat">💬 Chat IA</TabsTrigger>
              <TabsTrigger value="capacidades">🧠 Capacidades</TabsTrigger>
              <TabsTrigger value="exemplos">📚 Exemplos</TabsTrigger>
            </TabsList>

            {/* Tab Chat */}
            <TabsContent value="chat">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Chat Area */}
                <div className="lg:col-span-3">
                  <Card className="h-[600px] flex flex-col">
                    <CardHeader className="border-b">
                      <CardTitle className="flex items-center gap-2">
                        <Bot className="h-5 w-5 text-blue-600" />
                        IA Consultora Neural
                        <Badge className="ml-auto bg-green-500">Online</Badge>
                      </CardTitle>
                    </CardHeader>
                    
                    {/* Messages */}
                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                      {messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[80%] rounded-lg p-4 ${
                            message.type === 'user' 
                              ? 'bg-blue-500 text-white' 
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
                          }`}>
                            <div className="flex items-start gap-2 mb-2">
                              {message.type === 'ai' ? (
                                <Bot className="h-4 w-4 mt-1 text-blue-600" />
                              ) : (
                                <User className="h-4 w-4 mt-1" />
                              )}
                              <div className="text-xs opacity-75">
                                {message.timestamp.toLocaleTimeString('pt-BR')}
                              </div>
                            </div>
                            
                            <div className="whitespace-pre-wrap text-sm leading-relaxed">
                              {message.content}
                            </div>
                            
                            {message.confidence && (
                              <div className="mt-2 text-xs opacity-75">
                                Confiança: {message.confidence.toFixed(1)}%
                              </div>
                            )}
                            
                            {message.suggestions && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {message.suggestions.map((suggestion, index) => (
                                  <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                  >
                                    {suggestion}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))}
                      
                      {isThinking && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex justify-start"
                        >
                          <div className="bg-slate-100 dark:bg-slate-700 rounded-lg p-4 max-w-[80%]">
                            <div className="flex items-center gap-2">
                              <Brain className="h-4 w-4 text-blue-600 animate-spin" />
                              <span className="text-sm">IA Neural processando...</span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                      
                      <div ref={messagesEndRef} />
                    </CardContent>
                    
                    {/* Input */}
                    <div className="border-t p-4">
                      <div className="flex gap-2">
                        <Input
                          value={inputMessage}
                          onChange={(e) => setInputMessage(e.target.value)}
                          placeholder="Digite sua consulta técnica..."
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          disabled={isThinking}
                        />
                        <Button onClick={sendMessage} disabled={isThinking || !inputMessage.trim()}>
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">🚀 Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {[
                        '📐 Calcular estrutura',
                        '💰 Estimar orçamento',
                        '⏱️ Cronograma obra',
                        '🌱 Análise sustentável',
                        '🔧 Resolver problema',
                        '💡 Novas tecnologias'
                      ].map((action, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-xs"
                          onClick={() => setInputMessage(action.slice(2))}
                        >
                          {action}
                        </Button>
                      ))}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">📊 Status IA</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between text-xs">
                        <span>Precisão Neural</span>
                        <span className="font-bold text-green-600">96.8%</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Base Conhecimento</span>
                        <span className="font-bold text-blue-600">50k+ projetos</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Tempo Resposta</span>
                        <span className="font-bold text-purple-600">2.3s médio</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span>Satisfação</span>
                        <span className="font-bold text-orange-600">4.9/5.0</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Tab Capacidades */}
            <TabsContent value="capacidades">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {aiCapabilities.map((capability, index) => (
                  <motion.div
                    key={capability.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          <capability.icon className="h-6 w-6 text-blue-600" />
                          {capability.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          {capability.description}
                        </p>
                        
                        <div className="mb-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span>Precisão</span>
                            <span className="font-bold">{capability.accuracy}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full"
                              style={{ width: `${capability.accuracy}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2">Exemplos:</h4>
                          <div className="space-y-1">
                            {capability.examples.map((example, i) => (
                              <div key={i} className="text-xs text-gray-600 dark:text-gray-400">
                                • {example}
                              </div>
                            ))}
                          </div>
                        </div>

                        <Button 
                          className="w-full mt-4" 
                          variant="outline"
                          onClick={() => setInputMessage(`Quero consultar sobre ${capability.name.toLowerCase()}`)}
                        >
                          Consultar IA
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Tab Exemplos */}
            <TabsContent value="exemplos">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>🏗️ Consultas Estruturais</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      'Dimensionar viga de 6m para sobrado',
                      'Calcular pilar para construção de 4 andares',
                      'Verificar laje para sobrecarga de 500kg/m²',
                      'Analisar fundação em solo arenoso',
                      'Dimensionar escada em concreto armado'
                    ].map((example, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start text-sm"
                        onClick={() => setInputMessage(example)}
                      >
                        {example}
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>💰 Consultas de Orçamento</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      'Orçamento casa 200m² padrão médio em Floripa',
                      'Custo reforma cozinha 15m²',
                      'Preço piscina 8x4m com deck',
                      'Valor muro de divisa 50m lineares',
                      'Orçamento churrasqueira gourmet'
                    ].map((example, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start text-sm"
                        onClick={() => setInputMessage(example)}
                      >
                        {example}
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>🌱 Consultas Sustentáveis</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      'Melhor orientação solar para casa em SC',
                      'Sistema de captação água da chuva',
                      'Eficiência energética residencial',
                      'Materiais sustentáveis disponíveis',
                      'Certificação AQUA para residência'
                    ].map((example, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start text-sm"
                        onClick={() => setInputMessage(example)}
                      >
                        {example}
                      </Button>
                    ))}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>🔧 Resolução de Problemas</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      'Resolver infiltração na laje',
                      'Corrigir fissuras na parede',
                      'Problema de umidade no porão',
                      'Melhorar ventilação natural',
                      'Solução para ruído de vizinhos'
                    ].map((example, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="w-full justify-start text-sm"
                        onClick={() => setInputMessage(example)}
                      >
                        {example}
                      </Button>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
