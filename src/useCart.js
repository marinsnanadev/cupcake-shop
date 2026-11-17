import { useState, useEffect, useRef } from 'react';
import { imageMap } from './imageMap';
import { getSessionId } from './session';
import { NETWORK_ERROR_MESSAGE } from './apiFetch';
import {
  fetchCart,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCartApi,
  fetchMyCart,
  addItemToMyCart,
  updateMyItemQuantity,
  removeMyItemFromCart,
  clearMyCartApi,
} from './cartApi';

export function useCart(token) {
  const [cartItems, setCartItems] = useState([]);
  const [toasts, setToasts] = useState([]);
  const sessionId = useRef(getSessionId()).current;
  const isAuthenticated = Boolean(token);

  const showError = (error, fallbackMessage) => {
    const toastId = `error-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const message = error.message || fallbackMessage || NETWORK_ERROR_MESSAGE;
    setToasts((prevToasts) => [...prevToasts, { id: toastId, isError: true, message }]);
    window.setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== toastId));
    }, 4000);
  };

  const mapCartResponse = (data) =>
    data.map((entry) => ({
      item_id: entry.item_id,
      id: entry.product.id,
      name: entry.product.name,
      price: entry.product.price,
      image: imageMap[entry.product.image],
      category: entry.product.category,
      quantity: entry.quantity,
    }));

  const loadCart = async () => {
    try {
      const data = isAuthenticated ? await fetchMyCart(token) : await fetchCart(sessionId);
      setCartItems(mapCartResponse(data));
    } catch (err) {
      showError(err, 'Não foi possível carregar sua sacola.');
      setCartItems([]);
      return false;
    }
    return true;
  };

  useEffect(() => {
    loadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const addToCart = async (product) => {
    try {
      if (isAuthenticated) {
        await addItemToMyCart(token, product.id, 1);
      } else {
        await addItemToCart(sessionId, product.id, 1);
      }
      if (!(await loadCart())) return;
    } catch (err) {
      showError(err, 'Não foi possível adicionar o produto à sacola.');
      return;
    }

    const toastId = `${product.name}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((prevToasts) => [...prevToasts, { id: toastId, product }]);
    window.setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== toastId));
    }, 3000);
  };

  const removeFromCart = async (itemId) => {
    try {
      if (isAuthenticated) {
        await removeMyItemFromCart(token, itemId);
      } else {
        await removeItemFromCart(sessionId, itemId);
      }
      await loadCart();
    } catch (err) {
      showError(err, 'Não foi possível remover o item.');
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      if (isAuthenticated) {
        await updateMyItemQuantity(token, itemId, quantity);
      } else {
        await updateItemQuantity(sessionId, itemId, quantity);
      }
      await loadCart();
    } catch (err) {
      showError(err, 'Não foi possível atualizar a quantidade.');
    }
  };

  const clearCart = async () => {
    try {
      if (isAuthenticated) {
        await clearMyCartApi(token);
      } else {
        await clearCartApi(sessionId);
      }
      await loadCart();
    } catch (err) {
      showError(err, 'Não foi possível esvaziar sua sacola.');
    }
  };

  return { cartItems, toasts, addToCart, removeFromCart, updateQuantity, clearCart, reloadCart: loadCart, sessionId };
}