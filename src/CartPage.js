import React, { useState } from 'react';
import Footer from './Footer';
import { formatPrice } from './formatPrice';
import { calculateOrderTotals } from './orderPricing';
import { STORE_NAME } from './storeConfig';
import './Nav.css';
import './CartPage.css';

function CartPage({ items, cartItemsCount, onOpenCart, onRemoveItem, onUpdateQuantity, onBackToHome, onClearCart, onGoToCheckout }) {
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const { subtotal, shipping, total } = calculateOrderTotals(items);

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <nav className="site-nav">
        <button type="button" className="nav-back-btn" onClick={onBackToHome}>
          ← Voltar
        </button>
        <span className="nav-mark">{STORE_NAME}</span>
        <div style={{ position: 'relative' }}>
          <button type="button" className="nav-bag" aria-label="Ver sacola" onClick={onOpenCart}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 8h12l-1 12H7L6 8Z" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" />
            </svg>
          </button>
          {cartItemsCount > 0 && <span className="cart-badge">{cartItemsCount}</span>}
        </div>
      </nav>

      <main className="cart-page">
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Sua sacola</h1>
        {items.length === 0 ? (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <p style={{ fontSize: '1.1rem', margin: 0 }}>Sua sacola está vazia.</p>
            <button type="button" className="checkout-btn" onClick={onBackToHome}>
              Voltar às compras
            </button>
          </div>
        ) : (
          <>
            <div className="cart-items">
              {items.map((item) => (
                <div key={item.item_id} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-details">
                    <h3>{item.name}</h3>
                    <p className="cart-item-category">{item.category}</p>
                    <p className="cart-item-price">{formatPrice(item.price)}</p>
                  </div>
                  <div className="cart-item-controls">
                    <button type="button" onClick={() => onUpdateQuantity(item.item_id, Math.max(1, item.quantity - 1))}>
                      −
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => onUpdateQuantity(item.item_id, Math.max(1, parseInt(e.target.value, 10) || 1))}
                      min="1"
                    />
                    <button type="button" onClick={() => onUpdateQuantity(item.item_id, item.quantity + 1)}>
                      +
                    </button>
                  </div>
                  <p className="cart-item-subtotal">
                    {formatPrice(Number(item.price) * item.quantity)}
                  </p>
                  <button type="button" className="remove-btn" style={{margin: '0.5rem 0'}} onClick={() => onRemoveItem(item.item_id)}>
                    Remover
                  </button>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <div className="cart-summary-breakdown">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="summary-row">
                  <span>Frete</span>
                  <span>{formatPrice(shipping)}</span>
                </div>
                <div className="summary-row total-row">
                  <span>Total</span>
                  <span className="total-price">{formatPrice(total)}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                <button
                  type="button"
                  className="remove-btn"
                  onClick={() => setShowClearConfirm(true)}
                >
                  Remover tudo
                </button>
                <button type="button" className="checkout-btn" onClick={onGoToCheckout}>
                  Ir para o pagamento
                </button>
              </div>
            </div>
          </>
        )}
      </main>

      {showClearConfirm && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="clear-cart-modal-title">
          <div className="modal-card">
            <h3 id="clear-cart-modal-title">Remover todos os itens?</h3>
            <p>Isso vai esvaziar sua sacola.</p>
            <div className="modal-actions">
              <button type="button" className="checkout-btn" onClick={() => setShowClearConfirm(false)}>
                Cancelar
              </button>
              <button
                type="button"
                className="remove-btn"
                onClick={() => { onClearCart(); setShowClearConfirm(false); }}
              >
                Sim, remover tudo
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default CartPage;