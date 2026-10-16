import { useInsight } from '@/hooks/useInsight'

interface AIInsightCardProps {
  simulationId: string
}

export function AIInsightsCard({ simulationId }: AIInsightCardProps) {
  const { insight, isLoading, error, fetchInsight } = useInsight(simulationId)

  return (
    <div className="bg-card order-2 rounded-2xl p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)] lg:order-1 lg:col-span-2">
      <h2 className="mb-4 text-xl font-semibold">Painel de Insights</h2>
      {isLoading && <p role="status">Gerando seu diagnóstico...</p>}
      {error && (
        <div role="alert">
          <p>{error}</p>
          <button type="button" onClick={() => void fetchInsight(simulationId)}>
            Tentar novamente
          </button>
        </div>
      )}
      {insight && (
        <div className="space-y-4">
          <section>
            <h3 className="font-semibold">Viabilidade da meta</h3>
            <p>{insight.feasibility.content}</p>
          </section>
          <section>
            <h3 className="font-semibold">Diagnóstico</h3>
            <p>{insight.diagnosis.content}</p>
          </section>
          {[
            { title: 'Sugestões', items: insight.suggestions.items },
            { title: 'Renda extra', items: insight.extraIncome.items },
            { title: 'Investimentos', items: insight.investment.items },
          ].map(({ title, items }) => (
            <section key={title}>
              <h3 className="font-semibold">{title}</h3>
              <ul className="list-disc pl-5">
                {items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
          <p>{insight.motivation.content}</p>
        </div>
      )}
    </div>
  )
}
