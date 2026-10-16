import type { InsightData } from '@/services/aiService'

interface ContentProps {
  insight: InsightData
}

export function Content({ insight }: ContentProps) {
  return (
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
  )
}
