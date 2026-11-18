import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CategoryPage from './CategoryPage';

describe('CategoryPage mobile navigation', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('keeps the cart button accessible and shows its item count', async () => {
    render(
      <CategoryPage
        category={{ name: 'Clássicos', description: 'Sabores queridos.' }}
        cartItemsCount={2}
        onOpenCart={() => {}}
        onBackToShop={() => {}}
        onBackToHome={() => {}}
        onAddToCart={() => {}}
      />
    );

    expect(screen.getByRole('navigation')).toHaveClass('site-nav-category');
    expect(screen.getByRole('button', { name: 'Ver sacola, 2 produtos' })).toBeVisible();
    expect(screen.getByText('2')).toHaveClass('cart-badge');
    await waitFor(() => expect(global.fetch).toHaveBeenCalledTimes(1));
  });
});
