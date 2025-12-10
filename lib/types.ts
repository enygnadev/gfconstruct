
export type UserRole = 'admin' | 'colaborador' | 'cliente'

export interface UserProfile {
  uid: string
  email: string
  displayName: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
  isActive: boolean
  avatar?: string
  phone?: string
  company?: string
  permissions?: string[]
}

export interface Project {
  id: string
  title: string
  description: string
  clientId: string
  collaboratorIds: string[]
  status: 'planejamento' | 'em_andamento' | 'concluido' | 'pausado'
  budget: number
  startDate: Date
  endDate?: Date
  materials: Material[]
  timeline: TimelineItem[]
  createdAt: Date
  updatedAt: Date
}

export interface Material {
  id: string
  name: string
  quantity: number
  unit: string
  unitPrice: number
  totalPrice: number
  supplier?: string
  category: string
}

export interface TimelineItem {
  id: string
  title: string
  description: string
  startDate: Date
  endDate: Date
  status: 'pendente' | 'em_andamento' | 'concluido'
  dependencies?: string[]
}

export interface AuthContextType {
  user: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, userData: Partial<UserProfile>) => Promise<void>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<UserProfile>) => Promise<void>
}
