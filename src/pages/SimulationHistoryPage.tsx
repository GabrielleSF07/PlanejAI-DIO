import {
  ArrowRight,
  CalendarClock,
  Goal,
  History,
  Plus,
  Trash2,
} from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/shared/Button'
import { PageHero } from '@/components/shared/PageHero'
import { useSimulationStorage } from '@/hooks/useSimulationStorage'
import { parseCurrency } from '@/util/currency'
import { calcMonthlySavings } from '@/util/simulation'

const currency = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

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
    <main className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <div className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <PageHero
            title="Histórico de simulações"
            subtitle="Reveja seus objetivos e os diagnósticos financeiros salvos."
          />
        </div>
        <Link
          to="/"
          className="bg-primary text-primary-foreground mb-6 inline-flex w-fit items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold hover:opacity-80"
        >
          <Plus size={18} aria-hidden="true" />
          Nova simulação
        </Link>
      </div>

      <p role="status" className="sr-only">
        {announcement}
      </p>

      {simulations.length === 0 ? (
        <div className="bg-card flex flex-col items-center gap-3 rounded-2xl px-6 py-16 text-center shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)]">
          <History size={40} className="text-primary" aria-hidden="true" />
          <h2 className="text-lg font-semibold">Nenhuma simulação salva</h2>
          <p className="text-muted-foreground max-w-md text-sm">
            Crie sua primeira simulação para planejar uma meta. Ela aparecerá
            aqui para você consultar depois.
          </p>
        </div>
      ) : (
        <>
          <p className="text-muted-foreground mb-4 text-sm">
            {simulations.length}{' '}
            {simulations.length === 1 ? 'simulação salva' : 'simulações salvas'}
          </p>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {simulations.map((simulation) => (
              <article
                key={simulation.id}
                className="bg-card flex min-w-0 flex-col rounded-2xl p-6 shadow-[4px_4px_18px_0px_rgba(0,0,0,0.2)]"
              >
                <div className="mb-5 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-primary mb-2 flex items-center gap-2 text-xs font-semibold tracking-widest uppercase">
                      <Goal size={16} aria-hidden="true" /> Meta financeira
                    </div>
                    <h2 className="text-lg font-semibold break-words">
                      {simulation.goalName}
                    </h2>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    icon={Trash2}
                    className="shrink-0 p-2 text-red-500"
                    aria-label={`Excluir simulação: ${simulation.goalName}`}
                    onClick={() =>
                      handleDelete(simulation.id, simulation.goalName)
                    }
                  />
                </div>

                <p className="mb-2 text-2xl font-semibold break-words">
                  {currency(parseCurrency(simulation.goalAmount))}
                </p>
                <p className="text-muted-foreground mb-5 flex items-center gap-2 text-sm">
                  <CalendarClock size={16} aria-hidden="true" />
                  Prazo de {simulation.goalDeadline} meses
                </p>
                <dl className="border-border mb-5 space-y-3 border-t pt-4 text-sm">
                  {[
                    [
                      'Renda mensal',
                      currency(parseCurrency(simulation.income)),
                    ],
                    [
                      'Custos fixos',
                      currency(parseCurrency(simulation.expenses)),
                    ],
                    [
                      'Dívidas / parcelas',
                      currency(parseCurrency(simulation.debts)),
                    ],
                    [
                      'Disponível por mês',
                      currency(calcMonthlySavings(simulation)),
                    ],
                  ].map(([label, value]) => (
                    <div
                      key={label}
                      className="flex flex-wrap justify-between gap-x-3 gap-y-1"
                    >
                      <dt className="text-muted-foreground">{label}</dt>
                      <dd className="font-medium">{value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="text-muted-foreground mb-4 text-xs">
                  {simulation.insight
                    ? '✨ Diagnóstico da IA salvo'
                    : 'Diagnóstico disponível ao abrir os detalhes'}
                </p>
                <Link
                  to={`/resultado/${simulation.id}`}
                  aria-label={`Ver detalhes: ${simulation.goalName}`}
                  className="bg-primary text-primary-foreground mt-auto flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold hover:opacity-80"
                >
                  Ver detalhes <ArrowRight size={16} aria-hidden="true" />
                </Link>
              </article>
            ))}
          </div>
        </>
      )}
    </main>
  )
}
