// src/app/context/StoreContext.jsx

'use client';

'use client';

import { createContext, useContext, useReducer } from 'react';

const Store = createContext();

const initialState = {
  cart: {
    cartItems: [],
  },
};

function reducer(state, action) {
  switch (action.type) {
    case 'CART_ADD_ITEM': {
      const newItem = action.payload;
      const existItem = state.cart.cartItems.find((item) => item._id === newItem._id);
      const cartItems = existItem
        ? state.cart.cartItems.map((item) => item._id === existItem._id ? newItem : item)
        : [...state.cart.cartItems, newItem];

      return { ...state, cart: { ...state.cart, cartItems } };
    }

    case 'CART_REMOVE_ITEM':
    return {
      ...state,
      cart: {
        ...state.cart,
        cartItems: state.cart.cartItems.filter((item) => item._id !== action.payload._id),
      },
    };

    default:
      return state;
  }
}

export function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <Store.Provider value={{ state, dispatch }}>{children}</Store.Provider>;
}



export const useStore = () => useContext(Store);