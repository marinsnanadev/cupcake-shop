import React, { useEffect, useState } from 'react';
import Footer from './Footer';
import { formatPrice } from './formatPrice';
import { PAYMENT_METHODS } from './paymentMethods';
import { fetchAccount, updateAccount } from './accountApi';
import { STORE_NAME } from './storeConfig';
import './Nav.css';
import './CartPage.css';
import './AccountPage.css';

function formatOrderDate(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' });
}

const ORDER_STATUS_LABELS = {
  received: 'Recebido',
  preparing: 'Em preparo',
  out_for_delivery: 'Saiu para entrega',
  delivered: 'Entregue',
};

function AccountPage({ token, cartItemsCount, onOpenCart, onBackToHome }) {
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [form, setForm] = useState(null);

  const loadAccount = () => {
    setLoading(true);
    fetchAccount(token)
      .then((data) => {
        setAccount(data);
        setError(null);
      })
      .catch(() => setError('Não foi possível carregar sua conta. Tente novamente.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (token) loadAccount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const startEditing = () => {
    setForm({
      default_phone: account.default_phone || '',
      default_address_street: account.default_address_street || '',
      default_address_city_state: account.default_address_city_state || '',
      default_address_zip: account.default_address_zip || '',
      default_payment_method: account.default_payment_method || PAYMENT_METHODS[0].id,
    });
    setSaveError(null);
    setIsEditing(true);
  };

  const updateField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const updated = await updateAccount(token, form);
      setAccount((prev) => ({ ...prev, ...updated }));
      setIsEditing(false);
    } catch (err) {
      setSaveError(err.message || 'Não foi possível salvar as alterações.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <nav className="site-nav">
        <button type="button" className="nav-back-btn" onClick={onBackToHome}>
          ← Voltar ao início
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

      <main className="account-page">
        {loading && <p className="account-status">Carregando sua conta...</p>}
        {error && <p className="account-status account-status--error">{error}</p>}

        {account && (
          <>
            <section className="account-hero">
              <p className="eyebrow">Minha conta</p>
              <h1>Olá, {account.name.split(' ')[0]}</h1>
              <p>{account.email}</p>
            </section>

            <div className="account-grid">
              <section className="account-card">
                <div className="account-card-header">
                  <h2>Endereço e pagamento</h2>
                  {!isEditing && (
                    <button type="button" className="account-edit-btn" onClick={startEditing}>
                      Editar
                    </button>
                  )}
                </div>

                {!isEditing ? (
                  <dl className="account-info-list">
                    <div>
                      <dt>Telefone</dt>
                      <dd>{account.default_phone || '—'}</dd>
                    </div>
                    <div>
                      <dt>Rua</dt>
                      <dd>{account.default_address_street || '—'}</dd>
                    </div>
                    <div>
                      <dt>Cidade e estado</dt>
                      <dd>{account.default_address_city_state || '—'}</dd>
                    </div>
                    <div>
                      <dt>CEP</dt>
                      <dd>{account.default_address_zip || '—'}</dd>
                    </div>
                    <div>
                      <dt>Forma de pagamento</dt>
                      <dd>
                        {PAYMENT_METHODS.find((m) => m.id === account.default_payment_method)?.label
                          || 'Não informado'}
                      </dd>
                    </div>
                  </dl>
                ) : (
                  <div className="account-form">
                    <div className="form-field">
                      <label htmlFor="account-phone">Telefone</label>
                      <input id="account-phone" type="tel" value={form.default_phone} onChange={updateField('default_phone')} />
                    </div>
                    <div className="form-field">
                      <label htmlFor="account-street">Rua e número</label>
                      <input id="account-street" type="text" value={form.default_address_street} onChange={updateField('default_address_street')} />
                    </div>
                    <div className="form-field">
                      <label htmlFor="account-city-state">Cidade e estado</label>
                      <input id="account-city-state" type="text" value={form.default_address_city_state} onChange={updateField('default_address_city_state')} />
                    </div>
                    <div className="form-field">
                      <label htmlFor="account-zip">CEP</label>
                      <input id="account-zip" type="text" value={form.default_address_zip} onChange={updateField('default_address_zip')} />
                    </div>

                    <div className="form-field">
                      <label htmlFor="account-payment">Forma de pagamento</label>
                      <select
                        id="account-payment"
                        value={form.default_payment_method}
                        onChange={updateField('default_payment_method')}
                      >
                        {PAYMENT_METHODS.map((method) => (
                          <option key={method.id} value={method.id}>{method.label}</option>
                        ))}
                      </select>
                    </div>

                    {saveError && <p className="checkout-error">{saveError}</p>}

                    <div className="account-form-actions">
                      <button type="button" className="secondary-btn" onClick={() => setIsEditing(false)} disabled={isSaving}>
                        Cancelar
                      </button>
                      <button type="button" className="checkout-btn" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? 'Salvando...' : 'Salvar alterações'}
                      </button>
                    </div>
                  </div>
                )}
              </section>

              <section className="account-card">
                <h2>Pedidos recentes</h2>
                {account.orders.length === 0 ? (
                  <p className="account-empty-orders">Você ainda não fez nenhum pedido.</p>
                ) : (
                  <ul className="account-orders-list">
                    {account.orders.map((order) => (
                      <li key={order.id} className="account-order">
                        <div className="account-order-header">
                          <span className="account-order-date">{formatOrderDate(order.created_at)}</span>
                          <span className="account-order-total">{formatPrice(order.total)}</span>
                        </div>
                        <p className="account-order-items">
                          {order.items.map((item) => `${item.quantity}× ${item.name}`).join(', ')}
                        </p>
                        <p className="account-order-status">
                          Situação: {ORDER_STATUS_LABELS[order.status] || order.status}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default AccountPage;