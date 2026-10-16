import { ExternalLink, Goal, History, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/shared/Button'
import { PageHero } from '@/components/shared/PageHero'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import { parseCurrency } from '@/util/currency'

const currency = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
const formatDate = (value?: string) => {
  if (!value) return 'Data não registrada'
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? 'Data não registrada'
    : date.toLocaleDateString('pt-BR')
}

export function SimulationHistoryPage() {
  const { getSimulations, deleteSimulation } = useSimulationStorage()
  const [simulations, setSimulations] = useState(() =>
    getSimulations().reverse(),
  )
  const [announcement, setAnnouncement] = useState('')

  const handleDelete = (id: string, goalName: string) => {
    deleteSimulation(id)
    setSimulations((current) =>
      current.filter((simulation) => simulation.id !== id),
    )
    setAnnouncement(`A simulação ${goalName} foi excluída.`)
  }

  return (
    <main className="mx-auto min-h-[calc(100dvh-65px)] max-w-7xl px-6 py-10 sm:px-8 sm:py-11">
      <PageHero
        title="Histórico de simulações"
        subtitle="Acompanhe o histórico de seus planos financeiros."
      />
      <p role="status" className="sr-only">
        {announcement}
      </p>
      {simulations.length === 0 ? (
        <div className="bg-card shadow-card flex flex-col items-center gap-3 rounded-3xl px-6 py-16 text-center">
          <History size={40} className="text-primary" aria-hidden="true" />
          <h2 className="text-lg font-semibold">Nenhuma simulação salva</h2>
          <p className="text-muted-foreground max-w-md text-sm">
            Crie sua primeira simulação para planejar uma meta e consultar seus
            resultados aqui.
          </p>
          <Link
            to="/"
            className="text-primary mt-2 text-sm font-semibold underline underline-offset-4"
          >
            Nova simulação
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {simulations.map((simulation) => {
            const months = Number(simulation.goalDeadline)
            const monthlySavings =
              months > 0
                ? currency(parseCurrency(simulation.goalAmount) / months)
                : 'Prazo não informado'
            return (
              <article
                key={simulation.id}
                className="bg-card shadow-card grid min-w-0 grid-cols-1 items-center gap-5 rounded-3xl px-6 py-7 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:gap-6 lg:px-8 lg:py-8"
              >
                <div className="flex min-w-0 items-center gap-5 sm:col-span-2 lg:col-span-1">
                  <div className="text-primary flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#ede5fa]">
                    <Goal size={24} aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-sm font-semibold break-words">
                      {simulation.goalName}
                    </h2>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {formatDate(simulation.createdAt)}
                    </p>
                  </div>
                </div>
                {[
                  [
                    'Custo da meta',
                    currency(parseCurrency(simulation.goalAmount)),
                  ],
                  ['Prazo', `${simulation.goalDeadline} meses`],
                  ['Economia mensal', monthlySavings],
                ].map(([label, value]) => (
                  <dl key={label} className="min-w-0">
                    <dt className="text-muted-foreground text-[11px] uppercase">
                      {label}
                    </dt>
                    <dd className="mt-0.5 text-sm font-semibold break-words">
                      {value}
                    </dd>
                  </dl>
                ))}
                <div className="border-border flex items-center justify-end gap-5 border-t pt-4 sm:col-span-2 lg:col-span-1 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
                  <Button
                    type="button"
                    variant="ghost"
                    icon={Trash2}
                    className="p-2 text-red-500 [&_svg]:size-5"
                    aria-label={`Excluir simulação: ${simulation.goalName}`}
                    onClick={() =>
                      handleDelete(simulation.id, simulation.goalName)
                    }
                  />
                  <Link
                    to={`/resultado/${simulation.id}`}
                    aria-label={`Ver detalhes: ${simulation.goalName}`}
                    className="bg-secondary-button border-border inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-1.5 text-xs hover:opacity-80"
                  >
                    <ExternalLink size={14} aria-hidden="true" />
                    Ver detalhes
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </main>
  )
}
