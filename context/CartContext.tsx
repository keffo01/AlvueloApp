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
  const addItemToCart = (itemToAdd: Omit<CartItem, 'quantity'>) => {
    setCart(prevCart => {
            
            // 💡 EL CAMBIO CLAVE: Usa itemToAdd.id (el ID del producto que se añade)
            // para compararlo con item.productId (el ID del ítem que ya está en el carrito).
            const existingItemIndex = prevCart.findIndex(
                item => item.productId === itemToAdd.productId
            );

            // Si se encuentra (mismo producto, incrementar cantidad)
            if (existingItemIndex > -1) {
                const newCart = [...prevCart];
                newCart[existingItemIndex].quantity += 1;
                return newCart;
            } else {
                // Si NO se encuentra (nuevo producto, añadirlo)
                const newItem: CartItem = {
                    ...itemToAdd,
                    productId: itemToAdd.productId, // 👈 Aseguramos que el CartItem guarda el ID del producto
                    quantity: 1,
                };
                return [...prevCart, newItem];
            }
        });
  };
// 💡 1. FUNCIÓN PARA INCREMENTAR CANTIDAD
  const incrementQuantity = (productId: string) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item => item.productId === productId
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
  const decrementQuantity = (productId: string) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item => item.productId === productId
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
          const updatedCart = newCart.filter(item => item.productId !== productId);
          
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
  const removeItemFromCart = (productId: string) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item => item.productId === productId
      );

      if (existingItemIndex > -1) {
        if (prevCart[existingItemIndex].quantity > 1) {
          // Si tiene más de 1, decrementa la cantidad
          const newCart = [...prevCart];
          newCart[existingItemIndex].quantity -= 1;
          return newCart;
        } else {
          // Si es 1, elimina el item del carrito
          return prevCart.filter(item => item.productId !== productId);
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