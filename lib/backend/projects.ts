import { collection, query, where, getDocs, addDoc, doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Project, ProjectFilters } from '@/lib/types/projects'

function serializeProjectForFirestore(project: Partial<Project>): any {
  // Convert Dates into ISO or Timestamp; Firestore can accept JS Date as Timestamp
  const obj: any = { ...project }
  const dateKeys = ['startDate', 'plannedEndDate', 'createdAt', 'updatedAt', 'actualEndDate', 'archivedAt']
  dateKeys.forEach(k => {
    if (obj[k] instanceof Date) {
      obj[k] = obj[k]
    }
  })
  // For nested dates inside stages, budget, documents, tasks, alerts etc., more complex serialization would be required
  return obj
}

function deserializeProjectFromFirestore(data: any, id: string): Project {
  // Convert Timestamps to JS Date if necessary; Firestore returns Timestamp object with toDate()
  const normalizeDate = (value: any) => {
    if (!value) return value
    if (value?.toDate) return value.toDate()
    if (typeof value === 'string' || value instanceof String) return new Date(value as string)
    if (value instanceof Date) return value
    return value
  }

  const project: any = { id, ...data }
  project.startDate = normalizeDate(project.startDate)
  project.plannedEndDate = normalizeDate(project.plannedEndDate)
  project.createdAt = normalizeDate(project.createdAt)
  project.updatedAt = normalizeDate(project.updatedAt)

  // Fix dates inside arrays (stages, documents, tasks, alerts, budget)
  if (Array.isArray(project.stages)) {
    project.stages = project.stages.map((s: any) => ({ ...s, startDate: normalizeDate(s.startDate), dueDate: normalizeDate(s.dueDate), completedDate: normalizeDate(s.completedDate) }))
  }
  if (Array.isArray(project.documents)) {
    project.documents = project.documents.map((d: any) => ({ ...d, uploadDate: normalizeDate(d.uploadDate) }))
  }
  if (Array.isArray(project.tasks)) {
    project.tasks = project.tasks.map((t: any) => ({ ...t, dueDate: normalizeDate(t.dueDate), createdAt: normalizeDate(t.createdAt), completedAt: normalizeDate(t.completedAt) }))
  }

  if (project.budget) {
    project.budget.lastUpdated = normalizeDate(project.budget.lastUpdated)
  }

  if (Array.isArray(project.alerts)) {
    project.alerts = project.alerts.map((a: any) => ({ ...a, createdAt: normalizeDate(a.createdAt), resolvedAt: normalizeDate(a.resolvedAt) }))
  }

  if (project.archivedAt) project.archivedAt = normalizeDate(project.archivedAt)

  return project as Project
}

export async function getProjectsFromFirestore(filters?: ProjectFilters): Promise<Project[]> {
  // For now, reutrn all and filter locally; in production, build queries and indexes
  const col = collection(db, 'projects')
  const q = query(col)
  const snapshot = await getDocs(q)
  const projects: Project[] = []
  snapshot.forEach(docSnap => {
    projects.push(deserializeProjectFromFirestore(docSnap.data(), docSnap.id))
  })

  // Apply local filters like searchText if provided
  let filtered = projects
  if (filters?.searchText) {
    const text = filters.searchText.toLowerCase()
    filtered = filtered.filter(p => (p.projectName || '').toLowerCase().includes(text) || (p.projectCode || '').toLowerCase().includes(text) || p.client?.name?.toLowerCase().includes(text))
  }
  if (filters?.status && filters.status.length > 0) filtered = filtered.filter(p => filters.status?.includes(p.status))
  if (filters?.type && filters.type.length > 0) filtered = filtered.filter(p => filters.type?.includes(p.type))

  if (!filters?.includeArchived) filtered = filtered.filter(p => !p.isArchived)

  return filtered
}

export async function getProjectByIdFromFirestore(id: string): Promise<Project | null> {
  const d = doc(db, 'projects', id)
  const snapshot = await getDoc(d)
  if (!snapshot.exists()) return null
  return deserializeProjectFromFirestore(snapshot.data(), snapshot.id)
}

export async function createProjectInFirestore(project: Partial<Project>): Promise<Project> {
  const col = collection(db, 'projects')
  const serialized = serializeProjectForFirestore({ ...project, createdAt: new Date(), updatedAt: new Date() })
  const docRef = await addDoc(col, serialized)
  // Read back
  const newProj = await getProjectByIdFromFirestore(docRef.id)
  if (!newProj) throw new Error('Erro ao criar projeto em Firestore')
  return newProj
}

export async function updateProjectInFirestore(projectId: string, updates: Partial<Project>): Promise<void> {
  const d = doc(db, 'projects', projectId)
  const serialized = serializeProjectForFirestore({ ...updates, updatedAt: new Date() })
  await updateDoc(d, serialized as any)
}

export async function deleteProjectInFirestore(projectId: string): Promise<void> {
  const d = doc(db, 'projects', projectId)
  await deleteDoc(d)
}

export async function archiveProjectInFirestore(projectId: string, userId: string): Promise<void> {
  const d = doc(db, 'projects', projectId)
  await updateDoc(d, { isArchived: true, archivedAt: serverTimestamp(), archivedBy: userId, updatedAt: serverTimestamp() })
}
