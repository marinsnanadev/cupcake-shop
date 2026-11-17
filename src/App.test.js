import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from './App';

test('renders the splash screen with Cupcake Shop and opens the storefront when the button is clicked', async () => {
  render(<App />);
  expect(screen.getByText(/cupcake shop/i)).toBeInTheDocument();
  expect(screen.getByText(/cupcakes feitos com carinho/i)).toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: /conheça a loja/i }));

  await waitFor(() => {
    expect(screen.getByText(/escolha sua categoria/i)).toBeInTheDocument();
  });
});