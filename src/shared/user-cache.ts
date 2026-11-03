import { TtlCache } from './ttl-cache';

// Shared cache of authenticated users, keyed by user id, to avoid a database
// round-trip for every authenticated request.
export const USER_CACHE_TTL_MS = 5 * 60 * 1000;
export const USER_CACHE_MAX_SIZE = 1000;

export const userCache = new TtlCache<number, any>({
  maxSize: USER_CACHE_MAX_SIZE,
  ttlMs: USER_CACHE_TTL_MS,
});
