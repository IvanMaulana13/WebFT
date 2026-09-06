/**
 * In-memory rate limiter untuk login endpoint dan public search API.
 *
 * Catatan: Rate limit ini per-process (in-memory).
 * Cukup untuk single-instance deployment.
 */

interface RateLimitRecord {
  count: number;
  resetAt: number; // Unix timestamp (ms)
}

// Global store untuk login failures — bertahan selama process hidup
const store = new Map<string, RateLimitRecord>();

const WINDOW_MS = 15 * 60 * 1000; // 15 menit
const MAX_FAILURES = 5;

/**
 * Cek apakah key sedang di-rate-limit untuk login.
 * @returns { limited: true } jika sudah melebihi batas
 */
export function checkRateLimit(key: string): {
  limited: boolean;
  remaining: number;
} {
  const now = Date.now();
  const record = store.get(key);

  if (!record || now > record.resetAt) {
    // Belum ada record atau window sudah expired
    return { limited: false, remaining: MAX_FAILURES };
  }

  return {
    limited: record.count >= MAX_FAILURES,
    remaining: Math.max(0, MAX_FAILURES - record.count),
  };
}

/**
 * Catat satu percobaan gagal untuk key tertentu (login).
 */
export function recordFailure(key: string): void {
  const now = Date.now();
  const record = store.get(key);

  if (!record || now > record.resetAt) {
    // Mulai window baru
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
  } else {
    // Tambah count dalam window yang sama
    store.set(key, { count: record.count + 1, resetAt: record.resetAt });
  }
}

/**
 * Reset rate limit untuk key (dipanggil setelah login sukses).
 */
export function resetLimit(key: string): void {
  store.delete(key);
}

// ─────────────────────────────────────────────
// Rate Limiter untuk Public Search Endpoint
// Default: 30 request / menit per IP
// ─────────────────────────────────────────────
const searchStore = new Map<string, RateLimitRecord>();
const SEARCH_WINDOW_MS = 60 * 1000; // 1 menit
const SEARCH_MAX_REQUESTS = 30; // 30 request/menit

export function checkSearchRateLimit(
  ip: string,
  maxRequests = SEARCH_MAX_REQUESTS,
  windowMs = SEARCH_WINDOW_MS
): {
  limited: boolean;
  remaining: number;
} {
  const now = Date.now();
  const record = searchStore.get(ip);

  if (!record || now > record.resetAt) {
    searchStore.set(ip, { count: 1, resetAt: now + windowMs });
    return { limited: false, remaining: maxRequests - 1 };
  }

  if (record.count >= maxRequests) {
    return { limited: true, remaining: 0 };
  }

  record.count += 1;
  return { limited: false, remaining: maxRequests - record.count };
}
