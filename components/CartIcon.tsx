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
import { useRouter } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Colors from '../constants/colors';
import Sizes from '../constants/Sizes';
import { CartEstablishmentGroup } from '../models/commons.model'; // 💡 Importar el tipo de grupo


const CartIcon: React.FC = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const navigation = useRouter();
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

  const handleCheckout = () => {
    // 💡 Asegúrate de que apunte a la ruta 'checkout'
    // Expo Router asume 'checkout/index' si navegas a 'checkout'
    navigation.navigate('checkout' as never); 
  };
  // 💡 FUNCIÓN PARA HACER TOGGLE
  const toggleItemExpansion = (itemId: string) => {
    setExpandedItems(prev => {
      if (prev.includes(itemId)) {
        // Si ya está en la lista, lo quitamos (colapsar)
        return prev.filter(id => id !== itemId);
      } else {
        // Si no está, lo añadimos (expandir)
        return [...prev, itemId];
      }
    });
  };
  
   // Renderiza una sección de establecimiento (Supermercado, Restaurante, etc.)
  const renderEstablishmentSection = (group: CartEstablishmentGroup) => (
    <View key={group.id} style={styles.section}>
      {/* 💡 Mostrar el nombre del establecimiento y el costo de envío */}
      <View style={styles.groupHeader}>
        <Text style={styles.sectionTitle}>{group.name}</Text>
        <Text style={styles.deliveryCost}>Envío: ${group.deliveryCost.toFixed(2)}</Text>
      </View> 
    {group.items.map(item => {
    // 💡 Verificar si este ítem está expandido
    const isExpanded = expandedItems.includes(item.id);
    // 💡 Preparamos las opciones para ser listadas
    const optionsArray = Object.entries(item.optionsSelected || {});
    return (
        <View key={item.id} style={styles.sectionItemContainer}> {/* Usamos un contenedor principal para el borde */}
            {/* 1. FILA PRINCIPAL DEL ÍTEM (Nombre, Controles, Precio) */}
            <View style={styles.itemRow}>         
                {/* 💡 CONTROLES DE CANTIDAD (Eliminar, Cantidad, Añadir) */}
          <View style={styles.quantityControls}>
            {/* Botón de ELIMINAR/DECREMENTAR */}
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => removeItemFromCart(item.id)}>
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
              // addItemToCart acepta el item, e incrementa
              onPress={() => addItemToCart(item)}>
                <Ionicons 
                name="add" 
                size={16} 
                color={Colors.text} 
              />   
            </TouchableOpacity>
          </View>    
                {/* Nombre y Toggle */}
                <TouchableOpacity 
                    style={styles.itemNameContainer} 
                    onPress={() => toggleItemExpansion(item.id)} // 💡 Toca el nombre para expandir/colapsar
                    activeOpacity={0.8}
                >
                    <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                    {optionsArray.length > 0 && (
                        <View style={styles.optionsToggleContainer}>
                             <Text style={styles.optionsHint}>Ver opciones</Text>
                            <Ionicons 
                                name={isExpanded ? "chevron-up" : "chevron-down"} 
                                size={14} 
                                color={Colors.lightText} 
                                style={styles.toggleIcon}
                            />
                        </View>
                    )}
                </TouchableOpacity>
                <Text style={styles.itemPrice}>${(item.quantity * item.price).toFixed(2)}</Text>
            </View>
            {/* 2. CONTENIDO EXPANDIBLE (Solo si isExpanded es true) */}
            {isExpanded && optionsArray.length > 0 && (
    <View style={styles.expandedOptions}>
        {optionsArray.map(([groupName, optionValue]) => {
            
            // 💡 Aseguramos que los valores no sean nulos/indefinidos y que no sean strings vacíos
            const displayGroup = String(groupName).trim();
            const displayValue = String(optionValue).trim();
            
            if (!displayGroup && !displayValue) return null; // Saltar si ambos están vacíos
            
            return (
                <View key={`${item.id}-${groupName}`} style={styles.optionDetailRow}>
                    
                    {displayGroup && <Text style={styles.optionDetailGroup}>{displayGroup}:</Text>}
                    
                    {/* Aseguramos que mostramos al menos algo si el valor está presente */}
                    {displayValue && <Text style={styles.optionDetailValue}>{displayValue}</Text>}
                </View>
            );
        })}
    </View>
)}
</View>
    );
})}
      {/* Mostrar subtotal del grupo */}
      <Text style={styles.groupSubtotal}>Subtotal Establecimiento: ${group.subtotal.toFixed(2)}</Text>
    </View>
  );

 return (
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
        {/* 1. OVERLAY: Cierra el modal al tocar el fondo oscuro */}
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)} // Cierra el modal
        >
            {/* 2. CONTENIDO: Detiene la propagación de toques para que los botones internos funcionen */}
          <View 
                style={styles.modalContent} 
                onStartShouldSetResponder={() => true} // 💡 ESTO ES CLAVE: Detiene el toque aquí
            >
                {/* 3. SafeAreaProvider es ahora un envoltorio interno */}
                <SafeAreaProvider>
            
            <View style={styles.modalHeader}>
              <Text style={styles.cartTitle}>Tu Carrito ({totalItems} items)</Text>
              {/* ESTE BOTÓN AHORA DEBE FUNCIONAR */}
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
                
                <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
                  <Text style={styles.checkoutButtonText}>Ir a Pagar (${finalTotal.toFixed(2)})</Text>
                </TouchableOpacity>
              </View>
            )}
                </SafeAreaProvider>
            </View>
        </TouchableOpacity>
      </Modal>
      
    </>
  );
};

const styles = StyleSheet.create({
    itemRow: {
        // Contenedor principal del ítem
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    itemNameContainer: {
        flex: 1, 
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginRight: Sizes.smallPadding,
        paddingRight: Sizes.smallPadding,
        paddingVertical: 4, // Área de toque más fácil
    },
    itemName: {
        fontSize: Sizes.font,
        color: Colors.text,
        fontWeight: '500',
        maxWidth: '65%', // Deja espacio para el hint
    },
    itemOptions: {
        fontSize: 12, // Tamaño más pequeño
        color: Colors.lightText, // Color gris sutil
        fontStyle: 'italic',
        marginTop: 2,
    },
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
  itemQuantity: {
    marginRight: Sizes.smallPadding,
     fontSize: Sizes.font,
    fontWeight: 'bold',
    color: Colors.text,
    minWidth: 18,
    textAlign: 'center',
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
  sectionItemContainer: {
        marginBottom: 8,
        paddingBottom: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
  
    // Estilos del indicador de opciones
    optionsToggleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Sizes.smallPadding / 2,
        borderRadius: Sizes.radius,
    },
    optionsHint: {
        fontSize: 12,
        color: Colors.lightText,
        marginRight: 4,
    },
    toggleIcon: {
        alignSelf: 'center',
    },

    // Estilos del CONTENIDO EXPANDIDO
    expandedOptions: {
        backgroundColor: Colors.background,
        padding: Sizes.smallPadding,
        paddingTop: 0,
        marginBottom: Sizes.smallPadding,
    },
    optionDetailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 2,
    },
    optionDetailGroup: {
        fontSize: 12,
        color: Colors.text,
        fontWeight: 'bold',
    },
    optionDetailValue: {
        fontSize: 12,
        color: Colors.lightText,
    },
});

export default CartIcon;