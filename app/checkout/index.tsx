// app/checkout/index.tsx

import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

import Colors from '../../constants/colors';
import Sizes from '../../constants/Sizes';
import { useCart } from '../../context/CartContext';

// --- Mocks Temporales para la Lógica de Checkout ---
// El costo de envío debe venir del establecimiento. Usaremos un mock temporal.
const MOCK_DELIVERY_COST = 3.50; 
const MOCK_ADDRESS = "Av. Siempre Viva 742, Springfield";
const MOCK_PAYMENT_METHOD = "Tarjeta de Crédito (Visa ***1234)";


const CheckoutScreen: React.FC = () => {
  const { subtotal, clearCart } = useCart();
  const navigation = useRouter();
  
  // Estado para las selecciones del usuario (simulación)
  const [selectedAddress, setSelectedAddress] = useState(MOCK_ADDRESS);
  const [selectedPayment, setSelectedPayment] = useState(MOCK_PAYMENT_METHOD);

  // Calcular el total final
  const total = useMemo(() => {
    return subtotal + MOCK_DELIVERY_COST;
  }, [subtotal]);

  const handlePlaceOrder = () => {
    if (!selectedAddress || !selectedPayment) {
      Alert.alert("Faltan datos", "Por favor, selecciona una dirección y un método de pago.");
      return;
    }

    Alert.alert(
      "Pedido Enviado", 
      `Tu pedido de $${total.toFixed(2)} ha sido enviado a ${selectedAddress}.`,
      [
        {
          text: "Aceptar",
          onPress: () => {
            clearCart(); // Limpiar el carrito después de la compra
            navigation.replace('/(drawer)'); // Volver a la pantalla principal (Home)
          },
        },
      ]
    );
  };
  
  // Componente reutilizable para las filas de selección
  const SelectionRow = ({ label, value, onPress }: { label: string, value: string, onPress: () => void }) => (
    <TouchableOpacity style={styles.selectionRow} onPress={onPress}>
      <View>
        <Text style={styles.selectionLabel}>{label}</Text>
        <Text style={styles.selectionValue}>{value}</Text>
      </View>
      <Ionicons name="chevron-forward" size={Sizes.font} color={Colors.lightText} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Finalizar Pedido' }} />
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Sección de Selección de Dirección */}
        <Text style={styles.sectionTitle}>Dirección de Entrega</Text>
        <SelectionRow 
          label="Entregar en"
          value={selectedAddress}
          onPress={() => Alert.alert("Selección", "Abrirías el selector de direcciones aquí.")}
        />
        
        {/* Sección de Selección de Pago */}
        <Text style={styles.sectionTitle}>Método de Pago</Text>
        <SelectionRow 
          label="Pagar con"
          value={selectedPayment}
          onPress={() => Alert.alert("Selección", "Abrirías el selector de métodos de pago aquí.")}
        />

        {/* Resumen de Costos */}
        <Text style={styles.sectionTitle}>Resumen de la Compra</Text>
        <View style={styles.summaryBox}>
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
      </ScrollView>
      
      {/* Botón Flotante de Confirmación */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.confirmButton} 
          onPress={handlePlaceOrder}
        >
          <Text style={styles.confirmButtonText}>Confirmar Pedido: ${total.toFixed(2)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ... (Estilos) ...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Sizes.padding,
    paddingBottom: 120, // Espacio para el footer
  },
  sectionTitle: {
    fontSize: Sizes.subtitle,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: Sizes.padding,
    marginBottom: Sizes.smallPadding,
  },
  selectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: Sizes.padding,
    borderRadius: Sizes.radius,
    marginBottom: Sizes.smallPadding,
    borderWidth: 1,
    borderColor: Colors.background,
  },
  selectionLabel: {
    fontSize: Sizes.smallPadding,
    color: Colors.lightText,
  },
  selectionValue: {
    fontSize: Sizes.font,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 2,
  },
  summaryBox: {
    backgroundColor: Colors.background,
    padding: Sizes.padding,
    borderRadius: Sizes.radius,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Sizes.smallPadding / 2,
  },
  costLabel: {
    fontSize: Sizes.font,
    color: Colors.text,
  },
  costValue: {
    fontSize: Sizes.font,
    fontWeight: '600',
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.background,
    marginVertical: Sizes.smallPadding,
  },
  totalLabel: {
    fontSize: Sizes.title,
    fontWeight: 'bold',
    color: Colors.text,
  },
  totalValue: {
    fontSize: Sizes.title,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.background,
    padding: Sizes.padding,
    borderTopWidth: 1,
    borderTopColor: Colors.primary,
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    borderRadius: Sizes.radius,
    padding: Sizes.padding,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: Sizes.font,
    fontWeight: 'bold',
  },
});

export default CheckoutScreen;