import 'react-loading-skeleton/dist/skeleton.css'

import Skeleton from 'react-loading-skeleton'

import { Content } from '@/components/features/Insights/Content'
import { Conversation } from '@/components/features/Insights/Conversation'
import { Error } from '@/components/features/Insights/Error'
import { useInsight } from '@/hooks/useInsight'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'

interface AIInsightCardProps {
  simulationId: string
}

export function AIInsightsCard({ simulationId }: AIInsightCardProps) {
  const { insight, isLoading, error, fetchInsight } = useInsight(simulationId)
  const { getFormData } = useSimulationStorage()
  const simulation = getFormData(simulationId)

  return (
    <div className="bg-card shadow-card order-2 flex min-w-0 flex-col rounded-2xl p-5 lg:order-1 lg:col-span-2">
      <div className="mb-2 flex items-center gap-1.5">
        <span>✨</span>
        <span className="text-primary text-[11px] font-medium uppercase">
          Insight Financeiro Personalizado
        </span>
      </div>
      <h2 className="mb-3 text-xl font-semibold break-words sm:text-2xl">
        Plano de Ação: {simulation?.goalName}
      </h2>

      <Conversation key={simulationId} simulationId={simulationId}>
        {isLoading && (
          <div className="flex">
            <Skeleton
              count={10.5}
              baseColor="var(--color-skeleton-base)"
              highlightColor="var(--color-skeleton-highlight)"
              className="mb-3 flex rounded-lg"
              containerClassName="flex-1"
              inline
            />
          </div>
        )}
        {!isLoading && error && (
          <Error
            simulationId={simulationId}
            message={error}
            onRetry={() => fetchInsight(simulationId)}
          />
        )}
        {!isLoading && insight && <Content insight={insight} />}
      </Conversation>
    </div>
  )
}
