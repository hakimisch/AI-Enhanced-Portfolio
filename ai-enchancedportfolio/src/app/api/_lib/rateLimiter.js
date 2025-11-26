// /src/app/api/_lib/rateLimiter.js
const ipBuckets = new Map(); // { ip => { count, firstTs } }

const WINDOW_MS = 15_000; // 15s window
const MAX_REQUESTS = 8; // max POSTs per WINDOW_MS

export function checkRateLimit(ip) {
  if (!ip) return { ok: true };

  const now = Date.now();
  const bucket = ipBuckets.get(ip);

  if (!bucket) {
    ipBuckets.set(ip, { count: 1, firstTs: now });
    return { ok: true, remaining: MAX_REQUESTS - 1 };
  }

  if (now - bucket.firstTs > WINDOW_MS) {
    // reset window
    ipBuckets.set(ip, { count: 1, firstTs: now });
    return { ok: true, remaining: MAX_REQUESTS - 1 };
  }

  if (bucket.count >= MAX_REQUESTS) {
    return { ok: false, retryAfter: Math.ceil((WINDOW_MS - (now - bucket.firstTs)) / 1000) };
  }

  bucket.count += 1;
  ipBuckets.set(ip, bucket);
  return { ok: true, remaining: MAX_REQUESTS - bucket.count };
}
