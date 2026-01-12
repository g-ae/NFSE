import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getPopularBundles, searchBundles } from '../services/api';

describe('API Service', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('getPopularBundles fetches bundles from the correct endpoint', async () => {
    const mockBundles = [{ bundleId: 1, content: 'Test Bundle' }];
    
    vi.mocked(fetch).mockResolvedValue({
      json: vi.fn().mockResolvedValue(mockBundles),
      status: 200,
    });

    const result = await getPopularBundles();

    expect(fetch).toHaveBeenCalledWith('/api/bundles');
    expect(result).toEqual(mockBundles);
  });

  it('searchBundles filters bundles by seller city', async () => {
    const mockBundles = [
      { bundleId: 1, sellerId: 101 },
      { bundleId: 2, sellerId: 102 },
    ];
    const mockSellers = [
      { sellerId: 101, city: 'Lausanne' },
      { sellerId: 102, city: 'Geneva' },
    ];

    vi.mocked(fetch)
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue(mockBundles),
        status: 200,
      })
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue(mockSellers),
        status: 200,
      });

    const result = await searchBundles('lausanne');

    expect(result).toHaveLength(1);
    expect(result[0].bundleId).toBe(1);
  });
});
