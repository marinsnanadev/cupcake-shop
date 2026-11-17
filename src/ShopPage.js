import React, { useEffect, useState } from 'react';
import { imageMap } from './imageMap';
import { API_BASE } from './apiConfig';
import { STORE_NAME } from './storeConfig';
import './Nav.css';
import './ShopPage.css';

function ShopPage({ onBackToHome, onSelectCategory, cartItemsCount = 0, onOpenCart }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/categories`)
      .then((res) => {
        if (!res.ok) throw new Error('Não foi possível carregar as categorias.');
        return res.json();
      })
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="shop-loading">Carregando categorias...</div>;
  }

  if (error) {
    return <div className="shop-error">Erro: {error}</div>;
  }

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

      <main className="shop-page">
        <section className="shop-hero">
          <p className="eyebrow">Nossos sabores</p>
          <h1>Escolha sua categoria</h1>
          <p>
            Explore nossos cupcakes clássicos e especiais, preparados para deixar seu dia mais doce.
          </p>
        </section>

        <section className="shop-grid">
          {categories.map((category) => (
            <article key={category.name} className="shop-card">
              <div className="shop-card-image">
                <img src={imageMap[category.image]} alt={category.name} />
              </div>
              <div className="shop-card-content">
                <p className="shop-card-accent">{category.accent}</p>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <button type="button" className="shop-card-link" onClick={() => onSelectCategory(category)}>
                  Ver sabores
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}

export default ShopPage;
