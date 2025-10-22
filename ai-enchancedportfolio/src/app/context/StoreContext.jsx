// src/app/context/StoreContext.jsx

'use client';

import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

const Store = createContext();

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
          cartItems: state.cart.cartItems.filter(
            (i) => i._id !== action.payload._id
          ),
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
  const { data: session } = useSession(); // 🧠 Identify current user
  const [state, dispatch] = useReducer(reducer, initialState);
  const [mounted, setMounted] = useState(false);

  // 🧩 Use dynamic key (user-based or guest)
  const userKey = session?.user?.email || 'guest';
  const storageKey = `cart_${userKey}`;

  // ✅ Restore user-specific cart
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        dispatch({ type: 'SET_CART', payload: JSON.parse(stored) });
      } else {
        dispatch({ type: 'SET_CART', payload: [] });
      }
    } catch (err) {
      console.error('Failed to load cart:', err);
    }
    setMounted(true);
  }, [storageKey]);

  // ✅ Save cart under user-specific key
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem(storageKey, JSON.stringify(state.cart.cartItems));
      } catch (err) {
        console.error('Failed to save cart:', err);
      }
    }
  }, [state.cart.cartItems, mounted, storageKey]);

  // ✅ Optional: Clean up other carts on login/logout
  useEffect(() => {
    if (!mounted) return;
    const allKeys = Object.keys(localStorage);
    allKeys
      .filter((key) => key.startsWith('cart_') && key !== storageKey)
      .forEach((key) => localStorage.removeItem(key));
  }, [storageKey, mounted]);

  // ⛔ Prevent rendering on server
  if (!mounted) return null;

  return (
    <Store.Provider value={{ state, dispatch }}>{children}</Store.Provider>
  );
}

export const useStore = () => useContext(Store);
