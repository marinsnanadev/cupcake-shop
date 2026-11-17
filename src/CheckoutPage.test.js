import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import CheckoutPage from './CheckoutPage';
import { CheckoutError } from './accountApi';

const BASE_ITEMS = [{ id: 'chocolate', name: 'Cupcake de Chocolate', price: 10, quantity: 1, image: 'test.jpg', category: 'Clássicos' }];

function fillRequiredCheckoutFields() {
  fireEvent.change(screen.getByLabelText('Nome'), { target: { value: 'Pessoa Teste' } });
  fireEvent.change(screen.getByLabelText('E-mail'), { target: { value: 'teste@exemplo.com' } });
  fireEvent.change(screen.getByLabelText('Telefone'), { target: { value: '(11) 99999-9999' } });
  fireEvent.click(screen.getByLabelText('Pix'));
}

describe('CheckoutPage', () => {
  it('renders the checkout form, summary, and payment options', () => {
    render(
      <CheckoutPage
        items={[{ id: '1', name: 'White Suit', price: 180, quantity: 1, image: 'test.jpg', category: 'Suits' }]}
        cartItemsCount={1}
        onBackToCart={() => {}}
        onBackToHome={() => {}}
        onPlaceOrder={() => {}}
      />
    );

    expect(screen.getByText(/endereço de entrega/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/rua e número/i)).toBeInTheDocument();
    expect(screen.getByText(/frete/i)).toBeInTheDocument();
    expect(screen.getByText(/fazer pedido/i)).toBeInTheDocument();
    expect(screen.getByText('Pix')).toBeInTheDocument();
    expect(screen.getByText('Cartão de crédito')).toBeInTheDocument();
    expect(screen.getByText('Dinheiro na entrega')).toBeInTheDocument();
  });

  it('shows a price-change notice with the old/new prices, and resubmits with confirm_price_changes when accepted', async () => {
    const onPlaceOrder = jest.fn()
      .mockRejectedValueOnce(new CheckoutError({
        code: 'PRICE_CHANGED',
        message: 'O preço de um ou mais itens mudou. Confira e confirme para continuar.',
        changes: [{ product_id: 'chocolate', old_price: 10, new_price: 12 }],
      }))
      .mockResolvedValueOnce({});

    render(
      <CheckoutPage
        items={BASE_ITEMS}
        cartItemsCount={1}
        onBackToCart={() => {}}
        onBackToHome={() => {}}
        onPlaceOrder={onPlaceOrder}
      />
    );

    fillRequiredCheckoutFields();
    fireEvent.click(screen.getByText(/^fazer pedido$/i));

    await waitFor(() => {
      expect(screen.getByText(/o preço destes itens mudou/i)).toBeInTheDocument();
    });
    const priceChangeNotice = screen.getByText(/o preço destes itens mudou/i).closest('.checkout-warning-notice');
    expect(within(priceChangeNotice).getByText(/cupcake de chocolate/i)).toBeInTheDocument();
    // "Place order" is hidden while the price-change notice is showing, so
    // the customer can't accidentally submit the stale price again.
    expect(screen.queryByText(/^fazer pedido$/i)).not.toBeInTheDocument();

    fireEvent.click(screen.getByText(/aceitar os novos preços e continuar/i));

    await waitFor(() => {
      expect(onPlaceOrder).toHaveBeenCalledTimes(2);
    });
    expect(onPlaceOrder.mock.calls[1][0]).toEqual(
      expect.objectContaining({ confirm_price_changes: true })
    );

    // Same attempt, same key — that's what lets the backend dedupe a retry.
    const firstKey = onPlaceOrder.mock.calls[0][1];
    const secondKey = onPlaceOrder.mock.calls[1][1];
    expect(firstKey).toBeTruthy();
    expect(secondKey).toBe(firstKey);
  });

  it('shows a removed-product notice and lets the customer go back to the bag', async () => {
    const onBackToCart = jest.fn();
    const onPlaceOrder = jest.fn().mockRejectedValue(new CheckoutError({
      code: 'PRODUCT_REMOVED',
      message: 'One or more items in your cart are no longer available. Please remove them to continue.',
      product_ids: ['chocolate'],
    }));

    render(
      <CheckoutPage
        items={BASE_ITEMS}
        cartItemsCount={1}
        onBackToCart={onBackToCart}
        onBackToHome={() => {}}
        onPlaceOrder={onPlaceOrder}
      />
    );

    fillRequiredCheckoutFields();
    fireEvent.click(screen.getByText(/^fazer pedido$/i));

    await waitFor(() => {
      expect(screen.getByText(/não estão mais disponíveis/i)).toBeInTheDocument();
    });
    const removedNotice = screen.getByText(/não estão mais disponíveis/i).closest('.checkout-warning-notice');
    expect(within(removedNotice).getByText(/cupcake de chocolate/i)).toBeInTheDocument();

    fireEvent.click(within(removedNotice).getByText(/voltar à sacola/i));
    expect(onBackToCart).toHaveBeenCalledTimes(1);
  });

  it('shows a plain error message for a generic checkout failure', async () => {
    const onPlaceOrder = jest.fn().mockRejectedValue(new Error('Sua sacola está vazia'));

    render(
      <CheckoutPage
        items={BASE_ITEMS}
        cartItemsCount={1}
        onBackToCart={() => {}}
        onBackToHome={() => {}}
        onPlaceOrder={onPlaceOrder}
      />
    );

    fillRequiredCheckoutFields();
    fireEvent.click(screen.getByText(/^fazer pedido$/i));

    await waitFor(() => {
      expect(screen.getByText('Sua sacola está vazia')).toBeInTheDocument();
    });
  });
});