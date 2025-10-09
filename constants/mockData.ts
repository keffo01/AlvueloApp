// constants/mockData.ts
import { Banner, Establishment, Product, QuickOption } from '../models/commons.model';

export const MOCK_BANNERS: Banner[] = [
  {
    id: 'b1',
    imageUri: 'https://i.pinimg.com/736x/80/fc/af/80fcaffe54e87574176443dd0766ebbd.jpg',
    title: 'Super Promo de Verano',
    description: '¡2x1 en todas las hamburguesas gourmet solo esta semana!',
  },
  {
    id: 'b2',
    imageUri: 'https://i.pinimg.com/736x/0b/6e/d5/0b6ed51c1a0eac91f19634b949179a09.jpg',
    title: 'Descuento en Postres',
    description: 'Obtén un 30% de descuento al ordenar cualquier postre.',
  },
  {
    id: 'b3',
    imageUri: 'https://i.pinimg.com/736x/53/c8/24/53c8245018303bbd64083e62e77a1179.jpg',
    title: 'Envío Gratis',
    description: 'Envío gratis en todos los restaurantes con mínimo de $15.',
  },
];


export const MOCK_OPTIONS: QuickOption[] = [
  { id: 'o1', name: 'Supermercado', iconName: 'basket', targetScreen: 'Supermarket' },
  { id: 'o2', name: 'Restaurantes', iconName: 'restaurant', targetScreen: 'Restaurants' },
  { id: 'o3', name: 'Farmacias', iconName: 'bandage', targetScreen: 'Pharmacies' },
  { id: 'o4', name: 'Panaderías', iconName: 'storefront', targetScreen: 'Bakeries' },
  { id: 'o5', name: 'Mandaditos', iconName: 'flash', targetScreen: 'Delivery' },
];

// constants/mockData.ts (Añadir o modificar)

// Lista de Establecimientos más grande y con categorías
export const MOCK_ALL_ESTABLISHMENTS: Establishment[] = [
  // Restaurantes
  { id: 'e1', name: 'El Gourmet Central', category: 'Restaurantes', rating: 4.9, likes: 2500, imageUri: 'https://picsum.photos/id/10/400/200', deliveryCost: 3.50,},
  { id: 'e2', name: 'Sushi Express', category: 'Restaurantes', rating: 4.7, likes: 1800, imageUri: 'https://picsum.photos/id/1041/400/200', deliveryCost: 3.50, },
  { id: 'e3', name: 'Pizzería Clásica', category: 'Restaurantes', rating: 4.5, likes: 1200, imageUri: 'https://picsum.photos/id/11/400/200', deliveryCost: 3.50,},
  
  // Supermercados
  { id: 'e4', name: 'Súper Ahorro', category: 'Supermercado', rating: 4.2, likes: 900, imageUri: 'https://picsum.photos/id/1060/400/200', deliveryCost: 3.50, },
  
  // Farmacias
  { id: 'e5', name: 'Farmacia Rápida', category: 'Farmacias', rating: 4.6, likes: 700, imageUri: 'https://picsum.photos/id/145/400/200',deliveryCost: 3.50, },
  
  // Panaderías
  { id: 'e6', name: 'Pan de la Abuela', category: 'Panaderías', rating: 4.8, likes: 500, imageUri: 'https://picsum.photos/id/190/400/200',deliveryCost: 3.50, },
];

// MOCK_ESTABLISHMENTS de la Sección 4 ahora puede ser un filtro de MOCK_ALL_ESTABLISHMENTS
export const MOCK_ESTABLISHMENTS = MOCK_ALL_ESTABLISHMENTS.filter(e => e.likes > 1000);

// Asumiremos que todos los productos son de un solo establecimiento por ahora:
const MOCK_ESTABLISHMENT_REF = {
  id: 'rest_fast_food',
  name: 'Burger Joint Central',
  deliveryCost: 2.50, // Costo de envío de este establecimiento
};

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
// --- Mock Data para Productos ---
export const MOCK_PRODUCTS: Product[] = [
  {
    productId: 'p1',
    name: 'Hamburguesa Clásica XL',
    description: 'Carne de res de 200g, queso cheddar, lechuga, tomate y salsa especial.',
    price: 12.99,
    imageUri: 'https://picsum.photos/id/111/200/200',
    establishment: {
     id: 'e1',
    name: 'El Gourmet Central',
    deliveryCost: 3.50,
    },
    category: 'Combo'
  },
  {
    productId: 'p2',
    name: 'Patatas Fritas Premium',
    description: 'Patatas cortadas a mano con sal marina y pimentón.',
    price: 3.50,
    imageUri: 'https://picsum.photos/id/112/200/200',
    establishment: {
      id: 'e1',
      name: 'El Gourmet Central',
      deliveryCost: 3.50,
    },
    category: 'Combo'
  },
  {
    productId: 'p3',
    name: 'Jugo Natural de Naranja',
    description: 'Recién exprimido, sin azúcares añadidos.',
    price: 2.50,
    imageUri: 'https://picsum.photos/id/113/200/200',
    establishment: {
      id: 'e1',
      name: 'El Gourmet Central',
      deliveryCost: 3.50,
    },
    category: 'Bebida'
  },
  {
    productId: 'p4',
    name: 'combo de prueba',
    description: ' cortadas a mano con sal marina y pimentón.',
    price: 3.50,
    imageUri: 'https://picsum.photos/id/112/200/200',
    establishment: {
      id: 'e2',
      name: 'Sushi Express',
      deliveryCost: 3.50,
    },
    category: 'Combo'
  },
  // ... (Añade más productos para otros establecimientos si deseas probar el filtro)
];

export { Establishment };

