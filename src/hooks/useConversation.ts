import { useRef, useState } from 'react'

import type { ConversationMessage } from '@/data/simulation'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import { getConversationReply, InsightError } from '@/services/aiService'

export function useConversation(simulationId: string) {
  const { getFormData, updateSimulation } = useSimulationStorage()
  const [messages, setMessages] = useState<ConversationMessage[]>(
    () => getFormData(simulationId)?.conversation ?? [],
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isRequestPending = useRef(false)
  const unsavedReply = useRef<ConversationMessage | null>(null)
  const hasUnansweredQuestion = messages.at(-1)?.role === 'user'

  const sendQuestion = async (question?: string) => {
    if (isRequestPending.current) return
    const text = question?.trim()
    if (!hasUnansweredQuestion && !text) return

    isRequestPending.current = true
    setIsLoading(true)
    setError(null)
    const nextMessages: ConversationMessage[] = hasUnansweredQuestion
      ? messages
      : [...messages, { id: crypto.randomUUID(), role: 'user', content: text! }]
    setMessages(nextMessages)

    try {
      const simulation = getFormData(simulationId)
      if (!simulation) throw new InsightError('Simulação não encontrada.')
      updateSimulation(simulationId, { conversation: nextMessages })
      const reply = unsavedReply.current ?? {
        id: crypto.randomUUID(),
        role: 'model' as const,
        content: await getConversationReply(simulation, nextMessages),
      }
      // Se o armazenamento falhar, a nova tentativa salva a resposta sem chamar a API outra vez.
      unsavedReply.current = reply
      const completed = [...nextMessages, reply]
      updateSimulation(simulationId, { conversation: completed })
      unsavedReply.current = null
      setMessages(completed)
    } catch (cause) {
      setError(
        cause instanceof InsightError
          ? cause.message
          : 'Não foi possível enviar ou salvar a conversa. Tente novamente.',
      )
    } finally {
      isRequestPending.current = false
      setIsLoading(false)
    }
  }

  return { messages, isLoading, error, hasUnansweredQuestion, sendQuestion }
}
