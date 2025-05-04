import { LRUCache } from "lru-cache"

type Options = {
  uniqueTokenPerInterval?: number
  interval?: number
}

export class RateLimiter {
  tokenCache: LRUCache<string, number>
  interval: number

  constructor({ uniqueTokenPerInterval = 500, interval = 60000 }: Options = {}) {
    this.tokenCache = new LRUCache({
      max: uniqueTokenPerInterval,
      ttl: interval,
    })
    this.interval = interval
  }

  async check(limit: number, token: string): Promise<void> {
    const tokenCount = (this.tokenCache.get(token) as number) || 0

    if (tokenCount >= limit) {
      throw new Error("Rate limit exceeded")
    }

    this.tokenCache.set(token, tokenCount + 1)
  }
}

export const rateLimit = new RateLimiter({
  uniqueTokenPerInterval: 100,
  interval: 60 * 1000, // 1 minute
})
