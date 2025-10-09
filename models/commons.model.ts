// models.ts

/**
 * Interfaz para los datos del Banner promocional (Sección 1)
 */
export interface Banner {
  id: string;
  imageUri: string; // URL de la imagen del banner
  title: string;
  description: string;
  // Podría incluir un 'targetUrl' o 'targetScreen' para navegación
}

/**
 * Interfaz para las opciones de navegación rápida (Sección 2)
 */
export interface QuickOption {
  id: string;
  name: string;
  iconName: string; // Nombre del icono (ej: 'shopping-cart', 'restaurant')
  targetScreen: string; // La pantalla a la que navegará
}

/**
 * Interfaz para los productos del carrusel (Sección 3)
 */
export interface Product {
  productId: string;
  name: string;
  description: string;
  price: number;
  imageUri: string; // URL de la imagen del producto
  category: 'Bebida' | 'Combo' | 'Accesorio';
  establishment : EstablishmentReference;
}

/**
 * Interfaz para los establecimientos/restaurantes (Sección 4)
 */
export interface Establishment {
  deliveryCost: any;
  id: string;
  name: string;
  category: string;
  rating: number; // Por ejemplo, un rating de 1 a 5
  likes: number; // El contador para el ranking de prestigio
  imageUri: string;
  
}

// --- Nuevas Interfaces para el Carrito ---

/**
 * Interfaz básica del establecimiento que agrupa los items
 */
export interface EstablishmentReference {
  id: string;
  name: string;
  deliveryCost: number; // Añadimos costo de envío para el cálculo
}

/**
 * Interfaz para un producto individual dentro del carrito
 */
export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  // Referencia al establecimiento de origen
  establishment: EstablishmentReference; 
}

/**
 * Interfaz para un grupo de items bajo un mismo establecimiento
 */
export interface CartEstablishmentGroup extends EstablishmentReference {
    items: CartItem[];
    subtotal: number;
}

/**
 * Interfaz que representa el estado total del carrito (usada en el Context)
 */
export interface CartTotals {
  subtotal: number;
  totalDeliveryCost: number;
  finalTotal: number;
  totalItems: number;
  // Los items agrupados listos para ser renderizados
  groupedItems: CartEstablishmentGroup[];
  cart : {}
}

/**
 * Interfaz para las funciones y el estado expuestos por el Context
 */
export interface CartContextType extends CartTotals {
  cart: CartItem[]; // Lista plana de todos los items
  addItemToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeItemFromCart: (productId: string) => void;
  // Puedes añadir funciones para incrementar, decrementar, y vaciar.
}