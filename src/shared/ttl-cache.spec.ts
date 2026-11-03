import { TtlCache } from './ttl-cache';

describe('TtlCache', () => {
  let nowSpy: jest.SpyInstance;
  let clock: number;

  beforeEach(() => {
    clock = 1000;
    nowSpy = jest.spyOn(Date, 'now').mockImplementation(() => clock);
  });

  afterEach(() => {
    nowSpy.mockRestore();
  });

  it('returns a stored value before it expires', () => {
    const cache = new TtlCache<number, string>({ maxSize: 10, ttlMs: 500 });
    cache.set(1, 'alice');

    clock = 1400;
    expect(cache.get(1)).toBe('alice');
  });

  it('returns undefined once a value has expired', () => {
    const cache = new TtlCache<number, string>({ maxSize: 10, ttlMs: 500 });
    cache.set(1, 'alice');

    clock = 1600;
    expect(cache.get(1)).toBeUndefined();
    expect(cache.size).toBe(0);
  });

  it('returns undefined for a missing key', () => {
    const cache = new TtlCache<number, string>({ maxSize: 10, ttlMs: 500 });
    expect(cache.get(42)).toBeUndefined();
  });

  it('evicts the oldest entry when the max size is exceeded', () => {
    const cache = new TtlCache<number, string>({ maxSize: 2, ttlMs: 10000 });
    cache.set(1, 'a');
    cache.set(2, 'b');
    cache.set(3, 'c');

    expect(cache.size).toBe(2);
    expect(cache.get(1)).toBeUndefined();
    expect(cache.get(2)).toBe('b');
    expect(cache.get(3)).toBe('c');
  });

  it('removes an entry on delete', () => {
    const cache = new TtlCache<number, string>({ maxSize: 10, ttlMs: 500 });
    cache.set(1, 'alice');
    cache.delete(1);

    expect(cache.get(1)).toBeUndefined();
  });

  it('refreshes expiry when a key is overwritten', () => {
    const cache = new TtlCache<number, string>({ maxSize: 10, ttlMs: 500 });
    cache.set(1, 'alice');

    clock = 1400;
    cache.set(1, 'bob');

    clock = 1800;
    expect(cache.get(1)).toBe('bob');
  });
});
