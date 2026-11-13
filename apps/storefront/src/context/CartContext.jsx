import { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  function addToCart(product, selectedVariant = product.variants?.[0]) {
    const variant = selectedVariant?.label || selectedVariant || product.size;
    const price = selectedVariant?.price ?? product.price;
    const mrp = selectedVariant?.mrp ?? product.mrp;
    setItems((current) => {
      const existing = current.find(
        (item) => item.slug === product.slug && item.variant === variant,
      );
      if (existing)
        return current.map((item) =>
          item === existing ? { ...item, quantity: item.quantity + 1 } : item,
        );
      return [
        ...current,
        { ...product, variant, price, mrp, size: variant, quantity: 1 },
      ];
    });
  }

  function removeFromCart(slug, variant) {
    setItems((current) =>
      current.filter(
        (item) => !(item.slug === slug && item.variant === variant),
      ),
    );
  }

  const value = useMemo(
    () => ({
      items,
      itemCount: items.reduce((total, item) => total + item.quantity, 0),
      total: items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      ),
      addToCart,
      removeFromCart,
    }),
    [items],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
