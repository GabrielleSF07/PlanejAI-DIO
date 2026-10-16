import { LoaderCircle, MessageCircle, RefreshCw, Send } from 'lucide-react'
import {
  type FormEvent,
  type PropsWithChildren,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react'

import { Button } from '@/components/shared/Button'
import { useConversation } from '@/hooks/useConversation'

export function Conversation({
  simulationId,
  children,
}: PropsWithChildren<{ simulationId: string }>) {
  const { messages, isLoading, error, hasUnansweredQuestion, sendQuestion } =
    useConversation(simulationId)
  const [question, setQuestion] = useState('')
  const inputId = useId()
  const scrollContainer = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = scrollContainer.current
    if (container && messages.length > 0) {
      const reducedMotion = window.matchMedia(
        '(prefers-reduced-motion: reduce)',
      ).matches
      container.scrollTo({
        top: container.scrollHeight,
        behavior: reducedMotion ? 'instant' : 'smooth',
      })
    }
  }, [messages, isLoading, error])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!question.trim() || isLoading || hasUnansweredQuestion) return
    void sendQuestion(question)
    setQuestion('')
  }

  return (
    <section
      className="flex min-h-0 flex-1 flex-col"
      aria-label="Conversa com o educador financeiro"
    >
      <div
        ref={scrollContainer}
        className="border-border h-96 min-h-0 scrollbar-thin [scrollbar-color:var(--border)_transparent] overflow-y-auto overscroll-contain rounded-2xl border px-3 pb-3 sm:px-4 lg:h-100"
      >
        {children}
        <div
          role="log"
          aria-label="Histórico da conversa"
          aria-live="polite"
          aria-relevant="additions text"
        >
          {messages.map((message) => (
            <div
              key={message.id}
              className="border-border border-t py-6 first:mt-6 last:pb-0"
            >
              <p className="text-muted-foreground mb-2 flex items-center gap-2 text-sm font-medium">
                <MessageCircle
                  size={20}
                  className="text-primary shrink-0"
                  aria-hidden="true"
                />
                {message.role === 'user' ? 'Você' : 'Resposta da IA'}
              </p>
              <p
                className={`text-sm leading-relaxed break-words whitespace-pre-wrap ${message.role === 'user' ? 'text-muted-foreground' : 'text-foreground'}`}
              >
                {message.content}
              </p>
            </div>
          ))}
          {isLoading && (
            <p
              role="status"
              className="text-muted-foreground flex items-center gap-2 py-5 text-sm"
            >
              <LoaderCircle
                size={16}
                className="animate-spin"
                aria-hidden="true"
              />
              O educador está respondendo...
            </p>
          )}
          {!isLoading && (error || hasUnansweredQuestion) && (
            <div className="space-y-3 py-4">
              <p
                role="alert"
                className={
                  error
                    ? 'text-sm text-red-500'
                    : 'text-muted-foreground text-sm'
                }
              >
                {error ?? 'Esta pergunta ainda não recebeu uma resposta.'}
              </p>
              <Button
                type="button"
                variant="secondary"
                icon={RefreshCw}
                className="text-xs [&_svg]:size-4"
                onClick={() => void sendQuestion()}
              >
                Tentar novamente
              </Button>
            </div>
          )}
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="border-border mt-6 flex items-center gap-2 border-t pt-6"
      >
        <label htmlFor={inputId} className="sr-only">
          Sua pergunta sobre a simulação
        </label>
        <input
          id={inputId}
          type="text"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Quais são os investimentos mais seguros para minha meta?"
          disabled={isLoading || hasUnansweredQuestion}
          className="bg-input border-border text-foreground placeholder:text-muted-foreground shadow-input focus:border-primary h-12 min-w-0 flex-1 rounded-2xl border px-4 text-xs outline-none disabled:opacity-60"
        />
        <Button
          type="submit"
          variant="primary"
          icon={isLoading ? LoaderCircle : Send}
          className={`size-12 shrink-0 rounded-xl p-0 [&_svg]:size-5 ${isLoading ? '[&_svg]:animate-spin' : ''}`}
          aria-label="Enviar pergunta"
          disabled={!question.trim() || isLoading || hasUnansweredQuestion}
        />
      </form>
    </section>
  )
}
