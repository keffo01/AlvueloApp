// app/checkout/index.tsx

import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { orderService } from '@/services/order.service';
import { UserService } from '@/services/user.service';
import Colors from '../../constants/colors';
import Sizes from '../../constants/Sizes';
import { useAuth } from '../../context/authContext'; // 💡 Asegura esta ruta
import { useCart } from '../../context/CartContext';

const MOCK_DELIVERY_COST = 1.50; 

const CheckoutScreen: React.FC = () => {
  // 1. Extraemos cartItems además de subtotal
  const { cart, subtotal, clearCart } = useCart();
  const { userData, updateUserData } = useAuth();
  const navigation = useRouter();
  
  // --- ESTADOS ---
  // Direcciones
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Pagos
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | null>(null);
  const [cardDetails, setCardDetails] = useState({ number: '', name: '', expiry: '', cvv: '' });

  // Calcular el total final
  const total = useMemo(() => subtotal + MOCK_DELIVERY_COST, [subtotal]);

  // --- OBTENER DIRECCIONES ---
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

  // --- MANEJADOR DE ORDEN ---
 // 2. Reemplaza tu handlePlaceOrder actual con este:
// 2. Reemplaza tu handlePlaceOrder actual con este:
const handlePlaceOrder = async () => {
  // Validaciones iniciales
  if (!selectedAddressId) return Alert.alert("Faltan datos", "Por favor, selecciona una dirección de entrega.");
  if (!paymentMethod) return Alert.alert("Faltan datos", "Por favor, selecciona un método de pago.");
  
  if (paymentMethod === 'card') {
    if (!cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvv) {
      return Alert.alert("Datos incompletos", "Por favor, llena todos los datos de la tarjeta.");
    }
  }

  try {
    setIsProcessing(true); // Bloqueamos el botón

    // 💡 NUEVO: Agrupamos los items por su respectivo restaurante
    const groupedItems = cart.reduce((acc: any, item: any) => {
      const estId = item.establishment?.id || "N/A";
      const estName = item.establishment?.name || "Comercio Desconocido";

      // Si el restaurante aún no existe en nuestro acumulador, lo creamos
      if (!acc[estId]) {
        acc[estId] = {
          restaurantId: estId,
          restaurantName: estName,
          items: []
        };
      }

      // Agregamos el platillo al restaurante correspondiente
      acc[estId].items.push({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      });

      return acc;
    }, {});

    // Convertimos el objeto agrupado en un arreglo limpio
    const groupedRestaurants = Object.values(groupedItems);

    // Buscamos el texto exacto de la dirección seleccionada
    const fullAddress = addresses.find(a => a.id === selectedAddressId)?.name +' '+ addresses.find(a => a.id === selectedAddressId)?.reference || selectedAddressId;

    // 📦 ARMAMOS EL PAQUETE (Estructura actualizada)
    const orderPayload = {
      email: userData?.email,
      orderData: {
        // En lugar de una lista plana, enviamos la lista agrupada Comercio -> Items
        restaurants: groupedRestaurants, 
        subtotal: subtotal,
        deliveryCost: MOCK_DELIVERY_COST,
        total: total,
        deliveryAddress: fullAddress,
        paymentMethod: paymentMethod,
      },
      customerData: {
        name: userData?.name || "Cliente",
        phone: userData?.phoneNumber || "",
      },
      // Guardamos un arreglo con todos los comercios involucrados en la orden
      restaurantData: groupedRestaurants.map((g: any) => ({
        id: g.restaurantId,
        name: g.restaurantName
      }))
    };

    // 🚀 ENVIAMOS A API GATEWAY
    const response = await orderService.createOrder(orderPayload);
    
    const newOrderLocal = {
        orderId: response.orderId,
        createdAt: new Date().toISOString(),
        orderStatus: "inicio",
        orderData: orderPayload.orderData,
        restaurantData: orderPayload.restaurantData,
        customerData: orderPayload.customerData
      };
      
    const updatedOrders = userData?.orders ? [...userData.orders, newOrderLocal] : [newOrderLocal];
      
    updateUserData({ orders: updatedOrders });

    // Si todo sale bien...
    Alert.alert(
      "¡Pedido Exitoso! 🍔", 
      `Tu orden ha sido registrada. ID: ${response.orderId || 'Generado'}`,
      [
        {
          text: "Aceptar",
          onPress: () => {
            clearCart(); 
            navigation.replace('/(drawer)'); 
          },
        },
      ]
    );

  } catch (error: any) {
    Alert.alert("Error en el pedido", error.message || "No pudimos procesar tu orden. Intenta de nuevo.");
  } finally {
    setIsProcessing(false); // Desbloqueamos el botón
  }
};

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Finalizar Pedido' }} />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 1. RESUMEN DE PRODUCTOS */}
        <Text style={styles.sectionTitle}>Resumen de la Compra</Text>
        <View style={styles.summaryBox}>
          {cart?.map((item: any, index: number) => (
            <View key={index} style={styles.productRow}>
              <View style={styles.productInfo}>
                <Text style={styles.productQty}>{item.quantity}x</Text>
                <Text style={styles.productName}>{item.name}</Text>
              </View>
              <Text style={styles.productPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
          <View style={styles.divider} />
          
          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Subtotal</Text>
            <Text style={styles.costValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.costRow}>
            <Text style={styles.costLabel}>Costo de Envío</Text>
            <Text style={styles.costValue}>${MOCK_DELIVERY_COST.toFixed(2)}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.costRow}>
            <Text style={styles.totalLabel}>Total a Pagar</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>

        {/* 2. SELECTOR DE DIRECCIÓN */}
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
              <Ionicons 
                name={selectedAddressId === addr.id ? "radio-button-on" : "radio-button-off"} 
                size={24} 
                color={selectedAddressId === addr.id ? Colors.primary : Colors.lightText} 
              />
              <View style={styles.addressInfo}>
                <Text style={styles.addressTitle}>{addr.name}</Text>
                <Text style={styles.addressDetails}>{addr.reference}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}

        {/* 3. SELECTOR DE PAGO */}
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
            <Text style={[styles.paymentBtnText, paymentMethod === 'card' && { color: '#fff' }]}>Tarjeta</Text>
          </TouchableOpacity>
        </View>

        {/* FORMULARIO DE TARJETA (Solo visible si selecciona Tarjeta) */}
        {paymentMethod === 'card' && (
          <View style={styles.cardForm}>
            <TextInput 
              style={styles.input} 
              placeholder="Número de Tarjeta" 
              keyboardType="numeric" 
              maxLength={16}
              value={cardDetails.number}
              onChangeText={(t) => setCardDetails({...cardDetails, number: t})}
            />
            <TextInput 
              style={styles.input} 
              placeholder="Nombre en la Tarjeta" 
              value={cardDetails.name}
              onChangeText={(t) => setCardDetails({...cardDetails, name: t})}
            />
            <View style={styles.row}>
              <TextInput 
                style={[styles.input, { flex: 1, marginRight: 10 }]} 
                placeholder="MM/AA" 
                maxLength={5}
                value={cardDetails.expiry}
                onChangeText={(t) => setCardDetails({...cardDetails, expiry: t})}
              />
              <TextInput 
                style={[styles.input, { flex: 1 }]} 
                placeholder="CVV" 
                keyboardType="numeric" 
                maxLength={4}
                secureTextEntry
                value={cardDetails.cvv}
                onChangeText={(t) => setCardDetails({...cardDetails, cvv: t})}
              />
            </View>
          </View>
        )}
        
      </ScrollView>
      
    {/* Botón Flotante */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.confirmButton, isProcessing && { backgroundColor: '#ccc' }]} 
          onPress={handlePlaceOrder}
          disabled={isProcessing} // Deshabilita el botón si está cargando
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.confirmButtonText}>Confirmar Pedido: ${total.toFixed(2)}</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

// --- ESTILOS ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  scrollContent: { padding: Sizes.padding, paddingBottom: 120 },
  sectionTitle: { fontSize: Sizes.subtitle, fontWeight: 'bold', color: Colors.text, marginTop: Sizes.padding, marginBottom: Sizes.smallPadding },
  
  // Resumen
  summaryBox: { backgroundColor: '#fff', padding: Sizes.padding, borderRadius: Sizes.radius, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  productRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  productInfo: { flexDirection: 'row', flex: 1 },
  productQty: { fontWeight: 'bold', marginRight: 8, color: Colors.primary },
  productName: { color: Colors.text, flex: 1 },
  productPrice: { fontWeight: '600', color: Colors.text },
  costRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  costLabel: { fontSize: Sizes.font, color: Colors.lightText },
  costValue: { fontSize: Sizes.font, fontWeight: '600', color: Colors.text },
  divider: { height: 1, backgroundColor: '#E0E0E0', marginVertical: Sizes.smallPadding },
  totalLabel: { fontSize: Sizes.title, fontWeight: 'bold', color: Colors.text },
  totalValue: { fontSize: Sizes.title, fontWeight: 'bold', color: Colors.primary },

  // Direcciones
  addressCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: Sizes.radius, marginBottom: 10, borderWidth: 1, borderColor: '#E0E0E0' },
  selectedCard: { borderColor: Colors.primary, backgroundColor: '#FFF5F5' }, // Ajusta el color de fondo según tu primary
  addressInfo: { marginLeft: 15, flex: 1 },
  addressTitle: { fontWeight: 'bold', fontSize: 16, color: Colors.text },
  addressDetails: { color: Colors.lightText, marginTop: 4 },

  // Pagos
  paymentContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  paymentBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', padding: 15, borderRadius: Sizes.radius, borderWidth: 1, borderColor: '#E0E0E0', marginHorizontal: 5 },
  paymentBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  paymentBtnText: { marginLeft: 8, fontWeight: 'bold', color: Colors.text },
  
  // Formulario Tarjeta
  cardForm: { backgroundColor: '#fff', padding: 15, borderRadius: Sizes.radius, marginTop: 5 },
  input: { backgroundColor: '#F0F0F0', padding: 12, borderRadius: 8, marginBottom: 10, fontSize: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },

  // Footer
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', padding: Sizes.padding, borderTopWidth: 1, borderTopColor: '#E0E0E0', elevation: 10 },
  confirmButton: { backgroundColor: Colors.primary, borderRadius: Sizes.radius, padding: Sizes.padding, alignItems: 'center' },
  confirmButtonText: { color: '#ffffff', fontSize: Sizes.font, fontWeight: 'bold' },
});

export default CheckoutScreen;