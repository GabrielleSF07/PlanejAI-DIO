interface GeminiResponse {
  candidates?: {
    content?: {
      parts?: { text?: string }[]
    }
  }[]
}

export interface InsightData {
  feasibility: {
    status: 'viable' | 'needs_adjustment' | 'unfeasible'
    content: string
  }
  diagnosis: { content: string }
  suggestions: { items: string[] }
  extraIncome: { items: string[] }
  investment: { items: string[] }
  motivation: { content: string }
}

export class InsightError extends Error {}

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY?.trim()
const MODEL_NAME = 'gemini-flash-latest'
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent`

const callGeminiAPI = async (prompt: string): Promise<GeminiResponse> => {
  if (!API_KEY) {
    throw new InsightError(
      'A chave do Gemini não está configurada. Configure VITE_GEMINI_API_KEY e reinicie o servidor.',
    )
  }

  let response: Response
  try {
    response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': API_KEY,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
    })
  } catch {
    throw new InsightError(
      'Não foi possível conectar ao Gemini. Verifique sua conexão e tente novamente.',
    )
  }

  if (!response.ok) {
    if (response.status === 429) {
      throw new InsightError(
        'O limite de uso do Gemini foi atingido (429). Aguarde e confira a cota do projeto no Google AI Studio.',
      )
    }
    if (response.status === 401 || response.status === 403) {
      throw new InsightError(
        'O Gemini recusou o acesso. Verifique a chave da API e as permissões do projeto.',
      )
    }
    if (response.status >= 500) {
      throw new InsightError(
        `O serviço do Gemini está temporariamente indisponível (${response.status}). Tente novamente em alguns instantes.`,
      )
    }
    if (response.status === 400) {
      throw new InsightError(
        'O Gemini recusou a solicitação (400). Verifique a chave da API e a configuração do projeto.',
      )
    }
    throw new InsightError(
      `Não foi possível gerar o diagnóstico (HTTP ${response.status}). Tente novamente.`,
    )
  }

  return (await response.json()) as GeminiResponse
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null

const isInsight = (value: unknown): value is InsightData => {
  if (!isRecord(value) || !isRecord(value.feasibility)) return false
  if (
    !['viable', 'needs_adjustment', 'unfeasible'].includes(
      String(value.feasibility.status),
    )
  )
    return false
  if (typeof value.feasibility.content !== 'string') return false
  for (const key of ['diagnosis', 'motivation']) {
    const section = value[key]
    if (!isRecord(section) || typeof section.content !== 'string') return false
  }
  for (const key of ['suggestions', 'extraIncome', 'investment']) {
    const section = value[key]
    if (
      !isRecord(section) ||
      !Array.isArray(section.items) ||
      !section.items.every((item) => typeof item === 'string')
    )
      return false
  }
  return true
}

export const getInsight = async (prompt: string): Promise<InsightData> => {
  const response = await callGeminiAPI(prompt)
  const text = response.candidates?.[0]?.content?.parts
    ?.map((part) => part.text ?? '')
    .join('')
    .trim()
  if (!text) {
    throw new InsightError(
      'O Gemini não retornou um diagnóstico. Tente novamente.',
    )
  }

  let data: unknown
  try {
    const json = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '')
    data = JSON.parse(json)
  } catch {
    throw new InsightError(
      'O Gemini retornou uma resposta em formato inválido. Tente novamente.',
    )
  }
  if (!isInsight(data)) {
    throw new InsightError(
      'O Gemini retornou um diagnóstico incompleto. Tente novamente.',
    )
  }
  return data
}
