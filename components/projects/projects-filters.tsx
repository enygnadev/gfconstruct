import { ProjectFilters, ProjectType, ProjectStatus, Priority } from '@/lib/types/projects'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, X, Filter } from 'lucide-react'
import { useState } from 'react'

interface ProjectFiltersProps {
  onFiltersChange: (filters: ProjectFilters) => void
  isOpen?: boolean
  onToggle?: () => void
}

const projectTypes: { value: ProjectType; label: string }[] = [
  { value: 'obra-civil', label: 'Obra Civil' },
  { value: 'instalacao', label: 'Instalação' },
  { value: 'manutencao', label: 'Manutenção' },
  { value: 'projeto-digital', label: 'Projeto Digital' },
  { value: 'reforma', label: 'Reforma' },
  { value: 'consultoría', label: 'Consultoria' }
]

const projectStatus: { value: ProjectStatus; label: string }[] = [
  { value: 'planejamento', label: 'Planejamento' },
  { value: 'analise', label: 'Análise' },
  { value: 'orcacao', label: 'Orçação' },
  { value: 'execucao', label: 'Execução' },
  { value: 'inspecao', label: 'Inspeção' },
  { value: 'ajustes', label: 'Ajustes' },
  { value: 'finalizacao', label: 'Finalização' },
  { value: 'concluido', label: 'Concluído' },
  { value: 'suspenso', label: 'Suspenso' }
]

const priorities: { value: Priority; label: string }[] = [
  { value: 'baixa', label: 'Baixa' },
  { value: 'media', label: 'Média' },
  { value: 'alta', label: 'Alta' },
  { value: 'critica', label: 'Crítica' }
]

export function ProjectFiltersPanel({
  onFiltersChange,
  isOpen = true,
  onToggle
}: ProjectFiltersProps) {
  const [filters, setFilters] = useState<ProjectFilters>({})
  const [selectedTypes, setSelectedTypes] = useState<ProjectType[]>([])
  const [selectedStatus, setSelectedStatus] = useState<ProjectStatus[]>([])
  const [selectedPriorities, setSelectedPriorities] = useState<Priority[]>([])

  const handleSearchChange = (text: string) => {
    const newFilters = { ...filters, searchText: text }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleTypeToggle = (type: ProjectType) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter(t => t !== type)
      : [...selectedTypes, type]
    setSelectedTypes(newTypes)
    const newFilters = { ...filters, type: newTypes.length > 0 ? newTypes : undefined }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleStatusToggle = (status: ProjectStatus) => {
    const newStatus = selectedStatus.includes(status)
      ? selectedStatus.filter(s => s !== status)
      : [...selectedStatus, status]
    setSelectedStatus(newStatus)
    const newFilters = { ...filters, status: newStatus.length > 0 ? newStatus : undefined }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handlePriorityToggle = (priority: Priority) => {
    const newPriorities = selectedPriorities.includes(priority)
      ? selectedPriorities.filter(p => p !== priority)
      : [...selectedPriorities, priority]
    setSelectedPriorities(newPriorities)
    const newFilters = { ...filters, priority: newPriorities.length > 0 ? newPriorities : undefined }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleClearFilters = () => {
    setSelectedTypes([])
    setSelectedStatus([])
    setSelectedPriorities([])
    setFilters({})
    onFiltersChange({})
  }

  if (!isOpen) {
    return null
  }

  const hasActiveFilters = selectedTypes.length > 0 || selectedStatus.length > 0 || selectedPriorities.length > 0 || filters.searchText

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Buscar por nome, código ou cliente..."
          className="pl-10"
          onChange={(e) => handleSearchChange(e.target.value)}
        />
      </div>

      {/* Types */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm">Tipo de Projeto</h3>
        <div className="flex flex-wrap gap-2">
          {projectTypes.map(type => (
            <Badge
              key={type.value}
              variant={selectedTypes.includes(type.value) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => handleTypeToggle(type.value)}
            >
              {type.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm">Status</h3>
        <div className="flex flex-wrap gap-2">
          {projectStatus.map(status => (
            <Badge
              key={status.value}
              variant={selectedStatus.includes(status.value) ? 'default' : 'outline'}
              className="cursor-pointer text-xs"
              onClick={() => handleStatusToggle(status.value)}
            >
              {status.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Priority */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm">Prioridade</h3>
        <div className="flex flex-wrap gap-2">
          {priorities.map(priority => (
            <Badge
              key={priority.value}
              variant={selectedPriorities.includes(priority.value) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => handlePriorityToggle(priority.value)}
            >
              {priority.label}
            </Badge>
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleClearFilters}
          className="w-full"
        >
          <X className="h-4 w-4 mr-2" />
          Limpar Filtros
        </Button>
      )}
    </div>
  )
}
