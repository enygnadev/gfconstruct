"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  X,
  Building2,
  MapPin,
  DollarSign,
  Calendar,
  Users,
  AlertCircle,
  CheckCircle2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Drawer, DrawerClose, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { ProjectType, Priority } from '@/lib/types/projects'

interface NewProjectFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: NewProjectData) => Promise<void>
}

export interface NewProjectData {
  projectName: string
  projectCode: string
  type: ProjectType
  description: string
  priority: Priority
  client: {
    name: string
    email: string
    phone: string
  }
  location: {
    address: string
    city: string
    state: string
  }
  budget: number
  startDate: string
  plannedEndDate: string
  objective: string
  scope: string
}

const projectTypes: { value: ProjectType; label: string; description: string }[] = [
  { value: 'obra-civil', label: 'Obra Civil', description: 'Construção residencial ou comercial' },
  { value: 'reforma', label: 'Reforma', description: 'Reforma de ambientes existentes' },
  { value: 'instalacao', label: 'Instalação', description: 'Instalações elétricas, hidráulicas, etc.' },
  { value: 'manutencao', label: 'Manutenção', description: 'Serviços de manutenção preventiva/corretiva' },
  { value: 'projeto-digital', label: 'Projeto Digital', description: 'Projetos arquitetônicos/estruturais' },
  { value: 'consultoría', label: 'Consultoria', description: 'Serviços de consultoria técnica' }
]

const priorities: { value: Priority; label: string; color: string }[] = [
  { value: 'baixa', label: 'Baixa', color: 'bg-blue-100 text-blue-800' },
  { value: 'media', label: 'Média', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'alta', label: 'Alta', color: 'bg-orange-100 text-orange-800' },
  { value: 'critica', label: 'Crítica', color: 'bg-red-100 text-red-800' }
]

const states = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']

export function NewProjectForm({ isOpen, onClose, onSubmit }: NewProjectFormProps) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [formData, setFormData] = useState<NewProjectData>({
    projectName: '',
    projectCode: '',
    type: 'obra-civil',
    description: '',
    priority: 'media',
    client: {
      name: '',
      email: '',
      phone: ''
    },
    location: {
      address: '',
      city: '',
      state: ''
    },
    budget: 0,
    startDate: '',
    plannedEndDate: '',
    objective: '',
    scope: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as Record<string, any>,
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'budget' ? parseFloat(value) || 0 : value
      }))
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev] as Record<string, any>,
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const generateProjectCode = () => {
    const code = `PROJ-${Date.now().toString().slice(-6)}`
    setFormData(prev => ({ ...prev, projectCode: code }))
  }

  const validateStep = (stepNum: number): boolean => {
    setError(null)
    
    if (stepNum === 1) {
      if (!formData.projectName.trim()) {
        setError('Nome do projeto é obrigatório')
        return false
      }
      if (!formData.projectCode.trim()) {
        setError('Código do projeto é obrigatório')
        return false
      }
      if (!formData.description.trim()) {
        setError('Descrição é obrigatória')
        return false
      }
      return true
    }

    if (stepNum === 2) {
      if (!formData.client.name.trim()) {
        setError('Nome do cliente é obrigatório')
        return false
      }
      if (!formData.client.email.trim()) {
        setError('Email do cliente é obrigatório')
        return false
      }
      if (!formData.location.address.trim()) {
        setError('Endereço é obrigatório')
        return false
      }
      if (!formData.location.city.trim()) {
        setError('Cidade é obrigatória')
        return false
      }
      return true
    }

    if (stepNum === 3) {
      if (formData.budget <= 0) {
        setError('Orçamento deve ser maior que zero')
        return false
      }
      if (!formData.startDate) {
        setError('Data de início é obrigatória')
        return false
      }
      if (!formData.plannedEndDate) {
        setError('Data de término é obrigatória')
        return false
      }
      if (new Date(formData.startDate) >= new Date(formData.plannedEndDate)) {
        setError('Data de término deve ser após a data de início')
        return false
      }
      return true
    }

    if (stepNum === 4) {
      if (!formData.objective.trim()) {
        setError('Objetivo é obrigatório')
        return false
      }
      if (!formData.scope.trim()) {
        setError('Escopo é obrigatório')
        return false
      }
      return true
    }

    return true
  }

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < 4) {
        setStep(step + 1)
      }
    }
  }

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1)
      setError(null)
    }
  }

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      // Validação final completa
      const allFieldsValid = 
        formData.projectName.trim() !== '' &&
        formData.projectCode.trim() !== '' &&
        formData.client.name.trim() !== '' &&
        formData.client.email.trim() !== '' &&
        formData.location.address.trim() !== '' &&
        formData.location.city.trim() !== '' &&
        formData.location.state.trim() !== '' &&
        formData.budget > 0 &&
        formData.startDate !== '' &&
        formData.plannedEndDate !== '' &&
        formData.objective.trim() !== '' &&
        formData.scope.trim() !== '' &&
        new Date(formData.startDate) < new Date(formData.plannedEndDate)

      if (!allFieldsValid) {
        throw new Error('Por favor, preencha todos os campos obrigatórios corretamente')
      }

      await onSubmit(formData)
      setSuccess(true)
      
      // Resetar após sucesso
      setTimeout(() => {
        setSuccess(false)
        resetForm()
        onClose()
      }, 2500)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Erro ao criar projeto'
      setError(errorMsg)
      console.error('Erro ao criar projeto:', err)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      projectName: '',
      projectCode: '',
      type: 'obra-civil',
      description: '',
      priority: 'media',
      client: {
        name: '',
        email: '',
        phone: ''
      },
      location: {
        address: '',
        city: '',
        state: ''
      },
      budget: 0,
      startDate: '',
      plannedEndDate: '',
      objective: '',
      scope: ''
    })
    setStep(1)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const steps = [
    { number: 1, title: 'Informações Básicas', icon: Building2 },
    { number: 2, title: 'Cliente e Localização', icon: MapPin },
    { number: 3, title: 'Orçamento e Datas', icon: Calendar },
    { number: 4, title: 'Objetivo e Escopo', icon: Users }
  ]

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DrawerContent className="w-full max-h-[96vh] sm:max-h-[95vh] overflow-y-auto bg-white dark:bg-slate-900 flex flex-col">
        <DrawerHeader className="sticky top-0 z-30 border-b border-slate-200 dark:border-slate-700 p-4 glass">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                Novo Projeto
              </DrawerTitle>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Preencha as informações para criar um novo projeto
              </p>
            </div>
            <DrawerClose asChild>
              <button className="p-2 rounded-lg transition-colors flex-shrink-0 glass-btn">
                <X className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </button>
            </DrawerClose>
          </div>

          {/* Steps indicator (moved to header to avoid overlapping inputs) */}
          <div className="mt-3">
            <div className="hidden sm:flex items-center justify-between gap-1 sm:gap-2 overflow-x-auto">
              {steps.map((s) => {
                const isActive = s.number === step
                const isCompleted = s.number < step
                return (
                  <motion.div key={s.number} className="flex-1 min-w-[48px]">
                    <motion.button
                      onClick={() => s.number < step && setStep(s.number)}
                      className={`w-full h-10 sm:h-12 rounded-lg transition-all text-xs sm:text-sm font-medium ${
                        isActive
                          ? 'bg-gold-500 text-slate-900 shadow-md relative overflow-hidden'
                          : isCompleted
                          ? 'bg-green-500 text-white'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isActive && <div className="absolute inset-0 pointer-events-none overflow-hidden glass-shine" />}
                      {isCompleted ? '✓' : s.number}
                    </motion.button>
                  </motion.div>
                )
              })}
            </div>
            {/* Animated progress bar */}
            <div className="mt-3 px-2">
              <div className="h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(step / steps.length) * 100}%` }}
                  transition={{ type: 'spring', stiffness: 180, damping: 20, duration: 0.5 }}
                  className="h-1 bg-gradient-to-r from-gold-400 to-gold-600"
                />
              </div>
            </div>
            <div className="mt-2 text-center sm:text-left">
              <h3 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white">
                {steps[step - 1].title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Passo {step} de {steps.length}
              </p>
            </div>
          </div>
        </DrawerHeader>

        <div className="flex-1 px-4 pt-14 pb-6 space-y-4 sm:px-6 sm:pt-20 overflow-y-auto">
          {/* Success State */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-3"
            >
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-900 dark:text-green-100">Projeto criado com sucesso!</p>
                <p className="text-sm text-green-700 dark:text-green-300">Redirecionando...</p>
              </div>
            </motion.div>
          )}

          {/* Error State */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3"
            >
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <div>
                <p className="font-medium text-red-900 dark:text-red-100">{error}</p>
              </div>
            </motion.div>
          )}

          {/* Steps Indicator moved into DrawerHeader to avoid overlapping content */}

          {/* Form Content */}
          <div className="space-y-3">
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-3"
              >
                <div>
                  <Label htmlFor="projectName" className="text-xs sm:text-sm">Nome do Projeto *</Label>
                  <Input
                    id="projectName"
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleInputChange}
                    placeholder="Ex: Casa Residencial"
                    className="mt-1 text-xs sm:text-sm h-9 sm:h-10 scroll-mt-14 sm:scroll-mt-20"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="projectCode" className="text-xs sm:text-sm">Código *</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="projectCode"
                        name="projectCode"
                        value={formData.projectCode}
                        onChange={handleInputChange}
                        placeholder="PROJ-001"
                        readOnly
                        className="flex-1 text-xs h-9 sm:h-10 scroll-mt-14 sm:scroll-mt-20"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={generateProjectCode}
                        size="sm"
                        className="px-2 h-9 sm:h-10 text-xs sm:text-sm"
                      >
                        Gerar
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="type" className="text-xs sm:text-sm">Tipo *</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => handleSelectChange('type', value as ProjectType)}
                    >
                      {projectTypes.map(pt => (
                        <option key={pt.value} value={pt.value}>
                          {pt.label}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>

                <div>
                  <Label className="text-xs sm:text-sm">Prioridade *</Label>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {priorities.map(p => (
                      <button
                        key={p.value}
                        onClick={() => handleSelectChange('priority', p.value)}
                        className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                          formData.priority === p.value
                            ? p.color + ' ring-2 ring-offset-1 ring-gold-500'
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-xs sm:text-sm">Descrição *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Detalhes do projeto..."
                    rows={3}
                    className="mt-1 text-xs sm:text-sm resize-none scroll-mt-14 sm:scroll-mt-20"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 2: Client and Location */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-3"
              >
                <Card className="bg-slate-50 dark:bg-slate-800/50 border-0">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm sm:text-base">Cliente</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label htmlFor="clientName" className="text-xs sm:text-sm">Nome *</Label>
                        <Input
                        id="clientName"
                        name="client.name"
                        value={formData.client.name}
                        onChange={handleInputChange}
                        placeholder="Nome ou razão social"
                          className="mt-1 text-xs sm:text-sm h-9 sm:h-10 scroll-mt-14 sm:scroll-mt-20"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="clientEmail" className="text-xs sm:text-sm">Email *</Label>
                        <Input
                          id="clientEmail"
                          name="client.email"
                          type="email"
                          value={formData.client.email}
                          onChange={handleInputChange}
                          placeholder="email@example.com"
                          className="mt-1 text-xs h-9 sm:h-10 scroll-mt-14 sm:scroll-mt-20"
                        />
                      </div>

                      <div>
                        <Label htmlFor="clientPhone" className="text-xs sm:text-sm">Telefone</Label>
                        <Input
                          id="clientPhone"
                          name="client.phone"
                          value={formData.client.phone}
                          onChange={handleInputChange}
                          placeholder="(11) 99999-9999"
                          className="mt-1 text-xs h-9 sm:h-10 scroll-mt-14 sm:scroll-mt-20"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-slate-50 dark:bg-slate-800/50 border-0">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm sm:text-base">Localização</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label htmlFor="address" className="text-xs sm:text-sm">Endereço *</Label>
                      <Input
                        id="address"
                        name="location.address"
                        value={formData.location.address}
                        onChange={handleInputChange}
                        placeholder="Rua, número"
                        className="mt-1 text-xs sm:text-sm h-9 sm:h-10 scroll-mt-14 sm:scroll-mt-20"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="city" className="text-xs sm:text-sm">Cidade *</Label>
                        <Input
                          id="city"
                          name="location.city"
                          value={formData.location.city}
                          onChange={handleInputChange}
                          placeholder="São Paulo"
                          className="mt-1 text-xs h-9 sm:h-10 scroll-mt-14 sm:scroll-mt-20"
                        />
                      </div>

                      <div>
                        <Label htmlFor="state" className="text-xs sm:text-sm">Estado *</Label>
                        <Select
                          value={formData.location.state}
                          onValueChange={(value) => handleSelectChange('location.state', value)}
                        >
                          <option value="">Selecione</option>
                          {states.map(state => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Step 3: Budget and Dates */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-3"
              >
                <div>
                  <Label htmlFor="budget" className="text-xs sm:text-sm">Orçamento (R$) *</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">R$</span>
                    <Input
                      id="budget"
                      name="budget"
                      type="number"
                      value={formData.budget || ''}
                      onChange={handleInputChange}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="flex-1 text-xs sm:text-sm h-9 sm:h-10 scroll-mt-14 sm:scroll-mt-20"
                    />
                  </div>
                  {formData.budget > 0 && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(formData.budget)}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="startDate" className="text-xs sm:text-sm">Início *</Label>
                    <Input
                      id="startDate"
                      name="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="mt-1 text-xs sm:text-sm h-9 sm:h-10 scroll-mt-14 sm:scroll-mt-20"
                    />
                  </div>

                  <div>
                    <Label htmlFor="plannedEndDate" className="text-xs sm:text-sm">Término *</Label>
                    <Input
                      id="plannedEndDate"
                      name="plannedEndDate"
                      type="date"
                      value={formData.plannedEndDate}
                      onChange={handleInputChange}
                      className="mt-1 text-xs sm:text-sm h-9 sm:h-10 scroll-mt-14 sm:scroll-mt-20"
                    />
                  </div>
                </div>

                {formData.startDate && formData.plannedEndDate && (
                  <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                    <CardContent className="pt-4">
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                        <strong>Duração:</strong> {
                          Math.ceil((new Date(formData.plannedEndDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 60 * 60 * 24))
                        } dias
                      </p>
                    </CardContent>
                  </Card>
                )}
              </motion.div>
            )}

            {/* Step 4: Objective and Scope */}
            {step === 4 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-3"
              >
                <div>
                  <Label htmlFor="objective" className="text-xs sm:text-sm">Objetivo *</Label>
                  <Textarea
                    id="objective"
                    name="objective"
                    value={formData.objective}
                    onChange={handleInputChange}
                    placeholder="Qual é o objetivo?"
                    rows={2}
                    className="mt-1 text-xs sm:text-sm resize-none scroll-mt-14 sm:scroll-mt-20"
                  />
                </div>

                <div>
                  <Label htmlFor="scope" className="text-xs sm:text-sm">Escopo *</Label>
                  <Textarea
                    id="scope"
                    name="scope"
                    value={formData.scope}
                    onChange={handleInputChange}
                    placeholder="Descreva o escopo do projeto..."
                    rows={2}
                    className="mt-1 text-xs sm:text-sm resize-none scroll-mt-14 sm:scroll-mt-20"
                  />
                </div>

                <Card className="bg-slate-50 dark:bg-slate-800/50 border-0">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">Resumo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-slate-600 dark:text-slate-400">Projeto</p>
                        <p className="font-medium text-slate-900 dark:text-white truncate">{formData.projectName || '-'}</p>
                      </div>
                      <div>
                        <p className="text-slate-600 dark:text-slate-400">Código</p>
                        <p className="font-medium text-slate-900 dark:text-white">{formData.projectCode || '-'}</p>
                      </div>
                      <div>
                        <p className="text-slate-600 dark:text-slate-400">Cliente</p>
                        <p className="font-medium text-slate-900 dark:text-white truncate">{formData.client.name || '-'}</p>
                      </div>
                      <div>
                        <p className="text-slate-600 dark:text-slate-400">Orçamento</p>
                        <p className="font-medium text-slate-900 dark:text-white">
                          {formData.budget > 0 
                            ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(formData.budget)
                            : '-'
                          }
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="sticky bottom-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 -mx-4 px-4 py-3 sm:-mx-6 sm:px-6 flex flex-col-reverse sm:flex-row gap-2">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={handlePrev}
                disabled={loading}
                className="w-full sm:flex-1 h-9 sm:h-10 text-xs sm:text-sm"
              >
                ← Voltar
              </Button>
            )}

            {step < 4 ? (
              <Button
                onClick={handleNext}
                disabled={loading}
                className="w-full sm:flex-1 h-9 sm:h-10 text-xs sm:text-sm bg-gold-500 hover:bg-gold-600 text-slate-900"
              >
                Próximo →
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full sm:flex-1 h-9 sm:h-10 text-xs sm:text-sm bg-green-500 hover:bg-green-600 text-white"
              >
                {loading ? 'Criando...' : '✓ Criar'}
              </Button>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
