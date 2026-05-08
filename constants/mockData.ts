// constants/mockData.ts
import { Banner, Establishment, Product, QuickOption, Review } from '../models/commons.model';

export const MOCK_BANNERS: Banner[] = [
  {
    id: 'b1',
    imageUri: 'https://i.pinimg.com/736x/80/fc/af/80fcaffe54e87574176443dd0766ebbd.jpg',
    title: 'Super Promo de Verano',
    description: '¡2x1 en todas las hamburguesas gourmet solo esta semana!',
    productData: { // 👈 Este objeto debe ser igual al que espera tu modal
      productId: 'pr1',
      name: '2x1 en Hamburguesas Gourmet',
      price: 5.99,
      description: '¡Solo por hoy en Aguilares y Guazapa! Disfruta de nuestro combo especial con hamburguesa, papas y bebida a un precio increíble.',
      imageUri: 'https://i.pinimg.com/736x/80/fc/af/80fcaffe54e87574176443dd0766ebbd.jpg',
      
      options : { 
    Complemento1: ["Clasica", "Pollo", "Vegetariana"],
    Complemento2: ["Clasica", "Pollo", "Vegetariana"],
    extras :[{id: 'extra1', name: 'Papas normales'}, {id: 'extra2', name: '2 bebidas 12 oz'},{id: 'extra3', name: '2 pie de manzana' }]
},
      establishment : {
        id: 'e2',
        name: 'El Chef',
        deliveryCost: 1,
  }   
 }
},
  {
    id: 'b2',
    imageUri: 'https://i.pinimg.com/736x/0b/6e/d5/0b6ed51c1a0eac91f19634b949179a09.jpg',
    title: 'Descuento en Postres',
    description: 'Obtén un 30% de descuento al ordenar cualquier postre.',
    productData: { // 👈 Este objeto debe ser igual al que espera tu modal
      productId: 'p2',
      name: 'Descuento en Postres',
      price: 5.99,
      description: '30% de descuento en todos los postres. Endulza tu día con nuestras deliciosas opciones, desde pasteles hasta helados.',
      imageUri: 'https://i.pinimg.com/736x/0b/6e/d5/0b6ed51c1a0eac91f19634b949179a09.jpg',
      
      establishment : {
        id: 'e7',
        name: 'Coulant',
        deliveryCost: 1,
    }
   }
  },
  {
    id: 'b3',
    imageUri: 'https://i.pinimg.com/736x/53/c8/24/53c8245018303bbd64083e62e77a1179.jpg',
    title: 'Envío Gratis',
    description: 'Envío gratis en todos los restaurantes con mínimo de $15.',
    productData: { // 👈 Este objeto debe ser igual al que espera tu modal
      productId: 'p3',
      name: 'Envío Gratis en Aguilares y Guazapa',
      price: 5.99,
      description: 'Solo por hoy en Aguilares y Guazapa...',
      imageUri: 'https://i.pinimg.com/736x/53/c8/24/53c8245018303bbd64083e62e77a1179.jpg',
      establishment : {
        id: 'e1',
        name: 'Comedor Central',
        deliveryCost: 0,
      }
    }
  },
];


export const MOCK_OPTIONS: QuickOption[] = [
  { id: 'o1', name: 'Supermercado', iconName: 'basket', targetScreen: 'Supermarket' },
  { id: 'o2', name: 'Restaurantes', iconName: 'restaurant', targetScreen: 'Restaurants' },
//  { id: 'o3', name: 'Farmacias', iconName: 'bandage', targetScreen: 'Pharmacies' },
 // { id: 'o4', name: 'Panaderías', iconName: 'storefront', targetScreen: 'Bakeries' },
  { id: 'o5', name: 'Mandaditos', iconName: 'flash', targetScreen: 'Delivery' },
];

// constants/mockData.ts (Añadir o modificar)

// Lista de Establecimientos más grande y con categorías
export const MOCK_ALL_ESTABLISHMENTS: Establishment[] = [
  // Restaurantes
  { id: 'e1', 
    name: 'Comedor Central', 
    category: 'Restaurantes', 
    rating: 4.9, 
    likes: 2500, 
    imageUri: 'https://i.ibb.co/5gjFy8Ld/CCA-morado.png', 
    deliveryCost: 1, 
    description: 'Deliciosa comida gourmet para todos los gustos.', 
    tags: ['platos fuertes', 'pollo encebollado', 'comedor'] },

  { id: 'e2', 
    name: 'El Chef', 
    category: 'Restaurantes', 
    rating: 4.7, 
    likes: 1800, 
    imageUri: 'https://i.ibb.co/7rQrLYj/222168979-126624602959824-2519003820174467078-n.jpg', 
    deliveryCost: 1, 
    description: 'Comida mexicana rápido para llevar.', 
    tags: ['tacos', 'mexicana', 'comida rápida'] },

  { id: 'e3', 
    name: 'Donys Pizza', 
    category: 'Restaurantes', 
    rating: 4.5, 
    likes: 1200, 
    imageUri: 'https://i.ibb.co/jPwhYy7m/395257665-352252637502822-5592117756806814047-n.jpg', 
    deliveryCost: 1, 
    description: 'Las mejores pizzas al estilo tradicional italiano.', 
    tags: ['pizza', 'italiano', 'comida rápida'] },
  
  // Supermercados
  { id: 'e4', 
    name: 'Súper Ahorro', 
    category: 'Supermercado', 
    rating: 4.2, 
    likes: 900, 
    imageUri: 'https://picsum.photos/id/1060/400/200', 
    deliveryCost: 1, 
    description: 'Todo lo que necesitas al mejor precio.', 
    tags: ['abarrotes', 'hogar', 'ofertas'] },
  
  // Farmacias
  { id: 'e5', 
    name: 'Farmacia Rápida', 
    category: 'Farmacias', 
    rating: 4.6, 
    likes: 700, 
    imageUri: 'https://picsum.photos/id/145/400/200',
    deliveryCost: 1, 
    description: 'Medicamentos y productos de salud al alcance de tu mano.', 
    tags: ['medicamentos', 'salud', 'bienestar'] },
  
  // Panaderías
  { id: 'e6', 
    name: 'Pan de la Abuela', 
    category: 'Panaderías', 
    rating: 4.8, 
    likes: 500, 
    imageUri: 'https://picsum.photos/id/190/400/200',
    deliveryCost: 1, 
    description: 'Panadería artesanal con recetas tradicionales.', 
    tags: ['pan', 'dulces', 'artesanal'] },
     // Pastelerías
  { id: 'e7', 
    name: 'Coulant', 
    category: 'Pastelerías', 
    rating: 4.8, 
    likes: 1000, 
    imageUri: 'https://i.ibb.co/vCK51Rys/476484471-122102635292752952-8850275169208217337-n.jpg',
    deliveryCost: 1, 
    description: 'Panadería artesanal con recetas tradicionales.', 
    tags: ['pasteles', 'postres', 'artesanal'] },
    
];

// MOCK_ESTABLISHMENTS de la Sección 4 ahora puede ser un filtro de MOCK_ALL_ESTABLISHMENTS
export const MOCK_ESTABLISHMENTS = MOCK_ALL_ESTABLISHMENTS.filter(e => e.likes > 999);


// --- Mock Data para Productos ---
export const MOCK_PRODUCTS: Product[] = [
  {
    productId: 'p1',
    name: 'Hamburguesa Clásica XL',
    description: 'Carne de res de 200g, queso cheddar, lechuga, tomate y salsa especial.',
    price: 12.99,
    imageUri: 'https://picsum.photos/id/111/200/200',
    establishment: {
     id: 'e2',
    name: 'El Chef',
    deliveryCost: 1,
    },
    category: 'Combo',
    options : { 
    Complemento1: ["Arroz", "Casamiento"],
    Complemento2: ["Ensalada Fresca", "Ensalada de Coditos"]
  }
  },
  {
    productId: 'p2',
    name: 'Patatas Fritas Premium',
    description: 'Patatas cortadas a mano con sal marina y pimentón.',
    price: 3.50,
    imageUri: 'https://picsum.photos/id/112/200/200',
    establishment: {
      id: 'e2',
      name: 'El Chef',
      deliveryCost: 1,
    },
    category: 'Combo',
    options : { 
    Complemento1: ["Arroz", "Casamiento"],
    Complemento2: ["Ensalada Fresca", "Ensalada de Coditos"],
    extras :[{id: 'extra1', name: 'tortillas de maiz'}, {id: 'extra2', name: 'porcion de arroz'},{id: 'extra3', name: 'porcion de casamiento' }]
}
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
      deliveryCost: 1,
    },
    category: 'Bebida',
    options : { 
      Complemento1: ["Pequeño", "Mediano", "Grande"],
}
  },
  {
    productId: 'p4',
    name: 'Pollo Encebollado',
    description: 'Jugoso pollo marinado con cebollas caramelizadas y especias.',
    price: 3.50,
    imageUri: 'https://picsum.photos/id/112/200/200',
    establishment: {
      id: 'e1',
      name: 'Comedor Central',
      deliveryCost: 1,
    },
    category: 'Combo',
  options : { 
    Complemento1: ["Arroz", "Casamiento"],
    Complemento2: ["Ensalada Fresca", "Ensalada de Coditos"],
    extras :[{id: 'extra1', name: 'tortillas de maiz'}, {id: 'extra2', name: 'porcion de arroz'},{id: 'extra3', name: 'porcion de casamiento' }]
}  },
  {
    productId: 'p5',
    name: 'Beso de Angel',
    description: 'Delicioso postre de merengue relleno de crema pastelera y cubierto de azúcar glas.',
    price: 3.50,
    imageUri: 'https://picsum.photos/id/114/200/200',
    establishment: {
      id: 'e7',
      name: 'Coulant',
      deliveryCost: 1,
    },
    category: 'Combo',
    options : { 
    Complemento1: ["Arroz", "Casamiento"],
    Complemento2: ["Ensalada Fresca", "Ensalada de Coditos"],
    extras :[{id: 'extra1', name: 'tortillas de maiz'}, {id: 'extra2', name: 'porcion de arroz'},{id: 'extra3', name: 'porcion de casamiento' }]
}
  },
  {
    productId: 'p6',
    name: 'Pechuga a la Plancha',
    description: 'Filete de pechuga de pollo a la plancha con especias y hierbas finas.',
    price: 3.50,
    imageUri: 'https://picsum.photos/id/112/200/200',
    establishment: {
      id: 'e1',
      name: 'Comedor Central',
      deliveryCost: 1,
    },
    category: 'Combo',
   options : { 
    Complemento1: ["Arroz", "Casamiento"],
    Complemento2: ["Ensalada Fresca", "Ensalada de Coditos"],
    extras :[{id: 'extra1', name: 'tortillas de maiz'}, {id: 'extra2', name: 'porcion de arroz'},{id: 'extra3', name: 'porcion de casamiento' }]
}
  },
  // ... (Añade más productos para otros establecimientos si deseas probar el filtro)
];
// constants/mockData.ts (Añadir nuevos tipos e interfaces)



// --- Mock Data para Opiniones ---
export const MOCK_REVIEWS: Review[] = [
  {
    id: 'r1',
    establishmentId: 'e1', // El Gourmet Central
    userName: 'Laura M.',
    rating: 5,
    comment: '¡La mejor hamburguesa que he probado! El servicio fue rápido y la comida llegó caliente.',
    date: '15/10/2025',
  },
  {
    id: 'r2',
    establishmentId: 'e1',
    userName: 'Carlos S.',
    rating: 4,
    comment: 'Muy buen sabor. Solo tardaron un poco más de lo esperado en la entrega.',
    date: '14/10/2025',
  },
  {
    id: 'r3',
    establishmentId: 'e2', // El de la otra categoría
    userName: 'Sofía R.',
    rating: 5,
    comment: 'Productos frescos y excelente atención. ¡Volveré a pedir!',
    date: '10/10/2025',
  },
  // Añade más opiniones para otros establecimientos si tienes más mocks.
];

export { Establishment };

