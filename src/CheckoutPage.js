import React, { useEffect, useMemo, useRef, useState } from 'react';
import Footer from './Footer';
import { formatPrice } from './formatPrice';
import { PAYMENT_METHODS } from './paymentMethods';
import { fetchAccount } from './accountApi';
import { generateIdempotencyKey } from './idempotency';
import { STORE_NAME } from './storeConfig';
import './Nav.css';
import './CartPage.css';
import './CheckoutPage.css';

const SHIPPING_COST = 8;
const FREE_SHIPPING_THRESHOLD = 80;
const TAX_RATE = 0;

function FormField({ id, label, ...inputProps }) {
    return (
        <div className="form-field">
            <label htmlFor={id}>{label}</label>
            <input id={id} {...inputProps} />
        </div>
    );
}

function FormSection({ title, children }) {
    return (
        <div className="form-section">
            <span className="form-section-title">{title}</span>
            {children}
        </div>
    );
}

function PaymentMethodSelector({ selectedId, onSelect }) {
    return (
        <div className="checkout-payment-block">
            <h2>Forma de pagamento</h2>
            <div className="payment-options">
                {PAYMENT_METHODS.map((method) => (
                    <label
                        key={method.id}
                        className={`payment-option${selectedId === method.id ? ' is-selected' : ''}`}
                    >
                        <input
                            type="radio"
                            name="payment-method"
                            value={method.id}
                            checked={selectedId === method.id}
                            onChange={() => onSelect(method.id)}
                            required
                        />
                        <div className="payment-option-content">
                            {method.image && (
                                <img src={method.image} alt="" className="payment-option-image" />
                            )}
                            <span>{method.label}</span>
                        </div>
                    </label>
                ))}
            </div>
        </div>
    );
}

function OrderSummary({
    items,
    subtotal,
    tax,
    shipping,
    total,
    onPlaceOrder,
    isSubmitting,
    error,
    priceChanges,
    onConfirmPriceChanges,
    removedProductIds,
    onBackToCart,
}) {
    const nameById = useMemo(
        () => Object.fromEntries(items.map((item) => [item.id, item.name])),
        [items]
    );

    return (
        <aside className="checkout-summary-card">
            <h2>Resumo do pedido</h2>
            <div className="checkout-items-list">
                {items.map((item) => (
                    <div key={item.id} className="checkout-item-row">
                        <div>
                            <p className="checkout-item-name">{item.name}</p>
                            <p className="checkout-item-meta">Qtd. {item.quantity} · {item.category}</p>
                        </div>
                        <span className="checkout-item-price">{formatPrice(item.price)}</span>
                    </div>
                ))}
            </div>

            <div className="checkout-breakdown">
                <div className="summary-row">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="summary-row">
                    <span>Impostos</span>
                    <span>{formatPrice(tax)}</span>
                </div>
                <div className="summary-row">
                    <span>Frete</span>
                    <span>{formatPrice(shipping)}</span>
                </div>
                <div className="summary-row total-row">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                </div>
            </div>

            {error && <p className="checkout-error">{error}</p>}

            {removedProductIds && (
                <div className="checkout-warning-notice">
                    <p>Estes itens não estão mais disponíveis. Remova-os da sua sacola:</p>
                    <ul>
                        {removedProductIds.map((id) => (
                            <li key={id}>{nameById[id] || id}</li>
                        ))}
                    </ul>
                    <button type="button" className="checkout-btn checkout-btn-secondary" onClick={onBackToCart}>
                        Voltar à sacola
                    </button>
                </div>
            )}

            {priceChanges && (
                <div className="checkout-warning-notice">
                    <p>O preço destes itens mudou desde que você os adicionou:</p>
                    <ul>
                        {priceChanges.map((change) => (
                            <li key={change.product_id}>
                                {nameById[change.product_id] || change.product_id}:{' '}
                                {formatPrice(change.old_price)} → {formatPrice(change.new_price)}
                            </li>
                        ))}
                    </ul>
                    <button
                        type="button"
                        className="checkout-btn checkout-btn-secondary"
                        onClick={onConfirmPriceChanges}
                        disabled={isSubmitting}
                    >
                        Aceitar os novos preços e continuar
                    </button>
                </div>
            )}

            {!priceChanges && !removedProductIds && (
                <button type="button" className="checkout-btn" onClick={onPlaceOrder} disabled={isSubmitting}>
                    {isSubmitting ? 'Enviando pedido...' : 'Fazer pedido'}
                </button>
            )}
        </aside>
    );
}

function CheckoutPage({ items, cartItemsCount, onBackToCart, onPlaceOrder, user, token }) {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [priceChanges, setPriceChanges] = useState(null);
    const [removedProductIds, setRemovedProductIds] = useState(null);
    // One key per checkout attempt: generated when the customer lands on this
    // page and reused across retries of that same attempt (including the
    // "accept new prices" resubmit), so a double-click or a network retry
    // can't create two orders. A brand new attempt (new page mount) gets a
    // brand new key.
    const idempotencyKeyRef = useRef(null);
    if (idempotencyKeyRef.current === null) {
        idempotencyKeyRef.current = generateIdempotencyKey();
    }
    const [form, setForm] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        address_street: '',
        address_city_state: '',
        address_zip: '',
    });

    useEffect(() => {
        if (!token) return;
        fetchAccount(token)
            .then((account) => {
                setForm((prev) => ({
                    ...prev,
                    name: account.name || prev.name,
                    email: account.email || prev.email,
                    phone: account.default_phone || prev.phone,
                    address_street: account.default_address_street || prev.address_street,
                    address_city_state: account.default_address_city_state || prev.address_city_state,
                    address_zip: account.default_address_zip || prev.address_zip,
                }));
                if (account.default_payment_method) {
                    setSelectedPaymentMethod(account.default_payment_method);
                }
            })
            .catch(() => {
                // no saved defaults yet, no problem — continue with a blank form
            });
    }, [token]);

    const updateField = (field) => (event) => {
        setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const subtotal = useMemo(
        () => items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0),
        [items]
    );
    const tax = Math.round(subtotal * TAX_RATE);
    const shipping = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const total = subtotal + tax + shipping;

    const handlePlaceOrder = async (confirmPriceChanges = false) => {
        const requiredClientFields = [
            ['name', 'client-name'],
            ['email', 'client-email'],
            ['phone', 'client-phone'],
        ];
        const missingField = requiredClientFields.find(([field]) => !form[field].trim());

        if (missingField) {
            setError('Preencha seu nome, e-mail e telefone para continuar.');
            document.getElementById(missingField[1])?.focus();
            return;
        }

        if (!selectedPaymentMethod) {
            setError('Escolha uma forma de pagamento para continuar.');
            document.querySelector('.payment-option input')?.focus();
            return;
        }

        setError(null);
        setPriceChanges(null);
        setRemovedProductIds(null);
        setIsSubmitting(true);
        try {
            await onPlaceOrder(
                {
                    ...form,
                    payment_method: selectedPaymentMethod,
                    ...(confirmPriceChanges ? { confirm_price_changes: true } : {}),
                },
                idempotencyKeyRef.current
            );
        } catch (err) {
            if (err.code === 'PRICE_CHANGED') {
                setPriceChanges(err.details.changes);
            } else if (err.code === 'PRODUCT_REMOVED') {
                setRemovedProductIds(err.details.product_ids);
            } else {
                setError(err.message || 'Algo deu errado. Tente novamente.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

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

            <main className="checkout-page">
                <section className="checkout-hero">
                    <div className="checkout-hero-copy">
                        <p className="eyebrow">Finalização segura</p>
                        <h1>Finalize seu pedido</h1>
                        <p>Informe seus dados, confira sua sacola e escolha a forma de pagamento.</p>
                    </div>
                </section>

                <div className="checkout-grid">
                    <section className="checkout-form-card">
                        <FormSection title="Seus dados">
                            <FormField
                                id="client-name"
                                label="Nome"
                                type="text"
                                placeholder="Seu nome"
                                value={form.name}
                                onChange={updateField('name')}
                                required
                            />
                            <FormField
                                id="client-email"
                                label="E-mail"
                                type="email"
                                placeholder="voce@exemplo.com"
                                value={form.email}
                                onChange={updateField('email')}
                                required
                            />
                            <FormField
                                id="client-phone"
                                label="Telefone"
                                type="tel"
                                placeholder="(11) 99999-9999"
                                value={form.phone}
                                onChange={updateField('phone')}
                                required
                            />
                        </FormSection>

                        <FormSection title="Endereço de entrega">
                            <FormField
                                id="delivery-address"
                                label="Rua e número"
                                placeholder="Rua das Flores, 123"
                                value={form.address_street}
                                onChange={updateField('address_street')}
                            />
                            <FormField
                                id="delivery-city-state"
                                label="Cidade e estado"
                                placeholder="São Paulo, SP"
                                value={form.address_city_state}
                                onChange={updateField('address_city_state')}
                            />
                            <FormField
                                id="delivery-zip-code"
                                label="CEP"
                                placeholder="00000-000"
                                value={form.address_zip}
                                onChange={updateField('address_zip')}
                            />
                        </FormSection>

                        <PaymentMethodSelector
                            selectedId={selectedPaymentMethod}
                            onSelect={setSelectedPaymentMethod}
                        />
                    </section>

                    <OrderSummary
                        items={items}
                        subtotal={subtotal}
                        tax={tax}
                        shipping={shipping}
                        total={total}
                        onPlaceOrder={() => handlePlaceOrder(false)}
                        isSubmitting={isSubmitting}
                        error={error}
                        priceChanges={priceChanges}
                        onConfirmPriceChanges={() => handlePlaceOrder(true)}
                        removedProductIds={removedProductIds}
                        onBackToCart={onBackToCart}
                    />
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default CheckoutPage;
