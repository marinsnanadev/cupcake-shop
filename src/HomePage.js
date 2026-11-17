import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import Reveal from './Reveal';
import ToastNotifications from './ToastNotifications';
import { formatPrice } from './formatPrice';
import { collections, featuredProducts, heroImages, storyImage } from './homeData';
import { CONTACT_EMAIL, STORE_NAME } from './storeConfig';

function HomePage({ cartItemsCount, onOpenCart, onOpenShop, onSelectCategory, addToCart, checkoutComplete, toasts, user, onLogout, onOpenLogin, onOpenAccount }) {
  const [frontImageIndex, setFrontImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrontImageIndex(prev => (prev + 1) % 2);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleCategorySelect = (item) => {
    onSelectCategory({
      name: item.title,
      description: item.blurb,
      accent: item.title,
    });
  };

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <Header
        cartItemsCount={cartItemsCount}
        onOpenCart={onOpenCart}
        onOpenShop={onOpenShop}
        frontImageIndex={frontImageIndex}
        heroImages={heroImages}
        user={user}
        onLogout={onLogout}
        onOpenLogin={onOpenLogin}
        onOpenAccount={onOpenAccount}
      />

      <ToastNotifications toasts={toasts} />
      {checkoutComplete && (
        <div className="toast-notification" style={{ bottom: '2rem' }}>
          <div className="toast-content">
            <span className="toast-icon">✓</span>
            <div className="toast-text">
              <p className="toast-title">Pedido realizado com sucesso!</p>
              <p className="toast-price">Obrigado por escolher a {STORE_NAME}.</p>
            </div>
          </div>
        </div>
      )}

      <main>
        <Reveal as="section" className="collections-section" id="shop">
          <div className="collection-header">
            <div className="section-heading">
              <p className="eyebrow">Feitos para adoçar seu dia</p>
              <h2>Escolha sua categoria</h2>
            </div>
          </div>
          <div className="collection-grid">
            {collections.map((item) => (
              <article
                key={item.title}
                className="collection-card"
                role="button"
                tabIndex={0}
                onClick={() => handleCategorySelect(item)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    handleCategorySelect(item);
                  }
                }}
              >
                <div className="card-image">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="card-content">
                  <h3>{item.title}</h3>
                  <p>{item.blurb}</p>
                </div>
              </article>
            ))}
          </div>
        </Reveal>

        <Reveal as="section" className="featured-section" id="story">
          <div className="editorial-panel">
            <div className="editorial-image">
              <img src={storyImage} alt="Cupcake de chocolate com cobertura cremosa" />
            </div>
            <div className="editorial-copy">
              <p className="eyebrow">Por que escolher a {STORE_NAME}?</p>
              <h2>&ldquo;Pequenos momentos, grandes sabores&rdquo;</h2>
              <p>
                Cupcakes artesanais, preparados com ingredientes selecionados e carinho em cada detalhe.
              </p>
            </div>
          </div>

          <div className="product-list">
            {featuredProducts.map((product) => (
              <article key={product.name} className="product-card">
                <div className="product-image">
                  <img src={product.image} alt={product.name} />
                </div>
                <div className="product-meta">
                  <span>{product.category}</span>
                  <h3>{product.name}</h3>
                  <p className="product-price">{formatPrice(product.price)}</p>
                  <button type="button" className="purchase-btn" onClick={() => addToCart(product)}>Adicionar à sacola</button>
                </div>
              </article>
            ))}
          </div>
        </Reveal>
      </main>

      <Footer />

      <section className="footer-extended">
        <div className="customer-service">
          <h3>Atendimento</h3>
          <ul>
            <li><a href="#shop">Cardápio</a></li>
            <li><a href="#story">Nossa história</a></li>
            <li><a href={`mailto:${CONTACT_EMAIL}`}>Fale conosco</a></li>
          </ul>
        </div>
      </section>
    </div>
  );
}

export default HomePage;