import React, { useState } from 'react';
import AuthForm from './AuthForm';
import { STORE_NAME } from './storeConfig';
import './Nav.css';
import './CheckoutPage.css';
import './CheckoutGate.css';

function CheckoutGate({ cartItemsCount, onBackToCart, onContinueAsGuest, onLogin, onRegister }) {
  const [showAuthForm, setShowAuthForm] = useState(false);

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <nav className="site-nav">
        <button type="button" className="nav-back-btn" onClick={onBackToCart}>
          ← Voltar à sacola
        </button>
        <span className="nav-mark">{STORE_NAME}</span>
        <div style={{ position: 'relative' }}>
          <button type="button" className="nav-bag" aria-label="Ver sacola" onClick={onBackToCart}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M6 8h12l-1 12H7L6 8Z" />
              <path d="M9 8V6a3 3 0 0 1 6 0v2" />
            </svg>
          </button>
          {cartItemsCount > 0 && <span className="cart-badge">{cartItemsCount}</span>}
        </div>
      </nav>

      <div className="checkout-page checkout-gate-page">
        <div className="checkout-hero">
          <div className="checkout-hero-copy">
            <p className="eyebrow">Finalizar pedido</p>
            <h1>Como você quer continuar?</h1>
          </div>
        </div>

        {!showAuthForm ? (
          <div className="checkout-gate-choices">
            <button type="button" className="checkout-gate-card" onClick={onContinueAsGuest}>
              <h2>Continuar como visitante</h2>
              <p>Finalize seu pedido sem criar uma conta. Você pode criar uma depois.</p>
            </button>
            <button type="button" className="checkout-gate-card checkout-gate-card--accent" onClick={() => setShowAuthForm(true)}>
              <h2>Entrar ou criar uma conta</h2>
              <p>Salve seus dados e acompanhe seus pedidos. Os itens da sacola serão mantidos.</p>
            </button>
          </div>
        ) : (
          <div className="checkout-gate-auth">
            <button type="button" className="checkout-gate-back" onClick={() => setShowAuthForm(false)}>
              ← Escolher outra opção
            </button>
            <AuthForm onLogin={onLogin} onRegister={onRegister} />
          </div>
        )}
      </div>
    </div>
  );
}

export default CheckoutGate;