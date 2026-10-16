import {
  type SimulationFormData,
  type SimulationRecord,
} from '@/data/simulation'
export type { SimulationRecord } from '@/data/simulation'

const LOCAL_STORAGE_KEY = 'simulation-data'

const getSimulations = (): SimulationRecord[] => {
  const storage = localStorage.getItem(LOCAL_STORAGE_KEY)
  return storage ? (JSON.parse(storage) as SimulationRecord[]) : []
}

const deleteSimulation = (id: string) => {
  const remaining = getSimulations().filter((record) => record.id !== id)
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(remaining))
}

const updateSimulation = (id: string, data: Partial<SimulationRecord>) => {
  const savedData = getSimulations()
  const updated = savedData.map((record) =>
    record.id === id ? { ...record, ...data, id } : record,
  )
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated))
}

const saveFormData = (formData: SimulationFormData) => {
  const id = crypto.randomUUID()
  const record: SimulationRecord = {
    ...formData,
    id,
    createdAt: new Date().toISOString(),
  }

  const savedData = getSimulations()

  localStorage.setItem(
    LOCAL_STORAGE_KEY,
    JSON.stringify([...savedData, record]),
  )

  return id
}

const getFormData = (id: string): SimulationRecord | null => {
  const savedData = getSimulations()
  return savedData.find((record) => record.id === id) || null
}

export const useSimulationStorage = () => ({
  saveFormData,
  getFormData,
  updateSimulation,
  getSimulations,
  deleteSimulation,
})
