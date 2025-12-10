
"use client"

import { useState, useEffect } from "react"
import { Calculator } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface CostRange {
  min: number
  max: number
}

interface ServiceCost {
  service: string
  specification: string
  costRange: CostRange
}

export function CostEstimator() {
  const [selectedService, setSelectedService] = useState("")
  const [area, setArea] = useState("")
  const [estimatedCost, setEstimatedCost] = useState<CostRange | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const serviceCosts: ServiceCost[] = [
    {
      service: "Construção Residencial",
      specification: "Casa Padrão",
      costRange: { min: 800000, max: 1200000 },
    },
    {
      service: "Construção Residencial",
      specification: "Casa Premium",
      costRange: { min: 1200000, max: 1800000 },
    },
    {
      service: "Construção Comercial",
      specification: "Escritório",
      costRange: { min: 900000, max: 1400000 },
    },
    {
      service: "Construção Comercial",
      specification: "Loja/Comércio",
      costRange: { min: 700000, max: 1100000 },
    },
    {
      service: "Reformas",
      specification: "Reforma Completa",
      costRange: { min: 400000, max: 800000 },
    },
    {
      service: "Reformas",
      specification: "Reforma Parcial",
      costRange: { min: 200000, max: 500000 },
    },
    {
      service: "Fundações",
      specification: "Fundação Padrão",
      costRange: { min: 150000, max: 250000 },
    },
    {
      service: "Acabamentos",
      specification: "Acabamento Premium",
      costRange: { min: 300000, max: 600000 },
    },
  ]

  const calculateEstimate = () => {
    const selectedServiceData = serviceCosts.find(
      (service) => `${service.service} - ${service.specification}` === selectedService,
    )

    if (selectedServiceData && area) {
      const areaNum = Number.parseFloat(area)
      const minCost = (selectedServiceData.costRange.min * areaNum) / 1000000
      const maxCost = (selectedServiceData.costRange.max * areaNum) / 1000000

      setEstimatedCost({ min: minCost, max: maxCost })
    }
  }

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'TZS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value)
  }

  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('pt-BR').format(value)
  }

  if (!isMounted) {
    return (
      <div className="space-y-8">
        <Card className="bg-white/5 dark:bg-slate-800/50 backdrop-blur-sm border border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
              <Calculator className="h-5 w-5 text-gold-500" />
              Calculadora de Custos de Construção (Por Metro Quadrado)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Card className="bg-white/5 dark:bg-slate-800/50 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
            <Calculator className="h-5 w-5 text-gold-500" />
            Calculadora de Custos de Construção (Por Metro Quadrado)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="service-select">Selecione o Serviço e Especificação</Label>
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger id="service-select" className="bg-white/5 border-white/10">
                  <SelectValue placeholder="Escolha um serviço" />
                </SelectTrigger>
                <SelectContent>
                  {serviceCosts.map((service, index) => (
                    <SelectItem key={index} value={`${service.service} - ${service.specification}`}>
                      {service.service} - {service.specification}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="area-input">Área (Metros Quadrados)</Label>
              <Input
                id="area-input"
                type="number"
                placeholder="Digite a área em m²"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="bg-white/5 border-white/10"
              />
            </div>

            <Button
              onClick={calculateEstimate}
              className="w-full bg-gold-500 hover:bg-gold-600 text-slate-900"
              disabled={!selectedService || !area}
            >
              Calcular Orçamento
            </Button>

            {estimatedCost && (
              <div className="bg-white/10 dark:bg-slate-700/30 p-6 rounded-xl text-center">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Faixa de Custo Estimado</p>
                <p className="text-2xl font-bold text-gold-500">
                  {formatCurrency(estimatedCost.min)} - {formatCurrency(estimatedCost.max)}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  *Os preços são estimativas e podem variar conforme requisitos específicos
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white/5 dark:bg-slate-800/50 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-white">Tabela de Referência de Custos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-2 font-semibold text-slate-900 dark:text-white">Serviço</th>
                  <th className="text-left py-3 px-2 font-semibold text-slate-900 dark:text-white">Especificação</th>
                  <th className="text-left py-3 px-2 font-semibold text-slate-900 dark:text-white">
                    Faixa de Custo (TZS/m²)
                  </th>
                </tr>
              </thead>
              <tbody>
                {serviceCosts.map((service, index) => (
                  <tr key={index} className="border-b border-white/5">
                    <td className="py-3 px-2 text-slate-700 dark:text-slate-300">{service.service}</td>
                    <td className="py-3 px-2 text-slate-700 dark:text-slate-300">{service.specification}</td>
                    <td className="py-3 px-2">
                      <Badge variant="outline" className="border-gold-500 text-gold-700 dark:text-gold-400 bg-gold-50 dark:bg-gold-950/20">
                        <div className="inline-flex items-center gap-1">
                          <Calculator className="h-3 w-3" />
                          {formatNumber(service.costRange.min)} - {formatNumber(service.costRange.max)}
                        </div>
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
