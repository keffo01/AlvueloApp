// app/checkout/index.tsx
// ✍️ Actualizado por @keffoAlvuelo - Inclusión correcta de opciones y complementos en el payload

import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { orderService } from '@/services/order.service';
import { UserService } from '@/services/user.service';
import Colors from '../../constants/colors';
import Sizes from '../../constants/Sizes';
import { useAuth } from '../../context/authContext';
import { useCart } from '../../context/CartContext';

const CheckoutScreen: React.FC = () => {
  const { cart, subtotal, totalDeliveryCost, clearCart, groupedItems } = useCart();
  const { userData, updateUserData } = useAuth();
  const navigation = useRouter();
  const insets = useSafeAreaInsets();
  
  // Direcciones
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Pagos
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | null>(null);

  const total = useMemo(() => subtotal + totalDeliveryCost, [subtotal, totalDeliveryCost]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoadingAddresses(true);
        const email = userData?.email || '';
        const data = await UserService.getProfile(email);
        setTimeout(() => {
          setAddresses(data.addressData || []);
          setLoadingAddresses(false);
        }, 1000);
      } catch (error) {
        Alert.alert("Error", "No se pudieron cargar tus direcciones.");
        setLoadingAddresses(false);
      }
    };
    if (userData?.email) fetchAddresses();
  }, [userData?.email]);

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) return Alert.alert("Faltan datos", "Por favor, selecciona una dirección de entrega.");
    if (!paymentMethod) return Alert.alert("Faltan datos", "Por favor, selecciona un método de pago.");
    
    try {
      setIsProcessing(true);

      // 📸 1. RECOLECTAR IMÁGENES BASE64 PARA S3
      const allImagesForS3: any[] = [];
      cart.forEach((item: any) => {
        if (item.optionsSelected?.images && Array.isArray(item.optionsSelected.images)) {
          item.optionsSelected.images.forEach((img: any) => {
            if (img.base64) {
              allImagesForS3.push({
                fileName: img.fileName,
                base64: img.base64
              });
            }
          });
        }
      });

      // 🧹 2. AGRUPAR Y LIMPIAR ÍTEMS CON SUS OPCIONES/COMPLEMENTOS
      const formattedGroupedItems = groupedItems.map(group => ({
        restaurantId: group.id,
        restaurantName: group.name,
        items: group.items.map((item: any) => {
          const { images, ...cleanOptions } = item.optionsSelected || {};
          const readableName = cleanOptions.isCustomFavor
            ? `Mandado: ${cleanOptions.fullDescription || item.name}`
            : item.name;

          return {
            id: item.productId || item.id,
            name: readableName,
            quantity: item.quantity,
            price: item.price,
            // 💡 Aseguramos que si hay complementos u opciones, viajen en 'details' o 'optionsSelected'
            ...(Object.keys(cleanOptions).length > 0 && { details: cleanOptions })
          };
        })
      }));

      const fullAddress = addresses.find(a => a.id === selectedAddressId)?.name +' '+ addresses.find(a => a.id === selectedAddressId)?.reference || selectedAddressId;

      const orderPayload = {
        email: userData?.email,
        orderData: {
          restaurants: formattedGroupedItems, 
          subtotal: subtotal,
          deliveryCost: totalDeliveryCost,
          total: total,
          deliveryAddress: fullAddress,
          paymentMethod: paymentMethod,
        },
        customerData: {
          name: userData?.name || "Cliente",
          phone: userData?.phoneNumber || "",
        },
        images: allImagesForS3 
      };

      const response = await orderService.createOrder(orderPayload);
      
      const newOrderLocal = {
        orderId: response.orderId,
        createdAt: new Date().toISOString(),
        orderStatus: paymentMethod === 'card' ? "pendiente_pago" : "inicio",
        orderData: orderPayload.orderData,
        customerData: orderPayload.customerData
      };
        
      const updatedOrders = userData?.orders ? [...userData.orders, newOrderLocal] : [newOrderLocal];
      updateUserData({ orders: updatedOrders });

      if (paymentMethod === 'card') {
        const wompiResponse = await fetch('https://mkc1x877vb.execute-api.us-east-2.amazonaws.com/orders-dev/pago-tarjeta', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            idOrden: userData?.email,
            monto: total.toFixed(2),
            descripcion: `Orden Al Vuelo - ${groupedItems.map(r => r.name).join(', ')}`
          })
        });

        const wompiData = await wompiResponse.json();
        if (wompiData.urlPago) {
          await WebBrowser.openBrowserAsync(wompiData.urlPago);
          Alert.alert(
            "Verificando Pago", 
            "Tu orden está registrada. Si el pago fue aprobado, la prepararemos en breve.",
            [{ text: "Aceptar", onPress: () => { clearCart(); navigation.replace('/(drawer)'); } }]
          );
        } else {
          throw new Error("No se pudo conectar con la pasarela de pagos.");
        }
      } else {
        Alert.alert(
          "¡Pedido Exitoso! 🍔", 
          `Tu orden ha sido registrada. ID: ${response.orderId || 'Generado'}`,
          [{ text: "Aceptar", onPress: () => { clearCart(); navigation.replace('/(drawer)'); } }]
        );
      }

    } catch (error: any) {
      Alert.alert("Error en el pedido", error.message || "No pudimos procesar tu orden. Intenta de nuevo.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Finalizar Pedido' }} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <Text style={styles.sectionTitle}>Resumen de la Compra</Text>
        
        {groupedItems.map(group => (
          <View key={group.id} style={styles.establishmentCard}>
            <View style={styles.groupHeader}>
              <Text style={styles.sectionTitleCard}>{group.name}</Text>
              <Text style={styles.deliveryCostText}>Envío: ${group.deliveryCost.toFixed(2)}</Text>
            </View>

            {group.items.map((item: any) => {
              const options = item.optionsSelected || {};
              const isCustomFavor = Boolean(options.isCustomFavor);
              const attachedImages = options.images || [];
              const primaryImage = item.imageUri || (attachedImages.length > 0 ? attachedImages[0].uri : null);
              
              // Opciones normales (ej. complementos de comedores)
              const normalOptions = Object.entries(options).filter(([key]) => key !== 'isCustomFavor' && key !== 'images');

              return (
                <View key={item.id} style={styles.itemContainer}>
                  <View style={styles.itemRow}>
                    <View style={styles.itemImageContainer}>
                      {primaryImage ? (
                        <Image source={{ uri: primaryImage }} style={styles.itemThumbnail} />
                      ) : (
                        <View style={styles.placeholderThumbnail}>
                          <Ionicons name={isCustomFavor ? "bicycle-outline" : "fast-food-outline"} size={16} color={Colors.primary} />
                        </View>
                      )}
                    </View>

                    <Text style={styles.itemQuantity}>{item.quantity}x</Text>
                    
                    <View style={styles.itemNameContainer}>
                      <Text style={styles.itemName}>{item.name}</Text>
                    </View>

                    <Text style={styles.itemPrice}>${(item.quantity * item.price).toFixed(2)}</Text>
                  </View>

                  {/* 💡 Mostrar complementos de comida si existen */}
                  {!isCustomFavor && normalOptions.length > 0 && (
                    <View style={styles.optionsDetails}>
                      {normalOptions.map(([key, val]) => (
                        <Text key={key} style={styles.optionText}>• {key}: {String(val)}</Text>
                      ))}
                    </View>
                  )}

                  {/* Detalles para mandaditos */}
                  {isCustomFavor && (
                    <View style={styles.customFavorDetails}>
                      {options.pickupLocation && (
                        <View style={styles.detailRow}>
                          <Ionicons name="location-outline" size={12} color={Colors.primary} style={styles.detailIcon} />
                          <Text style={styles.detailLabel}>Recolectar: </Text>
                          <Text style={styles.detailVal}>{options.pickupLocation}</Text>
                        </View>
                      )}

                      {options.referencePrice ? (
                        <View style={styles.detailRow}>
                          <Ionicons name="cash-outline" size={12} color={Colors.primary} style={styles.detailIcon} />
                          <Text style={styles.detailLabel}>Estimado: </Text>
                          <Text style={styles.detailVal}>${Number(options.referencePrice).toFixed(2)}</Text>
                        </View>
                      ) : null}

                      {attachedImages.length > 0 && (
                        <View style={styles.imagesPreviewContainer}>
                          <Text style={styles.imagesPreviewTitle}>Fotos adjuntas:</Text>
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
                  )}
                </View>
              );
            })}

            <Text style={styles.groupSubtotal}>Subtotal: ${group.subtotal.toFixed(2)}</Text>
          </View>
        ))}

        <View style={styles.summaryBox}>
          <View style={styles.costRow}><Text style={styles.costLabel}>Subtotal de Productos</Text><Text style={styles.costValue}>${subtotal.toFixed(2)}</Text></View>
          <View style={styles.costRow}><Text style={styles.costLabel}>Costo Total de Envío</Text><Text style={styles.costValue}>${totalDeliveryCost.toFixed(2)}</Text></View>
          <View style={styles.divider} />
          <View style={styles.costRow}><Text style={styles.totalLabel}>Total a Pagar</Text><Text style={styles.totalValue}>${total.toFixed(2)}</Text></View>
        </View>

        <Text style={styles.sectionTitle}>Dirección de Entrega</Text>
        {loadingAddresses ? (
          <ActivityIndicator size="large" color={Colors.primary} style={{ marginVertical: 20 }} />
        ) : (
          addresses.map((addr) => (
            <TouchableOpacity 
              key={addr.id} 
              style={[styles.addressCard, selectedAddressId === addr.id && styles.selectedCard]}
              onPress={() => setSelectedAddressId(addr.id)}
            >
              <Ionicons name={selectedAddressId === addr.id ? "radio-button-on" : "radio-button-off"} size={24} color={selectedAddressId === addr.id ? Colors.primary : Colors.lightText} />
              <View style={styles.addressInfo}>
                <Text style={styles.addressTitle}>{addr.name}</Text>
                <Text style={styles.addressDetails}>{addr.reference}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}

        <Text style={styles.sectionTitle}>Método de Pago</Text>
        <View style={styles.paymentContainer}>
          <TouchableOpacity 
            style={[styles.paymentBtn, paymentMethod === 'cash' && styles.paymentBtnActive]}
            onPress={() => setPaymentMethod('cash')}
          >
            <Ionicons name="cash-outline" size={24} color={paymentMethod === 'cash' ? '#fff' : Colors.text} />
            <Text style={[styles.paymentBtnText, paymentMethod === 'cash' && { color: '#fff' }]}>Efectivo</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.paymentBtn, paymentMethod === 'card' && styles.paymentBtnActive]}
            onPress={() => setPaymentMethod('card')}
          >
            <Ionicons name="card-outline" size={24} color={paymentMethod === 'card' ? '#fff' : Colors.text} />
            <Text style={[styles.paymentBtnText, paymentMethod === 'card' && { color: '#fff' }]}>Tarjeta Segura</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity 
          style={[styles.confirmButton, isProcessing && { backgroundColor: '#ccc' }]} 
          onPress={handlePlaceOrder}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.confirmButtonText}>
              {paymentMethod === 'card' ? `Proceder al Pago: $${total.toFixed(2)}` : `Confirmar Pedido: $${total.toFixed(2)}`}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  scrollContent: { padding: Sizes.padding, paddingBottom: 140 },
  sectionTitle: { fontSize: Sizes.subtitle, fontWeight: 'bold', color: Colors.text, marginTop: Sizes.padding, marginBottom: Sizes.smallPadding },
  
  establishmentCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#EFEFEF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 2,
  },
  groupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 6,
  },
  sectionTitleCard: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  deliveryCostText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.error,
  },
  itemContainer: {
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    padding: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemImageContainer: {
    width: 36,
    height: 36,
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
  itemQuantity: {
    fontWeight: 'bold',
    marginRight: 8,
    color: Colors.primary,
    fontSize: 14,
  },
  itemNameContainer: {
    flex: 1,
    marginRight: 8,
  },
  itemName: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  itemPrice: {
    fontWeight: '600',
    color: Colors.text,
    fontSize: 14,
  },
  groupSubtotal: {
    fontSize: 13,
    textAlign: 'right',
    color: Colors.text,
    marginTop: 6,
    fontWeight: '700',
  },
  optionsDetails: {
    marginTop: 4,
    paddingLeft: 44,
  },
  optionText: {
    fontSize: 12,
    color: Colors.lightText,
  },
  customFavorDetails: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
    gap: 3,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    marginRight: 4,
  },
  detailLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.text,
  },
  detailVal: {
    fontSize: 11,
    color: Colors.lightText,
    flex: 1,
  },
  imagesPreviewContainer: {
    marginTop: 4,
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
    width: 44,
    height: 44,
    borderRadius: 6,
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
  summaryBox: { backgroundColor: '#fff', padding: Sizes.padding, borderRadius: Sizes.radius, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, marginTop: 10 },
  costRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  costLabel: { fontSize: Sizes.font, color: Colors.lightText },
  costValue: { fontSize: Sizes.font, fontWeight: '600', color: Colors.text },
  divider: { height: 1, backgroundColor: '#E0E0E0', marginVertical: Sizes.smallPadding },
  totalLabel: { fontSize: Sizes.title, fontWeight: 'bold', color: Colors.text },
  totalValue: { fontSize: Sizes.title, fontWeight: 'bold', color: Colors.primary },
  addressCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: Sizes.radius, marginBottom: 10, borderWidth: 1, borderColor: '#E0E0E0' },
  selectedCard: { borderColor: Colors.primary, backgroundColor: '#FFF5F5' },
  addressInfo: { marginLeft: 15, flex: 1 },
  addressTitle: { fontWeight: 'bold', fontSize: 16, color: Colors.text },
  addressDetails: { color: Colors.lightText, marginTop: 4 },
  paymentContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  paymentBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', padding: 15, borderRadius: Sizes.radius, borderWidth: 1, borderColor: '#E0E0E0', marginHorizontal: 5 },
  paymentBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  paymentBtnText: { marginLeft: 8, fontWeight: 'bold', color: Colors.text },
  footer: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    backgroundColor: '#fff', 
    paddingHorizontal: Sizes.padding,
    paddingTop: 12,
    borderTopWidth: 1, 
    borderTopColor: '#E0E0E0', 
    elevation: 10 
  },
  confirmButton: { 
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  confirmButtonText: { color: '#ffffff', fontSize: Sizes.font, fontWeight: 'bold', textAlign: 'center' },
});

export default CheckoutScreen;