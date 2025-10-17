'use client';
import { createContext, useContext, useReducer, useEffect, useState } from 'react';

const Store = createContext();

function getInitialCart() {
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('cart');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }
  return [];
}

const initialState = { cart: { cartItems: [] } };

function reducer(state, action) {
  switch (action.type) {
    case 'CART_ADD_ITEM': {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find((i) => i._id === newItem._id);
      const cartItems = existItem
        ? state.cart.cartItems.map((i) => (i._id === existItem._id ? newItem : i))
        : [...state.cart.cartItems, newItem];
      return { ...state, cart: { ...state.cart, cartItems } };
    }
    case 'CART_REMOVE_ITEM':
      return {
        ...state,
        cart: {
          ...state.cart,
          cartItems: state.cart.cartItems.filter((i) => i._id !== action.payload._id),
        },
      };
    case 'CLEAR_CART':
      return { ...state, cart: { cartItems: [] } };
    case 'SET_CART':
      return { ...state, cart: { cartItems: action.payload } };
    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // restore once on mount
    const stored = localStorage.getItem('cart');
    if (stored) {
      dispatch({ type: 'SET_CART', payload: JSON.parse(stored) });
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('cart', JSON.stringify(state.cart.cartItems));
    }
  }, [state.cart.cartItems, mounted]);

  // ⛔ Avoid rendering until client is mounted
  if (!mounted) return null;

  return <Store.Provider value={{ state, dispatch }}>{children}</Store.Provider>;
}

export const useStore = () => useContext(Store);