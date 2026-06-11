import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/colors';
import Sizes from '../../constants/Sizes';
import { useAuth } from '../../context/authContext';

const MyOrdersScreen = () => {
  const { userData } = useAuth();
  
  // Estado para controlar qué orden está expandida
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  
  const orders = userData?.orders || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'inicio': return '#FFA500';
      case 'proceso': return '#3498db';
      case 'en camino': return Colors.primary;
      case 'entregada': return '#2ecc71';
      default: return Colors.lightText;
    }
  };

  const toggleDetails = (orderId: string) => {
    // Si tocas la misma que está abierta, se cierra. Si tocas otra, se abre esa.
    setExpandedOrderId(prev => prev === orderId ? null : orderId);
  };

  const renderOrderItem = ({ item }: { item: any }) => {
    const isExpanded = expandedOrderId === item.orderId;

    // 💡 NUEVO: Extraemos la información basándonos en la nueva estructura agrupada
    const restaurantsGroup = item.orderData.restaurants || [];
    
    // Juntamos los nombres de los restaurantes para el encabezado (ej: "Comedor Central, Coulant")
    const displayNames = item.restaurantData?.map((r: any) => r.name).join(', ') || 'Comercio';
    
    // Calculamos el total de productos sumando los arreglos de todos los restaurantes
    const totalItemsCount = restaurantsGroup.reduce((acc: number, curr: any) => acc + (curr.items?.length || 0), 0);

    // Como ahora puede haber varios comercios, si no hay imageUri a nivel raíz, usamos un icono o color por defecto
    const headerImageUri = item.restaurantData?.[0]?.imageUri || 'https://via.placeholder.com/150/eeeeee/cccccc?text=Tienda';

    return (
      <View style={styles.orderCard}>
        <View style={styles.headerCard}>
          <Image source={{ uri: headerImageUri }} style={styles.restImage} />
          <View style={styles.headerText}>
            {/* Mostramos todos los comercios involucrados */}
            <Text style={styles.restName} numberOfLines={1}>{displayNames}</Text>
            <Text style={styles.orderDate}>
              {new Date(item.createdAt).toLocaleDateString()} • {item.orderId}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.orderStatus) }]}>
            <Text style={styles.statusText}>{item.orderStatus.toUpperCase()}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailsRow}>
          <Text style={styles.itemsCount}>
            {totalItemsCount} {totalItemsCount === 1 ? 'producto' : 'productos'}
          </Text>
          <Text style={styles.totalAmount}>${item.orderData.total?.toFixed(2)}</Text>
        </View>

        <TouchableOpacity 
          style={styles.reorderBtn} 
          onPress={() => toggleDetails(item.orderId)}
        >
          <Text style={styles.reorderText}>{isExpanded ? 'Ocultar Detalles' : 'Ver Detalles'}</Text>
          <Ionicons name={isExpanded ? "chevron-up" : "chevron-forward"} size={16} color={Colors.primary} />
        </TouchableOpacity>

        {/* --- SECCIÓN DESPLEGABLE DE DETALLES --- */}
        {isExpanded && (
          <View style={styles.expandedContent}>
            <Text style={styles.sectionSubtitle}>Productos por Comercio:</Text>
            
            {/* 💡 NUEVO: Mapeamos primero los restaurantes y luego sus productos */}
            {restaurantsGroup.map((rest: any, rIdx: number) => (
              <View key={rIdx} style={styles.restaurantGroupContainer}>
                <Text style={styles.restaurantGroupName}>{rest.restaurantName}</Text>
                
                {rest.items?.map((prod: any, pIdx: number) => (
                  <View key={pIdx} style={styles.productRow}>
                    <Text style={styles.productQty}>{prod.quantity}x</Text>
                    <Text style={styles.productName}>{prod.name}</Text>
                    <Text style={styles.productPrice}>${(prod.price * prod.quantity).toFixed(2)}</Text>
                  </View>
                ))}
              </View>
            ))}
            
            <View style={styles.dividerSmall} />
            
            <Text style={styles.detailInfoText}>
              <Text style={{ fontWeight: 'bold' }}>Dirección: </Text>
              {item.orderData.deliveryAddress}
            </Text>
            <Text style={styles.detailInfoText}>
              <Text style={{ fontWeight: 'bold' }}>Pago: </Text>
              {item.orderData.paymentMethod === 'cash' ? 'Efectivo' : 'Tarjeta'}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Historial de ordenes' }} />
      
      <FlatList
        data={[...orders].reverse()} 
        keyExtractor={(item) => item.orderId}
        renderItem={renderOrderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="fast-food-outline" size={80} color="#ccc" />
            <Text style={styles.emptyText}>Aún no has realizado pedidos.</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  listContent: { padding: Sizes.padding },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: Sizes.radius,
    padding: Sizes.padding,
    marginBottom: Sizes.padding,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerCard: { flexDirection: 'row', alignItems: 'center' },
  restImage: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#eee' },
  headerText: { flex: 1, marginLeft: 12, paddingRight: 8 }, // Añadido paddingRight para evitar superposición con el badge
  restName: { fontSize: 16, fontWeight: 'bold', color: Colors.text },
  orderDate: { fontSize: 12, color: Colors.lightText, marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 12 },
  detailsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemsCount: { color: Colors.text, fontSize: 14 },
  totalAmount: { fontWeight: 'bold', fontSize: 16, color: Colors.primary },
  reorderBtn: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopWidth: 1,
    borderTopColor: '#f9f9f9',
    paddingTop: 10
  },
  reorderText: { color: Colors.primary, fontWeight: '600', marginRight: 5 },
  
  // --- NUEVOS ESTILOS PARA LOS DETALLES ---
  expandedContent: {
    marginTop: 15,
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
  },
  sectionSubtitle: {
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
    fontSize: 14,
  },
  // 💡 Estilos agregados para separar visualmente los comercios dentro del detalle
  restaurantGroupContainer: {
    marginBottom: 10,
  },
  restaurantGroupName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  productRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingLeft: 4, // Pequeña indentación visual
  },
  productQty: {
    fontWeight: 'bold',
    color: Colors.text,
    marginRight: 8,
    width: 25,
  },
  productName: {
    flex: 1,
    color: Colors.text,
    fontSize: 14,
  },
  productPrice: {
    fontWeight: '600',
    color: Colors.text,
    fontSize: 14,
  },
  dividerSmall: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 10,
  },
  detailInfoText: {
    fontSize: 13,
    color: Colors.text,
    marginBottom: 4,
  },
  
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { marginTop: 20, fontSize: 16, color: Colors.lightText }
});

export default MyOrdersScreen;