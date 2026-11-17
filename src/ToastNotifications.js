import React from 'react';
import { formatPrice } from './formatPrice';

function ToastNotifications({ toasts }) {
  return toasts.map((toast, index) => (
    <div
      key={toast.id}
      className="toast-notification"
      style={{ bottom: `${2 + index * 5.4}rem` }}
      role={toast.isError ? 'alert' : undefined}
    >
      <div className="toast-content">
        <span className="toast-icon">{toast.isError ? '!' : '✓'}</span>
        <div className="toast-text">
          <p className="toast-title">
            {toast.isError ? toast.message : `${toast.product.name} adicionado à sacola`}
          </p>
          {!toast.isError && <p className="toast-price">{formatPrice(toast.product.price)}</p>}
        </div>
      </div>
    </div>
  ));
}

export default ToastNotifications;