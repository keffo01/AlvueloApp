// components/CartIcon.tsx
// ✍️ Actualizado por @keffoAlvuelo - Carrito rediseñado con soporte para imágenes, miniaturas y diseño moderno

import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState } from 'react';
import {
  Image,
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
    setModalVisible(false);
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
        const options = item.optionsSelected || {};
        const isCustomFavor = Boolean(options.isCustomFavor);
        const attachedImages = options.images || [];

        // Determinar imagen principal para miniatura
        const primaryImage = item.imageUri || (attachedImages.length > 0 ? attachedImages[0].uri : null);

        return (
          <View key={item.id} style={styles.sectionItemContainer}>
            
            {/* 1. FILA PRINCIPAL DEL ÍTEM */}
            <View style={styles.itemRow}>
              
              {/* MINIATURA DE IMAGEN */}
              <View style={styles.itemImageContainer}>
                {primaryImage ? (
                  <Image source={{ uri: primaryImage }} style={styles.itemThumbnail} />
                ) : (
                  <View style={styles.placeholderThumbnail}>
                    <Ionicons name={isCustomFavor ? "bicycle-outline" : "fast-food-outline"} size={18} color={Colors.primary} />
                  </View>
                )}
              </View>

              {/* CONTROLES DE CANTIDAD */}
              <View style={styles.quantityControls}>
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={() => removeItemFromCart(item.id)}>
                  <Ionicons 
                    name={item.quantity === 1 ? "trash-outline" : "remove"} 
                    size={14} 
                    color={item.quantity === 1 ? Colors.error : Colors.text} 
                  />
                </TouchableOpacity>
                <Text style={styles.itemQuantity}>{item.quantity}</Text>
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={() => addItemToCart(item)}>
                  <Ionicons name="add" size={14} color={Colors.text} /> 
                </TouchableOpacity>
              </View>    

              {/* Nombre y Toggle de Detalles */}
              <TouchableOpacity 
                  style={styles.itemNameContainer} 
                  onPress={() => toggleItemExpansion(item.id)}
                  activeOpacity={0.8}
              >
                  <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
                  {(!isCustomFavor && Object.keys(options).length > 0) || (isCustomFavor) ? (
                    <View style={styles.optionsToggleContainer}>
                      <Text style={styles.optionsHint}>{isExpanded ? 'Ocultar' : 'Ver detalles'}</Text>
                      <Ionicons 
                          name={isExpanded ? "chevron-up" : "chevron-down"} 
                          size={12} 
                          color={Colors.lightText} 
                      />
                    </View>
                  ) : null}
              </TouchableOpacity>

              <Text style={styles.itemPrice}>${(item.quantity * item.price).toFixed(2)}</Text>
            </View>

            {/* 2. CONTENIDO EXPANDIBLE LIMPIO Y FORMATEADO */}
            {isExpanded && (
              <View style={styles.expandedOptions}>
                {isCustomFavor ? (
                  // DISEÑO PARA MANDADITOS / FAVORES
                  <View style={styles.customFavorDetails}>
                    {options.pickupLocation ? (
                      <View style={styles.detailRow}>
                        <Ionicons name="location-outline" size={14} color={Colors.primary} style={styles.detailIcon} />
                        <Text style={styles.detailLabel}>Recolectar en: </Text>
                        <Text style={styles.detailVal}>{options.pickupLocation}</Text>
                      </View>
                    ) : null}

                    {options.referencePrice ? (
                      <View style={styles.detailRow}>
                        <Ionicons name="cash-outline" size={14} color={Colors.primary} style={styles.detailIcon} />
                        <Text style={styles.detailLabel}>Precio estimado: </Text>
                        <Text style={styles.detailVal}>${Number(options.referencePrice).toFixed(2)}</Text>
                      </View>
                    ) : null}

                    {/* GALERÍA DE FOTOS ADJUNTAS */}
                    {attachedImages.length > 0 && (
                      <View style={styles.imagesPreviewContainer}>
                        <Text style={styles.imagesPreviewTitle}>Fotos de referencia:</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.thumbnailsScroll}>
                          {attachedImages.map((img: any, idx: number) => (
                            <View key={idx} style={styles.previewThumbWrapper}>
                              <Image source={{ uri: img.uri }} style={styles.previewThumbImage} />
                            </View>
                          ))}
                        </ScrollView>
                      </View>
                    )}
                  </View>
                ) : (
                  // DISEÑO PARA OPCIONES DE PRODUCTOS NORMALES (COMOS/COMPLEMENTOS)
                  Object.entries(options).map(([groupName, optionValue]) => {
                    const displayGroup = String(groupName).trim();
                    const displayValue = String(optionValue).trim();
                    if (!displayGroup || !displayValue) return null;
                    
                    return (
                      <View key={`${item.id}-${groupName}`} style={styles.optionDetailRow}>
                        <Text style={styles.optionDetailGroup}>{displayGroup}:</Text>
                        <Text style={styles.optionDetailValue}>{displayValue}</Text>
                      </View>
                    );
                  })
                )}
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
        <Ionicons name="cart-outline" size={Sizes.icon} color={Colors.text} />
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
            <SafeAreaProvider>
              <View style={styles.modalHeader}>
                <View style={styles.headerTitleContainer}>
                  <Ionicons name="bag-handle-outline" size={22} color={Colors.primary} />
                  <Text style={styles.cartTitle}>Tu Carrito</Text>
                  <View style={styles.headerBadge}>
                    <Text style={styles.headerBadgeText}>{totalItems} {totalItems === 1 ? 'item' : 'items'}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                  <Ionicons name="close" size={20} color={Colors.text} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.cartList} showsVerticalScrollIndicator={false}>
                {groupedItems.length > 0 ? (
                  groupedItems.map(renderEstablishmentSection)
                ) : (
                  <View style={styles.emptyContainer}>
                    <Ionicons name="cart-outline" size={60} color={Colors.lightText} />
                    <Text style={styles.emptyText}>Tu carrito está vacío.</Text>
                    <Text style={styles.emptySubText}>¡Añade productos o solicita un mandadito!</Text>
                  </View>
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
                    <Text style={styles.totalLabelText}>Total a Pagar</Text>
                    <Text style={styles.totalValue}>${finalTotal.toFixed(2)}</Text>
                  </View>
                  
                  <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout} activeOpacity={0.85}>
                    <Text style={styles.checkoutButtonText}>Ir a Pagar (${finalTotal.toFixed(2)})</Text>
                    <Ionicons name="arrow-forward" size={18} color={Colors.background} />
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
  iconButton: {
    paddingHorizontal: Sizes.padding,
    marginRight: 0,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: Colors.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: Colors.background,
    fontSize: 10,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end', 
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: Sizes.padding,
    height: '80%', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Sizes.padding,
    paddingBottom: Sizes.smallPadding,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  headerBadge: {
    backgroundColor: '#FFF2F2',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  headerBadgeText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: '#F5F5F5',
    padding: 6,
    borderRadius: 20,
  },
  cartList: {
    flex: 1, 
    paddingHorizontal: Sizes.padding,
    paddingTop: Sizes.smallPadding,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 12,
  },
  emptySubText: {
    textAlign: 'center',
    color: Colors.lightText,
    marginTop: 6,
    fontSize: 14,
  },
  section: {
    marginBottom: Sizes.padding,
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: Sizes.smallPadding,
    borderWidth: 1,
    borderColor: '#EFEFEF',
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Sizes.smallPadding,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingBottom: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  deliveryCost: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.error, 
  },
  sectionItemContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemImageContainer: {
    width: 42,
    height: 42,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F0F0F0',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemThumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderThumbnail: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
  },
  quantityButton: {
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    width: 22,
    height: 22,
  },
  itemQuantity: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colors.text,
    minWidth: 18,
    textAlign: 'center',
  },
  itemNameContainer: {
    flex: 1, 
    marginRight: 8,
  },
  itemName: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: '600',
  },
  optionsToggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  optionsHint: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '500',
    marginRight: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.text,
  },
  expandedOptions: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FAFAFA',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingBottom: 8,
  },
  customFavorDetails: {
    gap: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
  },
  detailIcon: {
    marginRight: 6,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text,
  },
  detailVal: {
    fontSize: 12,
    color: Colors.lightText,
    flex: 1,
  },
  imagesPreviewContainer: {
    marginTop: 6,
  },
  imagesPreviewTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.lightText,
    marginBottom: 4,
  },
  thumbnailsScroll: {
    gap: 6,
  },
  previewThumbWrapper: {
    width: 50,
    height: 50,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  previewThumbImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  optionDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  optionDetailGroup: {
    fontSize: 12,
    color: Colors.text,
    fontWeight: '600',
  },
  optionDetailValue: {
    fontSize: 12,
    color: Colors.lightText,
  },
  groupSubtotal: {
    fontSize: 13,
    textAlign: 'right',
    color: Colors.text,
    marginTop: 8,
    fontWeight: '700',
  },
  summaryContainer: {
    padding: Sizes.padding,
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
    backgroundColor: '#FFF',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.lightText,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  totalRow: {
    marginTop: 4,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  totalLabelText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.error,
  },
  checkoutButton: {
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 14,
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 4,
  },
  checkoutButtonText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CartIcon;