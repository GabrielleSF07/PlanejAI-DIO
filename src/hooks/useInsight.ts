import { useCallback, useEffect, useRef, useState } from 'react'

import { buildAIPrompt } from '@/data/aiPrompt'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import {
  getInsight,
  type InsightData,
  InsightError,
} from '@/services/aiService'

export const useInsight = (id: string) => {
  const isRequestPending = useRef(false)
  const { getFormData, updateSimulation } = useSimulationStorage()
  const [insight, setInsight] = useState<InsightData | null>(
    () => getFormData(id)?.insight ?? null,
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchInsight = useCallback(
    async (simulationId: string) => {
      if (isRequestPending.current) return
      const simulation = getFormData(simulationId)

      if (!simulation) {
        setError('Simulação não encontrada.')
        return
      }

      if (simulation.insight) {
        setInsight(simulation.insight)
        setError(null)
        return simulation.insight
      }

      isRequestPending.current = true
      setIsLoading(true)
      setError(null)

      try {
        const prompt = buildAIPrompt(simulation)
        const data = await getInsight(prompt)
        updateSimulation(simulationId, { insight: data })
        setInsight(data)
        return data
      } catch (cause) {
        setError(
          cause instanceof InsightError
            ? cause.message
            : 'Não foi possível gerar ou salvar o diagnóstico. Tente novamente.',
        )
      } finally {
        isRequestPending.current = false
        setIsLoading(false)
      }
    },
    [getFormData, updateSimulation],
  )

  useEffect(() => {
    // Evita loop infinito de requisições para a API do Gemini
    if (insight || isLoading || isRequestPending.current || error) {
      return
    }

    let cancelled = false
    void Promise.resolve().then(() => {
      if (!cancelled) return fetchInsight(id)
    })
    return () => {
      cancelled = true
    }
  }, [id, insight, isLoading, error, fetchInsight])

  return { insight, isLoading, error, fetchInsight }
}
