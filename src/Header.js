import React from 'react';
import './Nav.css';
import './Header.css';
import { STORE_NAME } from './storeConfig';

function Header({ cartItemsCount, onOpenCart, onOpenShop, frontImageIndex, heroImages, user, onLogout, onOpenLogin, onOpenAccount }) {
  return (
    <>
      <nav className="site-nav site-nav-home">
        <span className="nav-mark">{STORE_NAME}</span>
        <div className="nav-links">
          <button type="button" className="nav-link-btn" onClick={onOpenShop}>
            Loja
          </button>
          <a href="#story">Nossa história</a>
          {user ? (
            <span className="nav-account">
              <button type="button" className="nav-link-btn nav-account-name" onClick={onOpenAccount}>
                Olá, {user.name.split(' ')[0]}
              </button>
              <button type="button" className="nav-link-btn nav-logout-btn" onClick={onLogout}>
                Sair
              </button>
            </span>
          ) : (
            <button type="button" className="nav-link-btn" onClick={onOpenLogin}>
              Entrar
            </button>
          )}
        </div>
        <div className="nav-actions">
          <button
            type="button"
            className="nav-bag"
            aria-label={user ? 'Minha conta' : 'Entrar'}
            onClick={user ? onOpenAccount : onOpenLogin}
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="12" cy="8" r="3.4" />
              <path d="M5 20c0-3.6 3.1-6.4 7-6.4s7 2.8 7 6.4" />
            </svg>
          </button>
          <div style={{ position: 'relative' }}>
            <button type="button" className="nav-bag" aria-label="Ver sacola" onClick={onOpenCart}>
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M6 8h12l-1 12H7L6 8Z" />
                <path d="M9 8V6a3 3 0 0 1 6 0v2" />
              </svg>
            </button>
            {cartItemsCount > 0 && <span className="cart-badge">{cartItemsCount}</span>}
          </div>
        </div>
      </nav>

      <header className="hero-section">
        <div className="hero-copy">
          <p className="eyebrow">Cupcakes artesanais, feitos com carinho</p>
          <h1 className="brand-title">{STORE_NAME}</h1>
          <p className="hero-text">
            Sabores irresistíveis, massa fofinha e coberturas feitas à mão. Descubra seu novo cupcake favorito e deixe qualquer momento mais doce.
          </p>
          <div className="hero-actions">
            <a href="#shop" className="primary-btn">
              Ver nossos sabores
            </a>
            <a href="#story" className="secondary-btn">
              Conheça a loja
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <span className="hero-rail">FEITO COM CARINHO</span>
          <div className="hero-deck">
            <div className="hero-deck-shape" />
            <div className="hero-deck-card hero-deck-card--back">
              <img className={`hero-image ${frontImageIndex === 0 ? 'is-active' : ''}`} src={heroImages[0]} alt="Cupcake red velvet" />
              <img className={`hero-image ${frontImageIndex === 1 ? 'is-active' : ''}`} src={heroImages[1]} alt="Cupcake de morango" />
            </div>
            <div className="hero-deck-card hero-deck-card--front">
              <img className={`hero-image ${frontImageIndex === 0 ? 'is-active' : ''}`} src={heroImages[1]} alt="Cupcake de morango" />
              <img className={`hero-image ${frontImageIndex === 1 ? 'is-active' : ''}`} src={heroImages[0]} alt="Cupcake red velvet" />
              <span className="hero-tag">Feito na casa</span>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
