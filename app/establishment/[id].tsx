// app/establishment/[id].tsx

import CartIcon from '@/components/CartIcon';
import ReviewsTab from '@/components/stablishment/ReviewTab';
import InfoTab from '@/components/view/InfoTab';
import ProductsTab from '@/components/view/ProductsTab';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view'; // 💡 Nuevas importaciones
import colors from '../../constants/colors';
import { Establishment, MOCK_ALL_ESTABLISHMENTS, MOCK_PRODUCTS, MOCK_REVIEWS } from '../../constants/mockData';
import Sizes from '../../constants/Sizes';

const initialLayout = { width: Dimensions.get('window').width };

// --- Componente de Detalle ---
const EstablishmentDetailScreen: React.FC = () => {
  const params = useLocalSearchParams();
 // 💡 CORRECCIÓN CLAVE: Garantizar que 'id' es un string
  let rawId = params.id;

  // Si rawId es un array (ej: ['e4']), toma el primer elemento.
  // Si es un string (ej: 'e4'), lo deja como está. Si es undefined, lo convierte en string vacía.
  const id: string = Array.isArray(rawId) ? rawId[0] : rawId?.toString() || ''; 
    
  // --- El useMemo ahora usa la variable 'id' limpia ---
  const establishment: Establishment | undefined = useMemo(() => 
    MOCK_ALL_ESTABLISHMENTS.find(e => {
      // Opcional: Agregar un console.log para verificar los valores justo antes de la comparación
     //  console.log(`Buscando ID: '${id}' === Datos ID: '${e.id}'`);
      return e.id === id;
    }), 
    [id]
  );
  //console.log(`initialId: ${id}, establishments :${establishment}`)
  // 2. Obtener los productos de este Establecimiento
  const products = useMemo(() => 
    MOCK_PRODUCTS.filter(p => p.establishment.id === id),
    [id]
  );
   // 💡 OBTENER LAS OPINIONES FILTRADAS
    const reviews = useMemo(() => 
        MOCK_REVIEWS.filter(r => r.establishmentId === id),
        [id]
    );
    // --- Lógica de Estado para las Pestañas ---
const [index, setIndex] = useState(0);
const [routes] = useState([
  { key: 'products', title: 'Menú' },
  // 💡 Actualizamos el título de Reviews con el conteo
  { key: 'reviews', title: `Opiniones (${reviews.length})` }, 
  { key: 'info', title: 'Información' }, 
]);

  // Manejo de Error si no se encuentra el establecimiento
  if (!establishment) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Establecimiento no encontrado.</Text>
      </View>
    );
  }
 // --- Renderizado de Escenas (Pestañas) ---
const renderScene = SceneMap({
  products: () => <ProductsTab products={products} />,
  info: () => <InfoTab establishment={establishment} />,
  // 💡 Renderizamos el nuevo ReviewsTab
  reviews: () => <ReviewsTab reviews={reviews} establishmentId={id} />, 
});

  // --- Renderizado de la Barra de Pestañas (Custom TabBar) ---
  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: colors.primary, height: 3 }} // Línea indicadora
      style={styles.tabBar}
      labelStyle={styles.tabLabel}
      activeColor={colors.primary}
      inactiveColor={colors.lightText}
    />
  );

  return (
    <View style={styles.container}>
      {/* 💡 Cabecera Transparente */}
      <Stack.Screen 
        options={{
          title: '', 
          headerTransparent: true,
          headerTintColor: '#ffffff',
            // 💡 AGREGAMOS EL BOTÓN DEL CARRITO AL HEADER DERECHO
          headerRight: () => <CartIcon />,
        }}
      />
      
      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[1]}> 
        {/* 1. Imagen Extensible y Datos Principales */}
        <Image 
          source={{ uri: establishment.imageUri }} 
          style={styles.heroImage}
        />
        
        {/* 2. Contenido Principal */}
        <View style={styles.content}>
          <Text style={styles.title}>{establishment.name}</Text>
          {/* ... (RatingRow y DeliveryText sin cambios) ... */}
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={Sizes.icon} color={colors.rating} />
            <Text style={styles.ratingText}>{establishment.rating.toFixed(1)} ({establishment.likes})</Text>
            <Text style={styles.categoryText}> • {establishment.category}</Text>
          </View>
          <Text style={styles.deliveryText}>Costo de Envío: ${establishment.deliveryCost.toFixed(2)}</Text>
        </View>
        
        {/* 3. Contenedor de Pestañas (Sticky Header) */}
        {/* Usamos un View para hacer el TabView 'sticky' */}
        <View style={styles.tabViewWrapper}> 
            <TabView
              navigationState={{ index, routes }}
              renderScene={renderScene}
              onIndexChange={setIndex}
              initialLayout={initialLayout}
              renderTabBar={renderTabBar}
              style={styles.tabView} 
            />
        </View>
        
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: Sizes.title,
    color: colors.error,
  },
  heroImage: {
    width: '100%',
    height: 250, // Altura visible de la imagen
  },
  content: {
    backgroundColor: colors.background,
    // Pequeño borde superior redondeado
    borderTopLeftRadius: Sizes.radius * 2, // Usamos radius del archivo Sizes.js
    borderTopRightRadius: Sizes.radius * 2,
    marginTop: -Sizes.padding * 2, // Subir el contenido para superponer el borde redondeado a la imagen
    padding: Sizes.padding,
    paddingTop: Sizes.padding * 2, // Espacio interior para que el contenido no quede pegado al borde
  },
  title: {
    fontSize: 28, // Usamos un tamaño grande para el título (más grande que header/title)
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: Sizes.smallPadding / 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Sizes.smallPadding,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: Sizes.font,
    fontWeight: '700',
    color: colors.warning, // 💡 Color para el rating/estrellas
  },
  categoryText: {
    fontSize: Sizes.font,
    color: colors.lightText, // 💡 Estilo para la categoría
  },
  deliveryText: {
    fontSize: Sizes.font,
    fontWeight: '600',
    color: colors.secondary, // 💡 Color de acento para el costo de envío
    marginBottom: Sizes.padding,
  },
  divider: {
    height: 1,
    backgroundColor: '#EEEEEE', // Usamos un gris muy claro
    marginVertical: Sizes.padding,
  },
  sectionTitle: {
    fontSize: Sizes.title,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: Sizes.smallPadding,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.lightText,
    marginTop: Sizes.padding,
  },
  // Estilos específicos para la integración de TabView
  tabViewWrapper: {
     height: 800, // Aumenta este valor (ej. 800) para asegurar que el contenido se renderice
    backgroundColor: colors.background, 
  flex : 1
  },
  tabView: {
    // A veces TabView necesita flex: 1 en su contenedor si no está en ScrollView. 
    // Aquí usamos altura fija.
    flex : 1
  },
  tabBar: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
    shadowOpacity: 0, // Remover sombra por defecto
    elevation: 0,
    paddingHorizontal: Sizes.padding,
  },
  tabLabel: {
    fontSize: Sizes.font,
    fontWeight: 'bold',
  },
  tabContentText: {
    padding: Sizes.padding,
    fontSize: Sizes.font,
    textAlign: 'center',
    color: colors.lightText,
  },
});

export default EstablishmentDetailScreen;