
import { rateLimiter } from './cache'

export function checkRateLimit(identifier: string = 'default'): boolean {
  return rateLimiter.consume(1)
}

export function createRateLimitResponse() {
  return new Response(
    JSON.stringify({
      error: 'Rate limit exceeded',
      message: 'Too many requests. Please try again later.'
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': '60'
      }
    }
  )
}
