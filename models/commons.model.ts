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
 // 💡 Nueva estructura de opciones
  options?: {
        // Esto le dice a TypeScript: cualquier clave de tipo string (ej. 'Complemento1')
        // devolverá un array de strings O un array de ExtraOption (para 'extras').
        [key: string]: string[] | ExtraOption[]; 
        
        // Puedes tipar 'extras' de forma más precisa si quieres:
        // extras?: ExtraOption[]; 
    };
}
// Definición de un Producto para la venta
export interface Products {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUri: string;
  // Usado para saber a qué establecimiento pertenece
  establishmentId: string; 
  establishmentName: string; 
  establishmentDeliveryCost: number; // Costo de envío del local
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
  description?: string; // Descripción opcional
  tags?: string[]; // Etiquetas para búsqueda y filtrado
  
  
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
  id: string; // ID único basado en producto + opciones
  productId: string;
  name: string;
  price: number;
  quantity: number;
  // Referencia al establecimiento de origen
  establishment: EstablishmentReference; 
  // 💡 NUEVOS CAMPOS:
  // Precio base del producto (sin extras)
  basePrice: number; 
  // Opciones seleccionadas por el usuario (ej: { Complemento1: 'Arroz', extras: ['tortillas de maiz'] })
  optionsSelected: { [key: string]: string | string[] };
}
// Interfaz para la nueva estructura de Extras (si no la tienes en mockData)
export interface ExtraOption {
    id: string;
    name: string;
    unitPrice: string; // La usaremos como string, pero la convertiremos a number para cálculos
}

// Define la estructura de UNA SOLA CONFIGURACIÓN
export interface ItemConfiguration {
    tempId: string; 
    selections: { [key: string]: string }; 
    // 💡 AHORA guardamos solo los IDs de los extras seleccionados
    extras: string[]; 
    unitPrice: number;
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

export interface Review {
  id: string;
  establishmentId: string;
  userName: string;
  rating: number; // Valor de 1 a 5
  comment: string;
  date: string; // Formato simple: 'DD/MM/YYYY'
}
/**
 * Interfaz para las funciones y el estado expuestos por el Context
 */
export interface CartContextType extends CartTotals {
  cart: CartItem[]; // Lista plana de todos los items
  addItemToCart: (item: Omit<CartItem, 'quantity'>) => void;
  removeItemFromCart: (productId: string) => void;
  clearCart: () => void;
  incrementQuantity: (productId: string) => void;
  decrementQuantity: (productId: string) => void;
  // Puedes añadir funciones para incrementar, decrementar, y vaciar.
}