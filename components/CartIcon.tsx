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
import { CartEstablishmentGroup } from '../models/commons.model';

const CartIcon: React.FC = () => {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const navigation = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  
  const { 
    totalItems, 
    subtotal, 
    totalDeliveryCost, 
    finalTotal, 
    groupedItems,
    addItemToCart,
    removeItemFromCart
  } = useCart();

  const handleCheckout = () => {
    setModalVisible(false); // Es buena práctica cerrar el modal al navegar
    navigation.navigate('checkout' as never); 
  };

  const toggleItemExpansion = (itemId: string) => {
    setExpandedItems(prev => {
      if (prev.includes(itemId)) {
        return prev.filter(id => id !== itemId);
      } else {
        return [...prev, itemId];
      }
    });
  };
  
  const renderEstablishmentSection = (group: CartEstablishmentGroup) => (
    <View key={group.id} style={styles.section}>
      <View style={styles.groupHeader}>
        <Text style={styles.sectionTitle}>{group.name}</Text>
        <Text style={styles.deliveryCost}>Envío: ${group.deliveryCost.toFixed(2)}</Text>
      </View> 
      
      {group.items.map(item => {
        const isExpanded = expandedItems.includes(item.id);
        const optionsArray = Object.entries(item.optionsSelected || {});
        
        return (
          <View key={item.id} style={styles.sectionItemContainer}>
            {/* 1. FILA PRINCIPAL DEL ÍTEM */}
            <View style={styles.itemRow}>         
              {/* CONTROLES DE CANTIDAD */}
              <View style={styles.quantityControls}>
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={() => removeItemFromCart(item.id)}>
                  <Ionicons 
                    name={item.quantity === 1 ? "trash-outline" : "remove"} 
                    size={16} 
                    color={item.quantity === 1 ? Colors.error : Colors.text} 
                  />
                </TouchableOpacity>
                
                <Text style={styles.itemQuantity}>{item.quantity}</Text>
                
                <TouchableOpacity 
                  style={styles.quantityButton}
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
                  onPress={() => toggleItemExpansion(item.id)}
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

            {/* 2. CONTENIDO EXPANDIBLE (SOLUCIÓN APLICADA AQUÍ) */}
            {isExpanded && optionsArray.length > 0 && (
              <View style={styles.expandedOptions}>
                  {optionsArray.map(([groupName, optionValue]) => {
                      const displayGroup = String(groupName).trim();
                      const displayValue = String(optionValue).trim();
                      
                      if (!displayGroup && !displayValue) return null;
                      
                      return (
                          <View key={`${item.id}-${groupName}`} style={styles.optionDetailRow}>
                              {/* CORRECCIÓN: Usar !!displayGroup para asegurar booleano, o verificar length */}
                              {displayGroup.length > 0 ? (
                                <Text style={styles.optionDetailGroup}>{displayGroup}:</Text>
                              ) : null}
                              
                              {displayValue.length > 0 ? (
                                <Text style={styles.optionDetailValue}>{displayValue}</Text>
                              ) : null}
                          </View>
                      );
                  })}
              </View>
            )}
          </View>
        );
      })}
      
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
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View 
            style={styles.modalContent} 
            onStartShouldSetResponder={() => true}
          >
            {/* SafeAreaProvider dentro de un Modal puede ser redundante si ya existe en _layout, pero no causa error */}
            <SafeAreaProvider>
              <View style={styles.modalHeader}>
                <Text style={styles.cartTitle}>Tu Carrito ({totalItems} items)</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={24} color={Colors.text} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.cartList}>
                {groupedItems.length > 0 ? (
                  groupedItems.map(renderEstablishmentSection)
                ) : (
                  <Text style={styles.emptyText}>Tu carrito está vacío. ¡Añade productos de tus establecimientos favoritos!</Text>
                )}
              </ScrollView>

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
        paddingVertical: 4, 
    },
    itemName: {
        fontSize: Sizes.font,
        color: Colors.text,
        fontWeight: '500',
        maxWidth: '65%', 
    },
    itemOptions: {
        fontSize: 12, 
        color: Colors.lightText, 
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
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end', 
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    modalContent: {
        backgroundColor: Colors.background,
        borderTopLeftRadius: Sizes.radius * 2,
        borderTopRightRadius: Sizes.radius * 2,
        paddingTop: Sizes.padding,
        height: '75%', 
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
        flex: 1, 
        paddingHorizontal: Sizes.padding,
    },
    emptyText: {
        textAlign: 'center',
        color: Colors.lightText,
        marginTop: Sizes.largePadding,
    },
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
        color: Colors.error, 
    },
    groupSubtotal: {
        fontSize: Sizes.font,
        textAlign: 'right',
        color: Colors.text,
        marginTop: Sizes.smallPadding / 2,
        fontWeight: 'bold',
    },
    quantityControls: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: Sizes.smallPadding,
        width: 80, 
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