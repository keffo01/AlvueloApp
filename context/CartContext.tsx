// context/CartContext.tsx

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
  const [establishmentId, setEstablishmentId] = useState<string | null>(null);
  const [deliveryCost, setDeliveryCost] = useState(0);

  type ItemToAdd = Omit<CartItem, 'id' | 'quantity'> & { quantity?: number };

  // --- Función para calcular totales y agrupar items ---
  const calculateCartTotals = (currentCart: CartItem[]): CartTotals => {
    const groupedMap = new Map<string, CartEstablishmentGroup>();
    let subtotal = 0;
    let totalItems = 0;

    currentCart.forEach(item => {
      // 1. Convertir precios y cantidades a números seguros
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 1;
      const itemTotal = price * quantity;

      subtotal += itemTotal;
      totalItems += quantity;

      // 2. Extraer ID y Nombre del establecimiento (soporta formato anidado o plano)
      const rawItem = item as any;
      const estId = item.establishment?.id || rawItem.establishmentId || 'default_establishment';
      const estName = item.establishment?.name || rawItem.establishmentName || 'Establecimiento';

      // 3. Extraer costo de envío de forma segura (soporta totalDeliveryCost, deliveryCost o establishment.deliveryCost)
      const rawDeliveryCost =
        item.establishment?.deliveryCost ??
        rawItem.totalDeliveryCost ??
        rawItem.deliveryCost ??
        0;

      const groupDeliveryCost = Number(rawDeliveryCost) || 0;

      // 4. Agrupación por establecimiento
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

    // 5. Sumar el costo de envío de cada establecimiento único
    const totalDeliveryCost = groupedItems.reduce(
      (sum, group) => sum + (Number(group.deliveryCost) || 0),
      0
    );

    // 6. Calcular total final
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
    const optionsString = JSON.stringify(itemToAdd.optionsSelected || []);
    const uniqueItemId = `${itemToAdd.productId}-${optionsString}`;

    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item => item.id === uniqueItemId
      );

      const newItem: CartItem = {
        ...itemToAdd,
        id: uniqueItemId,
        quantity: itemToAdd.quantity || 1,
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
          const updatedCart = newCart.filter(item => item.id !== itemId);
          if (updatedCart.length === 0) {
            setEstablishmentId(null);
            setDeliveryCost(0);
          }
          return updatedCart;
        }
      }
      return prevCart;
    });
  };

  // --- Vaciar Carrito ---
  const clearCart = () => {
    setCart([]);
    setEstablishmentId(null);
    setDeliveryCost(0);
  };

  // --- Eliminar Item Completamente ---
  const removeItemFromCart = (itemId: string) => {
    setCart(prevCart => {
      const updatedCart = prevCart.filter(item => item.id !== itemId);
      if (updatedCart.length === 0) {
        setEstablishmentId(null);
        setDeliveryCost(0);
      }
      return updatedCart;
    });
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