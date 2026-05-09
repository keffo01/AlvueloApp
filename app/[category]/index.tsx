import { Stack, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Sizes from '../../constants/Sizes';
import colors from '../../constants/colors';

// Componentes y Modelos
import { MOCK_ALL_QUICK_OPTIONS } from '@/constants/mockData';
import { Establishment } from '@/models/commons.model';
import { Ionicons } from '@expo/vector-icons';

const EstablishmentListScreen: React.FC = () => {
  const { category: categoryId } = useLocalSearchParams();
  const categoryName = Array.isArray(categoryId) ? categoryId[0] : categoryId || 'Establecimientos';

  // Estados para Rendimiento y AWS
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // 💡 Lógica de Carga con Paginación (Preparada para AWS)
  const loadEstablishments = async (isInitial = false) => {
    if (loading || (!hasMore && !isInitial)) return;

    setLoading(true);
    
    try {
      // SIMULACIÓN DE PETICIÓN AWS: 
      // Aquí filtrarás en el backend. Por ahora filtramos el Mock localmente.
      const allFiltered = MOCK_ALL_QUICK_OPTIONS.filter((est: { category: string; }) => est.category === categoryName);
      
      // Simulamos paginación de 5 en 5
      const start = isInitial ? 0 : (page - 1) * 5;
      const end = start + 5;
      const paginatedItems = allFiltered.slice(start, end);

      if (isInitial) {
        setEstablishments(paginatedItems);
        setPage(2);
      } else {
        setEstablishments(prev => [...prev, ...paginatedItems]);
        setPage(prev => prev + 1);
      }

      if (end >= allFiltered.length) setHasMore(false);
      
    } catch (error) {
      console.error("Error cargando establecimientos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEstablishments(true);
  }, [categoryName]);

 // Dentro de app/[category]/index.tsx

const renderEstablishment  = useCallback(({ item }: { item: Establishment }) => {
  // 💡 Lógica de decisión visual
  const isProductFocus = categoryName === 'combos' || categoryName === 'super';

  return (
    <TouchableOpacity 
      style={styles.cardWrapper} 
      onPress={() => /* Navegar al detalle */ {}}
      activeOpacity={0.7}
    >
      <View style={isProductFocus ? styles.productCard : styles.establishmentRow}>
        
        {/* IMAGEN: Grande para combos, tipo logo para locales */}
        <Image 
          source={{ uri: item.imageUri }} 
          style={isProductFocus ? styles.productImage : styles.establishmentLogo} 
        />

        <View style={styles.infoContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.nameText} numberOfLines={1}>{item.name}</Text>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={12} color="#FFB800" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          </View>

          {/* TAGS / CATEGORÍAS */}
          <Text style={styles.tagsText} numberOfLines={1}>
            {item?.tags?.join(' • ')}
          </Text>

          {/* PIE DE TARJETA: Tiempo y Costo */}
          <View style={styles.detailsRow}>
            <View style={styles.iconInfo}>
              <Ionicons name="time-outline" size={14} color={colors.lightText} />
              <Text style={styles.detailText}>{item.deliveryTime}</Text>
            </View>
            <View style={[styles.iconInfo, { marginLeft: 12 }]}>
              <Ionicons name="bicycle-outline" size={14} color={colors.lightText} />
              <Text style={styles.detailText}>
                {item.deliveryCost === 0 ? 'Gratis' : `$${item.deliveryCost.toFixed(2)}`}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}, [categoryName]);

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: categoryName.charAt(0).toUpperCase() + categoryName.slice(1), 
          headerBackTitle: 'Inicio',
          headerTintColor: colors.primary,
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      
      <FlatList
        data={establishments}
        renderItem={renderEstablishment}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        
        
        onEndReached={() => loadEstablishments()}
        onEndReachedThreshold={0.5}
        
    
        ListFooterComponent={
          loading && hasMore ? (
            <ActivityIndicator color={colors.primary} style={{ marginVertical: 20 }} />
          ) : null
        }
        
    
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No hay establecimientos en la categoría "{categoryName}".
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: Sizes.padding,
    paddingBottom: 40, // Espacio extra al final
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Sizes.padding * 2,
    marginTop: 100,
  },
  emptyText: {
    fontSize: 16,
    color: colors.lightText,
    textAlign: 'center',
    lineHeight: 24,
  },
  cardWrapper: {
    marginBottom: Sizes.padding,
    backgroundColor: '#fff',
    borderRadius: 16,
    // Sombra suave para que resalte del fondo
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  // Estilo para Locales (Farmacias, Restaurantes)
  establishmentRow: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
  // Estilo para Productos (Combos, Súper)
  productCard: {
    flexDirection: 'column',
  },
  establishmentLogo: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  productImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  infoContainer: {
    flex: 1,
    paddingLeft: 12,
    paddingVertical: 4,
    // Si es producto, añadimos padding alrededor del texto
    padding: 12, 
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E5',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFB800',
    marginLeft: 2,
  },
  tagsText: {
    fontSize: 13,
    color: colors.lightText,
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    color: colors.lightText,
    marginLeft: 4,
  },
});

export default EstablishmentListScreen;