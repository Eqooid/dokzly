export interface FetchSSEOptions {
  method?: 'GET' | 'POST'
  headers?: Record<string, string>
  body?: BodyInit | null
  signal?: AbortSignal
  onMessage?: (data: any) => void
  onError?: (error: any) => void
  onReconnect?: (delay: number) => void
  maxRetries?: number
  retryDelay?: number // ms
}

/**
 * Fetch-based EventSource replacement (supports POST, headers, reconnect)
 */
export async function fetchSSE(url: string, options: FetchSSEOptions = {}) {
  const {
    method = 'GET',
    headers = {},
    body = null,
    signal,
    onMessage,
    onError,
    onReconnect,
    maxRetries = 5,
    retryDelay = 1000,
  } = options

  let retries = 0
  let backoff = retryDelay

  const connect = async () => {
    try {
      const res = await fetch(url, {
        method,
        headers: {
          Accept: 'text/event-stream',
          ...headers,
        },
        body,
        signal,
      })

      if (!res.ok || !res.body) throw new Error(`Bad response: ${res.status}`)

      const reader = res.body.getReader()
      const decoder = new TextDecoder('utf-8')
      let buffer = ''

      while (true) {
        const { value, done } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        let boundary
        while ((boundary = buffer.indexOf('\n\n')) !== -1) {
          const chunk = buffer.slice(0, boundary)
          buffer = buffer.slice(boundary + 2)

          const dataLines = chunk
            .split('\n')
            .filter((line) => line.startsWith('data:'))
            .map((line) => line.slice(5).trim())

          if (dataLines.length > 0) {
            const raw = dataLines.join('\n')
            try {
              const parsed = JSON.parse(raw)
              onMessage?.(parsed)
            } catch {
              onMessage?.(raw)
            }
          }
        }
      }

      // graceful end → reset retry count
      retries = 0
    } catch (err) {
      onError?.(err)
      if (signal?.aborted) return
      if (retries >= maxRetries) {
        console.warn('Max retries reached, giving up.')
        return
      }

      retries++
      backoff = Math.min(backoff * 2, 30000) // exponential backoff
      onReconnect?.(backoff)
      console.warn(`Reconnecting in ${backoff}ms... (retry ${retries})`)
      await new Promise((r) => setTimeout(r, backoff))
      connect()
    }
  }

  connect()
}
