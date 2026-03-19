'use client';

import React, {
  createContext, useContext, useState,
  useEffect, useCallback
} from 'react';
import { Product, CartItem } from '@/types';

interface AppContextType {
  cart:            CartItem[];
  addToCart:       (product: Product, size: string, color?: string, qty?: number) => Promise<void>;
  removeFromCart:  (productId: string, size: string) => Promise<void>;
  updateQuantity:  (productId: string, size: string, delta: number) => Promise<void>;
  clearCart:       () => void;
  isCartLoading:   boolean;
  wishlist:        string[];
  toggleWishlist:  (productId: string) => Promise<void>;
  isWishlisted:    (productId: string) => boolean;
  lastOrderId:     string | null;
  setLastOrderId:  (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart]               = useState<CartItem[]>([]);
  const [wishlist, setWishlist]       = useState<string[]>([]);
  const [isCartLoading, setCartLoad]  = useState(true);
  const [lastOrderId, setLastOrderId] = useState<string | null>(null);

  // Initialize state from local storage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('annaya_cart');
      const storedWishlist = localStorage.getItem('annaya_wishlist');
      
      if (storedCart) {
        setCart(JSON.parse(storedCart));
      }
      if (storedWishlist) {
        setWishlist(JSON.parse(storedWishlist));
      }
    } catch (err) {
      console.error('Error loading from local storage', err);
    } finally {
      setCartLoad(false);
    }
  }, []);

  // Sync state to local storage when it changes
  useEffect(() => {
    if (!isCartLoading) {
      localStorage.setItem('annaya_cart', JSON.stringify(cart));
    }
  }, [cart, isCartLoading]);

  useEffect(() => {
    if (!isCartLoading) {
      localStorage.setItem('annaya_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, isCartLoading]);

  /* ── Cart ─────────────────────────────────────────────────────────────── */
  const addToCart = useCallback(async (product: Product, size: string, color = '', qty = 1) => {
    setCart(prev => {
      const idx = prev.findIndex(i => i.id === product.id && i.selectedSize === size);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + qty };
        return copy;
      }
      return [...prev, { ...product as any, quantity: qty, selectedSize: size, selectedColor: color }];
    });
  }, []);

  const removeFromCart = useCallback(async (productId: string, size: string) => {
    setCart(prev => prev.filter(i => !(i.id === productId && i.selectedSize === size)));
  }, []);

  const updateQuantity = useCallback(async (productId: string, size: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === productId && i.selectedSize === size) {
        return { ...i, quantity: Math.max(1, i.quantity + delta) };
      }
      return i;
    }));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  /* ── Wishlist ─────────────────────────────────────────────────────────── */
  const toggleWishlist = useCallback(async (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  }, []);

  const isWishlisted = useCallback((id: string) => wishlist.includes(id), [wishlist]);

  return (
    <AppContext.Provider value={{
      cart, addToCart, removeFromCart, updateQuantity, clearCart, isCartLoading,
      wishlist, toggleWishlist, isWishlisted,
      lastOrderId, setLastOrderId,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
