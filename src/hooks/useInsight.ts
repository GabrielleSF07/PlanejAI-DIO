import { useCallback, useEffect, useRef, useState } from 'react'

import { buildAIPrompt } from '@/data/aiPrompt'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import { getInsight, type InsightData } from '@/services/aiService'

export const useInsight = (id: string) => {
  const isRequestPending = useRef(false)
  const { getFormData, updateSimulation } = useSimulationStorage()

  const [insight, setInsight] = useState<InsightData | null>(() => {
    const simulation = getFormData(id)
    return simulation?.insight ?? null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchInsight = useCallback(
    async (simulationId: string = id) => {
      // A ref muda imediatamente, antes de o React atualizar isLoading.
      if (isRequestPending.current) return

      isRequestPending.current = true
      setIsLoading(true)
      setError(null)

      try {
        const simulation = getFormData(simulationId)
        if (!simulation) {
          setError('Simulação não encontrada.')
          return
        }

        if (simulation.insight) {
          setInsight(simulation.insight)
          return simulation.insight
        }

        const prompt = buildAIPrompt(simulation)
        const data = await getInsight(prompt)
        updateSimulation(simulationId, { ...simulation, insight: data })
        setInsight(data)
        return data
      } catch {
        setError('Erro ao gerar o diagnóstico. Tente novamente.')
      } finally {
        isRequestPending.current = false
        setIsLoading(false)
      }
    },
    [id, getFormData, updateSimulation],
  )

  useEffect(() => {
    if (insight || isLoading || isRequestPending.current || error) return

    let cancelled = false
    // Agenda a chamada após o efeito e descarta a execução limpa pelo Strict Mode.
    void Promise.resolve().then(() => {
      if (!cancelled) return fetchInsight(id)
    })

    return () => {
      cancelled = true
    }
  }, [id, insight, isLoading, error, fetchInsight])

  return { insight, isLoading, error, fetchInsight }
}
