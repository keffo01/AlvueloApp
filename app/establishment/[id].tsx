// app/establishment/[id].tsx

import CartIcon from '@/components/CartIcon';
import ReviewsTab from '@/components/stablishment/ReviewTab';
import InfoTab from '@/components/view/InfoTab';
import ProductsTab from '@/components/view/ProductsTab';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SceneMap, TabBar, TabView } from 'react-native-tab-view';

import colors from '../../constants/colors';
import { MOCK_REVIEWS } from '../../constants/mockData'; // Mantenemos reviews del mock temporalmente
import Sizes from '../../constants/Sizes';

const { width, height } = Dimensions.get('window');
const initialLayout = { width };

// 💡 TU URL DE API GATEWAY AQUÍ
const API_URL = 'https://8bnz9a5r1j.execute-api.us-east-2.amazonaws.com/dev-establisment/establisment'; 

// --- 💡 Hook Custom para manejar la API ---
const useEstablishmentData = (id: string) => {
  const [establishment, setEstablishment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    setLoading(true);
    fetch(`${API_URL}/${id}`)
      .then(res => {
        if (!res.ok) throw new Error('No encontrado');
        return res.json();
      })
      .then(data => {
        setEstablishment(data);
        setError(false);
      })
      .catch(err => {
        console.error("Error fetching establishment:", err);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [id]);

  return { establishment, loading, error };
};

// --- Componente de Detalle ---
const EstablishmentDetailScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  
  const rawId = params.id;
  const id: string = Array.isArray(rawId) ? rawId[0] : rawId?.toString() || ''; 
    
  // 💡 Consumimos nuestro Hook
  const { establishment, loading, error } = useEstablishmentData(id);

  const [index, setIndex] = useState(0);

  // 💡 Mapeamos los datos dinámicos o caemos en arreglos vacíos si no existen
  // 💡 Mapeamos los productos de la BD para que tengan la estructura exacta que tu ProductsTab espera
const products = (establishment?.products || []).map((p: any) => ({
    ...p,
    // Tu BD usa 'productId', pero tu componente probablemente espera 'id'
    id: p.productId || p.id || Math.random().toString(), 
    
    // Aseguramos que el precio sea sí o sí un número por si el componente usa .toFixed()
    price: Number(p.price || 0), 
    
    // Agregamos el establecimiento anidado por si el botón del carrito lo necesita
    establishment: { id: id } 
}));
  const reviews = MOCK_REVIEWS.filter(r => r.establishmentId === id); // Temporal hasta que esté en BD

  const [routes] = useState([
    { key: 'products', title: 'Menú' },
    { key: 'reviews', title: `Opiniones (${reviews.length})` }, 
    { key: 'info', title: 'Información' }, 
  ]);

  // --- Manejo de Estados de UI ---
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error || !establishment) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Establecimiento no encontrado.</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
           <Text style={{ color: colors.primary, fontSize: Sizes.font }}>Volver atrás</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- Renderizado de Escenas ---
  const renderScene = SceneMap({
    products: () => <ProductsTab products={products} />,
    info: () => <InfoTab establishment={establishment} />,
    reviews: () => <ReviewsTab reviews={reviews} establishmentId={id} />, 
  });

  const renderTabBar = (props: any) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: colors.primary, height: 3 }}
      style={styles.tabBar}
      labelStyle={styles.tabLabel}
      activeColor={colors.primary}
      inactiveColor={colors.lightText}
    />
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }}/>
      
      {/* HEADER FLOTANTE ABSOLUTO */}
      <View style={[styles.customHeader, { top: insets.top > 0 ? insets.top : 20 }]}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.headerButtonCircle}
        >
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>

        <View>
          <CartIcon />
        </View>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} stickyHeaderIndices={[1]}> 
        {/* Imagen Extensible y Datos Principales */}
        <Image 
          source={{ uri: establishment.imageUri }} 
          style={styles.heroImage}
        />
        
        {/* Contenido Principal */}
        <View style={styles.content}>
          <Text style={styles.title}>{establishment.name}</Text>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={Sizes.icon} color={colors.rating} />
            {/* Validamos que rating y likes existan para evitar errores si en BD están vacíos */}
            <Text style={styles.ratingText}>
                {establishment.rating ? Number(establishment.rating).toFixed(1) : 'N/A'} ({establishment.likes || 0})
            </Text>
            <Text style={styles.categoryText}> • {establishment.category}</Text>
          </View>
          <Text style={styles.deliveryText}>
              Costo de Envío: ${establishment.deliveryCost ? Number(establishment.deliveryCost).toFixed(2) : '0.00'}
          </Text>
        </View>
        
        {/* Contenedor de Pestañas (Sticky Header) */}
        {/* 💡 Reemplazamos la altura fija gigante por una altura calculada en base a la pantalla */}
        <View style={[styles.tabViewWrapper, { minHeight: height * 0.7 }]}> 
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
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  errorText: {
    fontSize: Sizes.title,
    color: colors.error,
  },
  heroImage: {
    width: '100%',
    height: 250, 
  },
  content: {
    backgroundColor: colors.background,
    borderTopLeftRadius: Sizes.radius * 2, 
    borderTopRightRadius: Sizes.radius * 2,
    marginTop: -Sizes.padding * 2, 
    padding: Sizes.padding,
    paddingTop: Sizes.padding * 2, 
  },
  title: {
    fontSize: 28, 
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
    color: colors.warning, 
  },
  categoryText: {
    fontSize: Sizes.font,
    color: colors.lightText, 
  },
  deliveryText: {
    fontSize: Sizes.font,
    fontWeight: '600',
    color: colors.secondary, 
    marginBottom: Sizes.padding,
  },
  tabViewWrapper: {
    backgroundColor: colors.background, 
    flex : 1
  },
  tabView: {
    flex : 1
  },
  tabBar: {
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
    shadowOpacity: 0, 
    elevation: 0,
    paddingHorizontal: Sizes.padding,
  },
  tabLabel: {
    fontSize: Sizes.font,
    fontWeight: 'bold',
  },
  customHeader: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Sizes.padding,
    zIndex: 100, 
    elevation: 100, 
  },
  headerButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});

export default EstablishmentDetailScreen;