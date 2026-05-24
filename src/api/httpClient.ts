const API_BASE = import.meta.env.VITE_FIPE_API_URL ?? 'http://localhost:3000'
const inFlightGetRequests = new Map<string, Promise<unknown>>()

type ApiErrorBody = {
  error?: string
}

export async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const method = init?.method?.toUpperCase() ?? 'GET'
  const dedupeKey = `${method}:${path}`

  if (method === 'GET') {
    const cachedPromise = inFlightGetRequests.get(dedupeKey)
    if (cachedPromise) {
      return (await cachedPromise) as T
    }
  }

  const requestPromise = (async () => {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(init?.headers ?? {}),
      },
      ...init,
    })

    if (!response.ok) {
      let errorMessage = `Falha na requisicao: ${response.status}`

      try {
        const body = (await response.json()) as ApiErrorBody
        if (body.error) {
          errorMessage = body.error
        }
      } catch {
        // Keep the fallback message when response is not JSON.
      }

      throw new Error(errorMessage)
    }

    if (response.status === 204) {
      return null
    }

    return response.json()
  })()

  if (method === 'GET') {
    inFlightGetRequests.set(dedupeKey, requestPromise)
  }

  try {
    return (await requestPromise) as T
  } finally {
    if (method === 'GET') {
      inFlightGetRequests.delete(dedupeKey)
    }
  }
}