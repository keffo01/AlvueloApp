// app/[category]/index.tsx
import { Ionicons } from '@expo/vector-icons';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Modal, NativeSyntheticEvent, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Sizes from '../../constants/Sizes';
import colors from '../../constants/colors';

// Modelos y Servicios
import ProductDetailModal from '../../components/ProductDetailModal'; // 💡 Modal de opciones del producto/combo
import { fetchEstablishmentsByCategory } from '../../services/quickOption.service';

const EstablishmentListScreen: React.FC = () => {
  const { category: categoryId } = useLocalSearchParams();
  const categoryName = Array.isArray(categoryId) ? categoryId[0] : categoryId || 'Establecimientos';

  // Estados generales
  const [dataList, setDataList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState<any>(null);

  // Estados específicos para manejar el Modal del Combo seleccionado
  const [selectedCombo, setSelectedCombo] = useState<any>(null);
  const [isComboModalVisible, setIsComboModalVisible] = useState(false);

  // Carga de datos según la categoría
  const loadData = async (isInitial = false) => {
    if (loading || (!hasMore && !isInitial)) return;

    setLoading(true);
    
    try {
      if (categoryName === 'combos') {
        // 💡 Consumimos la API de Combos Activos y parseamos el body correctamente
        const response = await fetch('https://jfzj8yx48i.execute-api.us-east-2.amazonaws.com/Dev/combos'); 
        const jsonResponse = await response.json();
       
        const combosData = typeof jsonResponse.body === 'string' 
          ? JSON.parse(jsonResponse.body) 
          : (jsonResponse.body || jsonResponse);

        setDataList(Array.isArray(combosData) ? combosData : []);
        setHasMore(false); // Los combos cargan de una sola vez
      } else {
        // 💡 Lógica intacta para establecimientos (Restaurantes, Farmacia, Súper)
        const currentKey = isInitial ? null : lastEvaluatedKey;
        const response = await fetchEstablishmentsByCategory(categoryName, currentKey);

        if (isInitial) {
          setDataList(response.items);
        } else {
          setDataList(prev => [...prev, ...response.items]);
        }

        setLastEvaluatedKey(response.lastEvaluatedKey);
        if (!response.lastEvaluatedKey) {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Manejo de pulsación en la lista
  const handleItemPress = (item: any) => {
    if (categoryName === 'combos') {
      // 💡 Abrimos el modal con la estructura completa del combo
      setSelectedCombo(item);
      setIsComboModalVisible(true);
      console.log("Combo seleccionado:", item);
    } else if (['restaurantes', 'farmacia', 'super'].includes(categoryName)) {
      router.push(`/establishment/${item.id}` as any);
    }
  };

  useEffect(() => {
    setDataList([]);
    setLastEvaluatedKey(null);
    setHasMore(true);
    loadData(true);
  }, [categoryName]);

  const renderItem = useCallback(({ item }: { item: any }) => {
    const isCombo = categoryName === 'combos';

    return (
      <TouchableOpacity 
        style={styles.cardWrapper} 
        onPress={() => handleItemPress(item)}
        activeOpacity={0.7}
      >
        {isCombo ? (
          // 💡 Diseño exclusivo para renderizar los Combos
          <View style={styles.productCard}>
            <Image 
              source={{ uri: item.imageUri || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c' }} 
              style={styles.productImage} 
            />
            <View style={styles.infoContainer}>
              <Text style={styles.nameText} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.tagsText} numberOfLines={2}>{item.description}</Text>
              
              <View style={styles.headerRow}>
                <Text style={styles.priceText}>${Number(item.price || 0).toFixed(2)}</Text>
                <View style={styles.viewOptionsBtn}>
                  <Text style={styles.viewOptionsText}>Ver opciones</Text>
                  <Ionicons name="chevron-forward" size={14} color={colors.primary} />
                </View>
              </View>
            </View>
          </View>
        ) : (
          // 💡 Diseño original intacto para Establecimientos
          <View style={styles.establishmentRow}>
            <Image source={{ uri: item.imageUri }} style={styles.establishmentLogo} />
            <View style={styles.infoContainer}>
              <View style={styles.headerRow}>
                <Text style={styles.nameText} numberOfLines={1}>{item.name}</Text>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={12} color="#FFB800" />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
              </View>
              <Text style={styles.tagsText} numberOfLines={1}>{item?.tags?.join(' • ')}</Text>
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
        )}
      </TouchableOpacity>
    );
  }, [categoryName]);

  function handleCloseModal(event: NativeSyntheticEvent<any>): void {
    setIsComboModalVisible(false);
    setSelectedCombo(null);
  }

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
          data={dataList}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.productId || item.id || index.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          onEndReached={() => {
            if (categoryName !== 'combos') loadData(false);
          }}
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
                  No hay elementos disponibles en "{categoryName}".
                </Text>
              </View>
            ) : null
          }
        />
      </View>

      {/* 💡 MODAL DE DETALLE Y OPCIONES DEL COMBO */}
      {selectedCombo && (
         <Modal
        visible={isComboModalVisible}
        onRequestClose={handleCloseModal}
        animationType="slide"
        presentationStyle="pageSheet" // Estilo iOS de modal (opcional)
      >
         <ProductDetailModal
          visible={isComboModalVisible}
          product={selectedCombo}
          onClose={() => {
            setIsComboModalVisible(false);
            setSelectedCombo(null);
          }}
        />
      </Modal>
       
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: Sizes.padding,
    paddingBottom: 40,
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  establishmentRow: {
    flexDirection: 'row',
    padding: 12,
    alignItems: 'center',
  },
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
    height: 160,
    resizeMode: 'cover',
  },
  infoContainer: {
    flex: 1,
    padding: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  nameText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
    marginRight: 8,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  viewOptionsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewOptionsText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
    marginRight: 2,
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
    marginTop: 2,
    marginBottom: 6,
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