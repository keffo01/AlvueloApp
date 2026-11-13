// context/CartContext.tsx
// ✍️ Optimizado para Al Vuelo - IDs limpios para mandaditos y retención temporal de imágenes para S3

import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import {
  CartContextType,
  CartEstablishmentGroup,
  CartItem,
  CartTotals
} from '../models/commons.model';

// --- Valores Iniciales ---
const DEFAULT_CART_CONTEXT: CartContextType = {
  cart: [],
  subtotal: 0,
  totalDeliveryCost: 0,
  finalTotal: 0,
  totalItems: 0,
  groupedItems: [],
  addItemToCart: () => {},
  removeItemFromCart: () => {},
  clearCart: () => {},
  incrementQuantity: () => {},
  decrementQuantity: () => {}
};

// --- Creación del Contexto ---
export const CartContext = createContext<CartContextType>(DEFAULT_CART_CONTEXT);

// --- Hook Personalizado ---
export const useCart = () => useContext(CartContext);

// --- Componente Proveedor ---
export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  type ItemToAdd = Omit<CartItem, 'id' | 'quantity'> & { quantity?: number };

  // --- Función para calcular totales y agrupar items ---
  const calculateCartTotals = (currentCart: CartItem[]): CartTotals => {
    const groupedMap = new Map<string, CartEstablishmentGroup>();
    let subtotal = 0;
    let totalItems = 0;

    currentCart.forEach(item => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 1;
      const itemTotal = price * quantity;

      subtotal += itemTotal;
      totalItems += quantity;

      const rawItem = item as any;
      const estId = item.establishment?.id || rawItem.establishmentId || 'default_establishment';
      const estName = item.establishment?.name || rawItem.establishmentName || 'Establecimiento';

      const rawDeliveryCost =
        item.establishment?.deliveryCost ??
        rawItem.totalDeliveryCost ??
        rawItem.deliveryCost ??
        0;

      const groupDeliveryCost = Number(rawDeliveryCost) || 0;

      if (!groupedMap.has(estId)) {
        groupedMap.set(estId, {
          ...(item.establishment || {}),
          id: estId,
          name: estName,
          deliveryCost: groupDeliveryCost,
          items: [],
          subtotal: 0,
        } as CartEstablishmentGroup);
      }

      const group = groupedMap.get(estId)!;
      group.items.push(item);
      group.subtotal += itemTotal;
    });

    const groupedItems = Array.from(groupedMap.values());

    const totalDeliveryCost = groupedItems.reduce(
      (sum, group) => sum + (Number(group.deliveryCost) || 0),
      0
    );

    const finalTotal = subtotal + totalDeliveryCost;

    return {
      cart: currentCart,
      subtotal: Number(subtotal.toFixed(2)),
      totalDeliveryCost: Number(totalDeliveryCost.toFixed(2)),
      finalTotal: Number(finalTotal.toFixed(2)),
      totalItems,
      groupedItems,
    };
  };

  // --- Lógica para Añadir Items ---
  const addItemToCart = (itemToAdd: ItemToAdd) => {
    const rawOptions = (itemToAdd.optionsSelected || {}) as any;
    const isCustomFavor = Boolean(rawOptions.isCustomFavor);

    // Para productos normales filtramos opciones de comparación, pero para mandaditos mantenemos todo limpio
    const { images, ...optionsWithoutImages } = rawOptions;

    // 💡 SOLUCIÓN: Si es mandadito personalizado, usamos únicamente el productId limpio como ID. 
    // Evita que el JSON con descripciones ensucie el identificador del carrito.
    const uniqueItemId = isCustomFavor
      ? itemToAdd.productId
      : `${itemToAdd.productId}-${JSON.stringify(optionsWithoutImages)}`;

    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item => item.id === uniqueItemId
      );

      const newItem: CartItem = {
        ...itemToAdd,
        id: uniqueItemId,
        quantity: itemToAdd.quantity || 1,
        optionsSelected: rawOptions, // Mantiene las imágenes temporalmente para que el Checkout las envíe a S3
      } as CartItem;

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += (itemToAdd.quantity || 1);
        return newCart;
      } else {
        return [...prevCart, newItem];
      }
    });
  };

  // --- Incrementar Cantidad ---
  const incrementQuantity = (itemId: string) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item => item.id === itemId
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += 1;
        return newCart;
      }
      return prevCart;
    });
  };

  // --- Decrementar Cantidad ---
  const decrementQuantity = (itemId: string) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item => item.id === itemId
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        const currentQuantity = newCart[existingItemIndex].quantity;

        if (currentQuantity > 1) {
          newCart[existingItemIndex].quantity -= 1;
          return newCart;
        } else {
          return newCart.filter(item => item.id !== itemId);
        }
      }
      return prevCart;
    });
  };

  // --- Vaciar Carrito ---
  const clearCart = () => {
    setCart([]);
  };

  // --- Eliminar Item Completamente ---
  const removeItemFromCart = (itemId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId));
  };

  // --- Memorización del valor del contexto ---
  const value = useMemo(() => {
    const totals = calculateCartTotals(cart);
    return {
      ...totals,
      cart,
      addItemToCart,
      removeItemFromCart,
      clearCart,
      incrementQuantity,
      decrementQuantity
    };
  }, [cart]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};