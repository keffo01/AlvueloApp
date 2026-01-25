// app/(drawer)/profile/addresses/index.tsx

import Ionicons from '@expo/vector-icons/Ionicons'; // 💡 NUEVO
import * as Location from 'expo-location';
import { router, Stack } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react'; // 💡 Añadir useRef
import { ActivityIndicator, Alert, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { LatLng, Marker, Region } from 'react-native-maps';
import Colors from '../../constants/colors';
import Sizes from '../../constants/Sizes';

// Importa el componente (manteniendo tu ruta, aunque 'compoents' puede ser un typo)
import { useAuth } from '@/context/authContext';
import { UserService } from '@/services/user.service';
import AddressForm from '../../components/profile/adressForm';

// Definiciones de tipos (Se asume que están correctas)
interface SelectedLocation {
  latitude: number;
  longitude: number;
}
interface AddressDataForForm extends SelectedLocation {
  fullAddressLine: string;
  city: string;
}

// Ubicación de Fallback (Ejemplo: San Salvador, El Salvador)
const FALLBACK_LOCATION: Region = {
    latitude: 13.6929, 
    longitude: -89.2182,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
};


const AddressesScreen: React.FC = () => {
  const [initialRegion, setInitialRegion] = useState<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { userToken, isNewUser, completeOnboarding } = useAuth(); // 👈 Obtenemos el estado global

  // Estado para el formulario
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [addressDataForForm, setAddressDataForForm] = useState<AddressDataForForm | null>(null);

  // 💡 REFERENCIA DEL MAPA
  const mapRef = useRef<MapView>(null); 

  // 1. Obtener la ubicación actual del usuario y permisos (ROBUSTO)
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      
      let location;
      if (status !== 'granted') {
        Alert.alert(
          'Permiso de ubicación denegado',
          'El mapa se cargará en una ubicación predeterminada.',
        );
        // Fallback si no hay permisos
        location = { coords: FALLBACK_LOCATION };
      } else {
        try {
            // Intentar obtener la ubicación real (con try/catch para fallas de GPS/emulador)
            location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        } catch (error) {
             console.warn("Error al obtener ubicación real, usando fallback:", error);
             location = { coords: FALLBACK_LOCATION };
        }
      }

      const region = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };

      setInitialRegion(region);
      setSelectedLocation({
        latitude: region.latitude,
        longitude: region.longitude,
      });
      setIsLoading(false);
    })();
  }, []);

  // 2. Manejar la selección en el mapa
  const handleMapPress = (event: any) => {
    const coords: LatLng = event.nativeEvent.coordinate;
    setSelectedLocation({
      latitude: coords.latitude,
      longitude: coords.longitude,
    });
  };

  // 3. Función de Recentrado
  const handleRecenterMap = () => {
    if (mapRef.current && initialRegion) {
        // Usa la región inicial (la ubicación del dispositivo al cargar)
        mapRef.current.animateToRegion(initialRegion, 500); 
    }
  };

  // 4. Geocodificación Inversa y Apertura del Formulario (sin cambios)
  const handleConfirmLocation = async () => {
    if (!selectedLocation) return;
    
    setIsLoading(true);
    try {
      const geocodedAddress = await Location.reverseGeocodeAsync(selectedLocation);

      if (!geocodedAddress || geocodedAddress.length === 0) {
        Alert.alert('Error', 'No se encontró una dirección para esta ubicación.');
        return;
      }

      const firstAddress = geocodedAddress[0];
      
      // Construir la dirección legible
      const fullAddressLine = `${firstAddress.street || 'Dirección sin nombre'}, ${firstAddress.name || firstAddress.district || ''}`;
      const city = firstAddress.city || firstAddress.subregion || 'Ciudad Desconocida';

      const data: AddressDataForForm = {
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        fullAddressLine: fullAddressLine,
        city: city,
      };
      
      // Mostrar el formulario con los datos cargados
      setAddressDataForForm(data);
      setIsFormVisible(true); 

    } catch (error) {
      console.error('Error al obtener la dirección legible:', error);
      Alert.alert('Error', 'No se pudo obtener la dirección legible. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Funciones para manejar el ciclo de vida del formulario (sin cambios)
  const handleCancelForm = () => {
    setIsFormVisible(false);
    setAddressDataForForm(null);
  };

 // 💡 ACTUALIZACIÓN: Función para guardar en DynamoDB
  const handleSaveFinalAddress = async (finalAddress: any) => {
    setIsLoading(true);
    const email = atob(userToken || ''); // Decodificar el email del token almacenado
    try {
      // 1. Llamada a tu API Gateway (Lambda de updateAddress)
      const response = await UserService.updateAddress(email, finalAddress, true);
      const responseData = await response;
      console.log("Respuesta de updateAddress:", JSON.stringify(responseData));
      if(responseData.statusCode == 400){return Alert.alert("Error", "por favor vuelve a intentarlo");}
      if(responseData.statusCode == 500){return Alert.alert("Network", "Error del servidor");}

      if (responseData.statusCode === 200) {
          // marcar onboarding como completo y enviar a Home
          await completeOnboarding(); 

          Alert.alert("¡Éxito!", "Tu dirección ha sido guardada correctamente."); 

          setIsFormVisible(false);
          router.push('/addresses');  
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      Alert.alert("Error", "Ocurrió un error de red.");
    } finally {
      setIsFormVisible(false);
      setIsLoading(false);
    }
  };

  if (isLoading || !initialRegion) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Cargando mapa y ubicación...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Mis Direcciones',
          headerStyle: { backgroundColor: Colors.white },
          headerShadowVisible: true,
        }}
      />

      {/* Mapa */}
      <MapView
        ref={mapRef} // 💡 Asignar la referencia
        style={styles.map}
        initialRegion={initialRegion}
        onPress={handleMapPress}
        provider="google"
      >
        {selectedLocation && (
          <Marker
            coordinate={selectedLocation}
            title="Mi Dirección"
            draggable
            onDragEnd={handleMapPress}
            pinColor={Colors.primary}
          />
        )}
      </MapView>

      {/* 💡 Botón de Recentrado Flotante */}
      <View style={styles.recenterButtonContainer}>
          <TouchableOpacity style={styles.recenterButton} onPress={handleRecenterMap}>
              <Ionicons name="locate" size={30} color={Colors.primary} />
          </TouchableOpacity>
      </View>


      {/* Botón de Confirmación Flotante */}
      {!isFormVisible && ( 
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirmLocation}>
            <Text style={styles.confirmButtonText}>Confirmar Ubicación</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal para el Formulario de Dirección */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isFormVisible}
        onRequestClose={handleCancelForm}
      >
        {/* 💡 CORRECCIÓN DE INTERACCIÓN: Fondo para cerrar */}
        <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={handleCancelForm}
        >
          {/* 💡 SOLUCIÓN DE TOQUES: Bloquea los toques dentro del formulario */}
          {addressDataForForm && (
            
            <View 
                style={styles.formWrapper} 
                onStartShouldSetResponder={() => true} 
            >
                <AddressForm
                    initialAddress={addressDataForForm}
                    onCancel={handleCancelForm}
                    onSave={handleSaveFinalAddress}
                />
            </View>
          )}
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

// ... Estilos (agregar nuevos estilos) ...

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: Sizes.padding,
    fontSize: Sizes.font,
    color: Colors.text,
  },
  map: {
    flex: 1,
    width: '100%',
  },
  
  // 💡 NUEVOS ESTILOS PARA EL BOTÓN DE RECENTRAJE
  recenterButtonContainer: {
      position: 'absolute',
      top: 100, // Ajustar para evitar la barra de estado y el header
      right: Sizes.padding,
      zIndex: 1, 
  },
  recenterButton: {
      backgroundColor: Colors.white,
      padding: Sizes.smallPadding,
      borderRadius: Sizes.radius,
      elevation: 3,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 3,
  },

  buttonContainer: {
    position: 'absolute',
    bottom: Sizes.largePadding,
    width: '100%',
    alignItems: 'center',
    zIndex: 1, 
  },
  confirmButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Sizes.padding,
    paddingHorizontal: Sizes.largePadding,
    borderRadius: Sizes.radius * 2,
    elevation: 5,
    shadowColor: Colors.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  confirmButtonText: {
    color: Colors.white,
    fontSize: Sizes.subtitle,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  // 💡 NUEVO ESTILO PARA EL WRAPPER DEL FORMULARIO
  formWrapper: {
      width: '100%',
  }
});

export default AddressesScreen;