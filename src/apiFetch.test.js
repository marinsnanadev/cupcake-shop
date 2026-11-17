import { apiFetch, NETWORK_ERROR_MESSAGE } from './apiFetch';

describe('apiFetch', () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('shows the localized message when a network request fails', async () => {
    global.fetch = jest.fn().mockRejectedValue(new TypeError('Failed to fetch'));

    await expect(apiFetch('/api')).rejects.toThrow(NETWORK_ERROR_MESSAGE);
  });

  it('preserves non-network errors', async () => {
    const error = new Error('Request aborted');
    global.fetch = jest.fn().mockRejectedValue(error);

    await expect(apiFetch('/api')).rejects.toBe(error);
  });
});
