// context/CartContext.tsx

import React, { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import {
  CartContextType,
  CartEstablishmentGroup,
  CartItem,
  CartTotals
} from '../models/commons.model'; // 💡 Asegura la ruta correcta

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
  interface ItemToAdd extends Omit<CartItem, 'id' | 'quantity'> {}

  // Función de ayuda para calcular los totales y agrupar items
  const calculateCartTotals = (currentCart: CartItem[]): CartTotals => {
    
    // 1. Calcular Subtotal, Total Items y Agrupación
    const groupedMap = new Map<string, CartEstablishmentGroup>();
    let subtotal = 0;
    let totalItems = 0;
    
    currentCart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        totalItems += item.quantity;
        
        // Agrupación por ID de Establecimiento
        const establishmentId = item.establishment.id;
        
        if (!groupedMap.has(establishmentId)) {
            // Inicializar grupo
            groupedMap.set(establishmentId, {
                ...item.establishment, // Copia id, name, deliveryCost
                items: [],
                subtotal: 0,
            });
        }
        
        const group = groupedMap.get(establishmentId)!;
        group.items.push(item);
        group.subtotal += itemTotal;
    });

    const groupedItems = Array.from(groupedMap.values());
    
    // 2. Calcular Costos Totales de Envío
    // Suma el costo de envío de CADA establecimiento único en el carrito
    const totalDeliveryCost = groupedItems.reduce((sum, group) => sum + group.deliveryCost, 0);

    // 3. Final Total
    const finalTotal = subtotal + totalDeliveryCost;

    return {
      cart: currentCart,
      subtotal,
      totalDeliveryCost,
      finalTotal,
      totalItems,
      groupedItems,
    };
  };

  // --- Lógica para Añadir Items ---
  const addItemToCart = (itemToAdd: ItemToAdd) => {
    // 💡 1. Generar un ID ÚNICO BASADO EN LAS OPCIONES
const optionsString = JSON.stringify(itemToAdd.optionsSelected);
// El ID debe ser una combinación del producto y las opciones
const uniqueItemId = `${itemToAdd.productId}-${optionsString}`;
    setCart(prevCart => {
    // 2. Buscamos el ítem por el ID ÚNICO (incluyendo opciones)
    const existingItemIndex = prevCart.findIndex(
        item => item.id === uniqueItemId 
    );
    
    // Crear el nuevo ítem, incluyendo el ID único y la cantidad inicial de 1
    const newItem: CartItem = {
        ...itemToAdd,
        id: uniqueItemId, // 💡 Usar el ID ÚNICO
        quantity: 1,
    };

    if (existingItemIndex > -1) {
        // 3. Si el ítem con las MISMAS OPCIONES existe, solo incrementamos
        const newCart = [...prevCart];
        newCart[existingItemIndex].quantity += 1;
        return newCart;
    } else {
        // 4. Si es una NUEVA COMBINACIÓN de opciones, añadimos como nuevo ítem
        // ... (Lógica de establecimiento si el carrito está vacío) ...
        return [...prevCart, newItem];
    }
});
  };
// 💡 1. FUNCIÓN PARA INCREMENTAR CANTIDAD
  const incrementQuantity = (itemId: string) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item => item.id === itemId
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        // Simplemente incrementamos la cantidad
        newCart[existingItemIndex].quantity += 1; 
        return newCart;
      }
      return prevCart; // Si no lo encuentra, devolvemos el carrito sin cambios
    });
  };

  // 💡 2. FUNCIÓN PARA DECREMENTAR CANTIDAD
  const decrementQuantity = (itemId: string) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item => item.id === itemId
      );

      if (existingItemIndex > -1) {
        const newCart = [...prevCart];
        const currentQuantity = newCart[existingItemIndex].quantity;

        if (currentQuantity > 1) {
          // Si la cantidad es mayor a 1, solo decrementamos
          newCart[existingItemIndex].quantity -= 1;
          return newCart;
        } else {
          // Si la cantidad es 1, lo eliminamos del carrito (cantidad llega a 0)
          const updatedCart = newCart.filter(item => item.id !== itemId);
          
          // Si el carrito queda vacío, reseteamos los costos del establecimiento
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
  const clearCart = () => {
    setCart([]);
  };

  // --- Lógica para Eliminar Items ---
  const removeItemFromCart = (itemId: string) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item => item.id === itemId
      );

      if (existingItemIndex > -1) {
        if (prevCart[existingItemIndex].quantity > 1) {
          // Si tiene más de 1, decrementa la cantidad
          const newCart = [...prevCart];
          newCart[existingItemIndex].quantity -= 1;
          return newCart;
        } else {
          // Si es 1, elimina el item del carrito
          return prevCart.filter(item => item.id !== itemId);
        }
      }
      return prevCart; // No se encontró, no cambia el carrito
    });
  };

  // 💡 useMemo asegura que los cálculos se realicen solo cuando el carrito cambie
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