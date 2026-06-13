import { Ionicons } from '@expo/vector-icons';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Sizes from '../../constants/Sizes';
import colors from '../../constants/colors';

// Importa el modelo y el servicio real
import { Establishment } from '@/models/commons.model';
import { fetchEstablishmentsByCategory } from '../../services/quickOption.service';
const EstablishmentListScreen: React.FC = () => {
  const { category: categoryId } = useLocalSearchParams();
  const categoryName = Array.isArray(categoryId) ? categoryId[0] : categoryId || 'Establecimientos';

  // Estados
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  // 💡 ESTADO CLAVE PARA DYNAMODB: El LastEvaluatedKey
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState<any>(null);

  const loadEstablishments = async (isInitial = false) => {
    if (loading || (!hasMore && !isInitial)) return;

    setLoading(true);
    
    try {
      // Usamos el key guardado en el estado o null si es la carga inicial
      const currentKey = isInitial ? null : lastEvaluatedKey;
      
      // Llamada real al servicio conectado a AWS
      const response = await fetchEstablishmentsByCategory(categoryName, currentKey);

      if (isInitial) {
        setEstablishments(response.items);
      } else {
        setEstablishments(prev => [...prev, ...response.items]);
      }

      // DynamoDB devuelve lastEvaluatedKey si hay más elementos. Si viene null/undefined, ya no hay más.
      setLastEvaluatedKey(response.lastEvaluatedKey);
      if (!response.lastEvaluatedKey) {
        setHasMore(false);
      }
      
    } catch (error) {
      console.error("Error cargando establecimientos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (establishmentId: string) => {
    if (['restaurantes', 'farmacia', 'super'].includes(categoryName)) {
      router.push(`/establishment/${establishmentId}` as any);
    } else {
      setIsModalVisible(true);
    }
  };

  const handleCloseModal = () => setIsModalVisible(false);

  useEffect(() => {
    // Al cambiar la categoría, reseteamos todo y cargamos desde el inicio
    setEstablishments([]);
    setLastEvaluatedKey(null);
    setHasMore(true);
    loadEstablishments(true);
  }, [categoryName]);

  const renderEstablishment = useCallback(({ item }: { item: Establishment }) => {
    const isProductFocus = categoryName === 'combos' || categoryName === 'super';

    return (
      <TouchableOpacity 
        style={styles.cardWrapper} 
        onPress={() => handleOpenModal(item.id)}
        activeOpacity={0.7}
      >
        <View style={isProductFocus ? styles.productCard : styles.establishmentRow}>
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

            <Text style={styles.tagsText} numberOfLines={1}>
              {item?.tags?.join(' • ')}
            </Text>

            <View style={styles.detailsRow}>
              <View style={styles.iconInfo}>
                <Ionicons name="time-outline" size={14} color={colors.lightText} />
                <Text style={styles.detailText}>{item.deliveryTime || '30-45 min'}</Text>
              </View>
              <View style={[styles.iconInfo, { marginLeft: 12 }]}>
                <Ionicons name="bicycle-outline" size={14} color={colors.lightText} />
                <Text style={styles.detailText}>
                  {item.deliveryCost === 0 ? 'Gratis' : `$${Number(item.deliveryCost).toFixed(2)}`}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }, [categoryName]);

  return (
    <>
      <View style={styles.container}>
        <Stack.Screen 
          options={{ 
            title: ' ' + categoryName.charAt(0).toUpperCase() + categoryName.slice(1), 
            headerBackTitle: 'Inicio',
            headerTintColor: '#000',
            headerTitleStyle: { fontWeight: 'bold' }
          }} 
        />
        
        <FlatList
          data={establishments}
          renderItem={renderEstablishment}
          keyExtractor={(item, index) => item.id || index.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={() => loadEstablishments(false)} // false porque no es inicial
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

      <Modal
        visible={isModalVisible}
        onRequestClose={handleCloseModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <TouchableOpacity onPress={handleCloseModal} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, marginBottom: 20 }}>Detalle de {categoryName}</Text>
          <Ionicons name="close-circle" size={36} color={colors.text} />
        </TouchableOpacity>
      </Modal>
    </>
  );
};

// ... (Los estilos se mantienen exactamente igual que en tu código original)

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