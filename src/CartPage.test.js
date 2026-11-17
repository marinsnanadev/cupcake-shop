import React from 'react';
import { render, screen, within } from '@testing-library/react';
import CartPage from './CartPage';

function renderCart(price) {
  render(
    <CartPage
      items={[{
        item_id: 1,
        name: 'Cupcake de Chocolate',
        price,
        quantity: 4,
        image: 'cupcake.jpg',
        category: 'Clássicos',
      }]}
      cartItemsCount={1}
      onOpenCart={() => {}}
      onRemoveItem={() => {}}
      onUpdateQuantity={() => {}}
      onBackToHome={() => {}}
      onClearCart={() => {}}
      onGoToCheckout={() => {}}
    />
  );
}

function summaryValue(label) {
  const row = screen.getByText(label).closest('.summary-row');
  return within(row).getByText(/R\$\s?\d+,\d{2}/);
}

describe('CartPage order summary', () => {
  it('charges R$ 8,00 shipping at the R$ 80,00 threshold', () => {
    renderCart(20);

    expect(summaryValue('Subtotal')).toHaveTextContent(/R\$\s?80,00/);
    expect(summaryValue('Frete')).toHaveTextContent(/R\$\s?8,00/);
    expect(summaryValue('Total')).toHaveTextContent(/R\$\s?88,00/);
  });

  it('waives shipping above R$ 80,00', () => {
    renderCart(21);

    expect(summaryValue('Subtotal')).toHaveTextContent(/R\$\s?84,00/);
    expect(summaryValue('Frete')).toHaveTextContent(/R\$\s?0,00/);
    expect(summaryValue('Total')).toHaveTextContent(/R\$\s?84,00/);
  });
});
