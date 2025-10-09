// components/CartIcon.tsx

import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import { useCart } from '@/context/CartContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Colors from '../constants/colors';
import Sizes from '../constants/Sizes';
import { CartEstablishmentGroup } from '../models/commons.model'; // 💡 Importar el tipo de grupo


// Datos de ejemplo para la estructura del carrito
const MOCK_CART_DATA = [
  { 
    id: 's1', 
    name: 'Supermercado Central', 
    items: [
      { id: 'i1', name: 'Jabón de Baño', quantity: 2, price: 1.50 },
      { id: 'i2', name: 'Leche (1L)', quantity: 3, price: 2.00 },
    ],
  },
  { 
    id: 's2', 
    name: 'Restaurante El Sabor', 
    items: [
      { id: 'i3', name: 'Plato del Día (Pollo)', quantity: 1, price: 8.50 },
      { id: 'i4', name: 'Jugo de Naranja', quantity: 2, price: 1.75 },
    ],
  },
];

const CartIcon: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  // 💡 CONSUMIR DATOS DEL CONTEXTO
  // 💡 Obtenemos las funciones de modificación
  const { 
    totalItems, 
    subtotal, 
    totalDeliveryCost, 
    finalTotal, 
    groupedItems,
    addItemToCart, // También lo necesitamos para el botón "+"
    removeItemFromCart // 💡 Esta es la nueva función de remoción
  } = useCart();

   // Renderiza una sección de establecimiento (Supermercado, Restaurante, etc.)
  const renderEstablishmentSection = (group: CartEstablishmentGroup) => (
    <View key={group.id} style={styles.section}>
      {/* 💡 Mostrar el nombre del establecimiento y el costo de envío */}
      <View style={styles.groupHeader}>
        <Text style={styles.sectionTitle}>{group.name}</Text>
        <Text style={styles.deliveryCost}>Envío: ${group.deliveryCost.toFixed(2)}</Text>
      </View>
      
     {group.items.map(item => (
        <View key={item.productId} style={styles.itemRow}>
          
          {/* 💡 CONTROLES DE CANTIDAD (Eliminar, Cantidad, Añadir) */}
          <View style={styles.quantityControls}>
            
            {/* Botón de ELIMINAR/DECREMENTAR */}
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => removeItemFromCart(item.productId)}
            >
              {/* Si es 1, muestra el icono de papelera. Si es > 1, muestra el signo de menos */}
              <Ionicons 
                name={item.quantity === 1 ? "trash-outline" : "remove"} 
                size={16} 
                color={item.quantity === 1 ? Colors.error : Colors.text} 
              />
            </TouchableOpacity>
            
            <Text style={styles.itemQuantity}>{item.quantity}</Text>

            {/* Botón de AÑADIR (incrementar) */}
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => addItemToCart(item)} // addItemToCart acepta el item, e incrementa
            >
              <Ionicons 
                name="add" 
                size={16} 
                color={Colors.text} 
              />
            </TouchableOpacity>
          </View>

          {/* Nombre y Precio (Reducimos el espacio para el nombre) */}
          <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
          <Text style={styles.itemPrice}>${(item.quantity * item.price).toFixed(2)}</Text>
        </View>
      ))}
      {/* Mostrar subtotal del grupo */}
      <Text style={styles.groupSubtotal}>Subtotal Establecimiento: ${group.subtotal.toFixed(2)}</Text>
    </View>
  );

 return (
    // ... (El resto del código JSX para el icono del header y el badge) ...
    <>
      <TouchableOpacity 
        onPress={() => setModalVisible(true)} 
        style={styles.iconButton}
      >
        <Ionicons 
          name="cart-outline" 
          size={Sizes.icon} 
          color={Colors.text} 
        />
        {totalItems > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{totalItems > 99 ? '99+' : totalItems}</Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <SafeAreaProvider style={styles.modalContent} onStartShouldSetResponder={() => true}>
            
            <View style={styles.modalHeader}>
              <Text style={styles.cartTitle}>Tu Carrito ({totalItems} items)</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.text} />
              </TouchableOpacity>
            </View>

            {/* Lista de Productos por Establecimiento con ScrollView */}
            <ScrollView style={styles.cartList}>
              {groupedItems.length > 0 ? (
                groupedItems.map(renderEstablishmentSection)
              ) : (
                <Text style={styles.emptyText}>Tu carrito está vacío. ¡Añade productos de tus establecimientos favoritos!</Text>
              )}
            </ScrollView>

            {/* Resumen del Total */}
            {groupedItems.length > 0 && (
              <View style={styles.summaryContainer}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal de Productos</Text>
                  <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Costo Total de Envío</Text>
                  <Text style={styles.summaryValue}>${totalDeliveryCost.toFixed(2)}</Text>
                </View>
                <View style={[styles.summaryRow, styles.totalRow]}>
                  <Text style={styles.summaryLabel}>Total a Pagar</Text>
                  <Text style={styles.totalValue}>${finalTotal.toFixed(2)}</Text>
                </View>
                
                <TouchableOpacity style={styles.checkoutButton}>
                  <Text style={styles.checkoutButtonText}>Ir a Pagar (${finalTotal.toFixed(2)})</Text>
                </TouchableOpacity>
              </View>
            )}
            
          </SafeAreaProvider>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    paddingHorizontal: Sizes.padding,
    marginRight: 0,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: Colors.error,
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: Colors.background,
    fontSize: 12,
    fontWeight: 'bold',
  },
  // Estilos del Modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end', // Alinea el modal a la parte inferior
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: Sizes.radius * 2,
    borderTopRightRadius: Sizes.radius * 2,
    paddingTop: Sizes.padding,
    height: '75%', // Ocupa el 75% de la pantalla
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Sizes.padding,
    marginBottom: Sizes.padding,
  },
  cartTitle: {
    fontSize: Sizes.header,
    fontWeight: 'bold',
    color: Colors.text,
  },
  cartList: {
    flex: 1, // Permite que la lista crezca y use scroll si hay muchos items
    paddingHorizontal: Sizes.padding,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.lightText,
    marginTop: Sizes.largePadding,
  },
  // Estilos de las secciones del Carrito
  section: {
    marginBottom: Sizes.padding,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingBottom: Sizes.smallPadding,
  },
  sectionTitle: {
    fontSize: Sizes.title,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: Sizes.smallPadding,
  },
  itemRow: {
    justifyContent: 'space-between',
     flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemQuantity: {
    marginRight: Sizes.smallPadding,
     fontSize: Sizes.font,
    fontWeight: 'bold',
    color: Colors.text,
    minWidth: 18,
    textAlign: 'center',
  },
  itemName: {
     flex: 1,
    fontSize: Sizes.font,
    color: Colors.text,
    marginRight: Sizes.smallPadding, // Espacio antes del precio
  },
  itemPrice: {
    fontSize: Sizes.font,
    fontWeight: 'bold',
    color: Colors.text,
  },
  // Estilos del Resumen y Botón
  summaryContainer: {
    padding: Sizes.padding,
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Sizes.smallPadding / 2,
  },
  summaryLabel: {
    fontSize: Sizes.font,
    color: Colors.lightText,
  },
  summaryValue: {
    fontSize: Sizes.font,
    fontWeight: '500',
    color: Colors.text,
  },
  totalRow: {
    marginTop: Sizes.smallPadding,
  },
  totalValue: {
    fontSize: Sizes.title,
    fontWeight: 'bold',
    color: Colors.error,
  },
  checkoutButton: {
    backgroundColor: Colors.primary,
    padding: Sizes.smallPadding,
    borderRadius: Sizes.radius,
    marginTop: Sizes.padding,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: Colors.background,
    fontSize: Sizes.title,
    fontWeight: 'bold',
  },
   groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Sizes.smallPadding / 2,
  },
  deliveryCost: {
    fontSize: Sizes.subtitle,
    fontWeight: '500',
    color: Colors.error, // Resaltar el costo
  },
  groupSubtotal: {
    fontSize: Sizes.font,
    textAlign: 'right',
    color: Colors.text,
    marginTop: Sizes.smallPadding / 2,
    fontWeight: 'bold',
  },
   // Nuevo contenedor para los botones y la cantidad
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: Sizes.smallPadding,
    width: 80, // Ancho fijo para mantener la alineación
    justifyContent: 'space-between',
  },
  quantityButton: {
    padding: 2,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CartIcon;