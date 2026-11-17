export const SHIPPING_COST = 8;
export const FREE_SHIPPING_THRESHOLD = 80;

const TAX_RATE = 0;

export function calculateOrderTotals(items) {
  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );
  const tax = Math.round(subtotal * TAX_RATE);
  const shipping = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;

  return {
    subtotal,
    tax,
    shipping,
    total: subtotal + tax + shipping,
  };
}
