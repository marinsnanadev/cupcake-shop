import { formatPrice } from './formatPrice';

test('formats prices as Brazilian reais', () => {
  expect(formatPrice(8)).toMatch(/R\$\s?8,00/);
});
