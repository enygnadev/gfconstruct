"use client"

import { Leaf, ArrowLeft, TreePine, Droplets, Sun, Recycle, Wind, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

export default function SustentabilidadePage() {
  const router = useRouter()

  const features = [
    {
      icon: TreePine,
      title: 'Materiais Ecológicos',
      description: 'Análise e recomendação de materiais sustentáveis para sua obra',
      color: 'bg-green-500'
    },
    {
      icon: Droplets,
      title: 'Gestão de Água',
      description: 'Sistemas de captação e reuso de água da chuva',
      color: 'bg-blue-500'
    },
    {
      icon: Sun,
      title: 'Energia Solar',
      description: 'Dimensionamento de sistemas fotovoltaicos',
      color: 'bg-yellow-500'
    },
    {
      icon: Recycle,
      title: 'Gestão de Resíduos',
      description: 'Plano de gerenciamento de resíduos da construção',
      color: 'bg-orange-500'
    },
    {
      icon: Wind,
      title: 'Ventilação Natural',
      description: 'Projetos com ventilação cruzada e conforto térmico',
      color: 'bg-cyan-500'
    },
    {
      icon: Zap,
      title: 'Eficiência Energética',
      description: 'Análise de consumo e otimização energética',
      color: 'bg-purple-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-slate-900 dark:to-slate-800 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/sistema/dashboard')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-500 rounded-xl">
              <Leaf className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                Sustentabilidade
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Construção verde e eficiência ambiental
              </p>
            </div>
          </div>
        </div>

        {/* Coming Soon Banner */}
        <Card className="mb-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
          <CardContent className="p-8">
            <div className="flex items-center gap-4">
              <Leaf className="h-16 w-16 opacity-80" />
              <div>
                <h2 className="text-2xl font-bold mb-2">Módulo em Desenvolvimento</h2>
                <p className="opacity-90">
                  Estamos trabalhando para trazer ferramentas avançadas de análise 
                  de sustentabilidade para suas obras. Em breve você poderá calcular 
                  o impacto ambiental e otimizar seus projetos.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
          Funcionalidades Planejadas
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <Card key={idx} className="hover:shadow-lg transition-shadow opacity-75">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${feature.color}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {feature.description}
                  </p>
                  <span className="inline-block mt-3 text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400">
                    Em breve
                  </span>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Back Button */}
        <div className="mt-8 flex justify-center">
          <Button
            variant="outline"
            onClick={() => router.push('/sistema/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
