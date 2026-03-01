// app/adresses/index.tsx

import colors from '@/constants/colors';
import Sizes from '@/constants/Sizes';
import { useAuth } from '@/context/authContext';
import { UserService } from '@/services/user.service';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
// --- Datos de Simulación ---
interface Address {
    id: string;
    name: string;
    fullAddress: string;
    reference: string;
    latitude: number;
    longitude: number;
    label: string;
    coords: {
        latitude: number;
        longitude: number;
    };
}
// ----------------------------

// 💡 Componente de Elemento de Dirección
const AddressItem: React.FC<{ address: Address, onEdit: (id: string) => void, onDelete: (id: string) => void }> = ({ address, onEdit, onDelete }) => {
    const [isMapVisible, setIsMapVisible] = useState(false);

    // Región para el mapa de previsualización
    const mapRegion: Region = {
       latitude: address?.latitude || 0,
        longitude: address?.longitude || 0,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
    };
    const coords = {
        latitude: address?.latitude || 0,
        longitude: address?.longitude || 0,
    };

    return (
        <View style={styles.itemWrapper}>
            {/* Cabecera del Item con Título y Botón Desplegable */}
            <TouchableOpacity 
                style={styles.itemHeader}
                onPress={() => setIsMapVisible(!isMapVisible)}
            >
                <View style={styles.labelContainer}>
                    <Ionicons name="location-sharp" size={20} color={colors.primary} />
                    <Text style={styles.label}>{address.name}</Text>
                </View>
                <Ionicons 
                    name={isMapVisible ? 'chevron-up' : 'chevron-down'} 
                    size={24} 
                    color={colors.lightText} 
                />
            </TouchableOpacity>

            {/* Contenido Desplegable (Mapa y Acciones) */}
            {isMapVisible && (
                <View style={styles.itemContent}>
                    <Text style={styles.addressText}>{address.fullAddress}</Text>
                    <Text style={styles.referenceText}>Ref: {address.reference}</Text>

                    {/* Mapa de Previsualización */}
                    <MapView
                        style={styles.previewMap}
                        initialRegion={mapRegion}
                        pitchEnabled={false} // Deshabilitar interacción
                        rotateEnabled={false}
                        scrollEnabled={false}
                        zoomEnabled={false}
                    >
                        <Marker coordinate={coords} pinColor={colors.primary} />
                    </MapView>

                    {/* Botones de Acción */}
                    <View style={styles.actionsContainer}>
                        <TouchableOpacity style={styles.actionButton} onPress={() => onEdit(address.id)}>
                            <Ionicons name="pencil" size={20} color={colors.secondary} />
                            <Text style={styles.actionText}>Editar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton} onPress={() => onDelete(address.id)}>
                            <Ionicons name="trash" size={20} color={colors.error} />
                            <Text style={[styles.actionText, { color: colors.error }]}>Eliminar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
};

// ----------------------------------------------------------------------

const AdressesScreen = () => {
  const { userData } = useAuth();
    const router = useRouter();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);

 // Dentro de AddressesScreen
const loadUserAddresses = async () => {
    try {
        setLoading(true);
        const email = userData?.email || '';
        const data = await UserService.getProfile(email);
        setAddresses(data.addressData || []);
    } catch (error: any) {
        Alert.alert("Error", error.message);
    } finally {
        setLoading(false);
    }
};

    useFocusEffect(
        useCallback(() => {
            loadUserAddresses();
        }, [userData])
    );

const handleEdit = (address: Address) => {
  router.push({
    pathname: "/addresses/map",
    params: {
      id: address.id,
      label: address.label,
      fullAddress: address.fullAddress,
      reference: address.reference,
      latitude: address.coords.latitude.toString(),
      longitude: address.coords.longitude.toString(),
      isEditing: "true" // Bandera para saber que no es una creación nueva
    }
  });
};
const handleDelete = async (id: string) => {
    const email = userData?.email || '';
    
    console.log("Intentando borrar ID:", id);
    console.log("IDs actuales en la lista:", addresses.map(a => a.id));

    // El filtro
    const updatedList = addresses.filter(a => String(a.id) !== String(id));

    // Si tenías 2 y ahora tienes 0, es que los IDs están duplicados
    if (addresses.length > 1 && updatedList.length === 0) {
        Alert.alert(
            "Error de Datos", 
            "No se puede borrar porque las direcciones tienen IDs duplicados. Por favor, actualiza la lista o recrea las direcciones."
        );
        return;
    }

    try {
        setLoading(true);
        await UserService.deleteAddress(email, updatedList);
        setAddresses(updatedList);
    } catch (error) {
        Alert.alert("Error", "No se pudo actualizar en el servidor");
    } finally {
        setLoading(false);
    }
};
    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color="#00D1B2" />
            </View>
        );
    }


    return (
        <View style={styles.container}>
           
            
            {/* 1. Lista de Direcciones */}
            <FlatList
                data={addresses}
                keyExtractor={(item, index) => item.id?.toString() || index.toString()}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <AddressItem 
                        address={item} 
                        onEdit={(id) => router.push(`/addresses/map?id=${id}`)} 
                        onDelete={(id) => handleDelete(id)} 
                    />
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>Aún no tienes direcciones guardadas. ¡Agrega una!</Text>}
            />

            {/* Si decides usar un botón flotante en lugar del headerRight: */}
            {/* <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
                <Ionicons name="add" size={30} color={colors.white} />
            </TouchableOpacity> */}

        </View>
    );
};

export default AdressesScreen;

// ----------------------------------------------------------------------

const styles = StyleSheet.create({
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyContainer: { alignItems: 'center', marginTop: 50 },
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    listContent: {
        padding: Sizes.padding,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: Sizes.largePadding,
        color: colors.lightText,
        fontSize: Sizes.font,
    },
    
    // --- Estilos de Item de Dirección ---
    itemWrapper: {
        backgroundColor: colors.white,
        borderRadius: Sizes.radius,
        marginBottom: Sizes.padding,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
        elevation: 2,
    },
    itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: Sizes.padding,
    },
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    label: {
        fontSize: Sizes.title,
        fontWeight: 'bold',
        marginLeft: Sizes.smallPadding,
        color: colors.text,
    },
    itemContent: {
        paddingHorizontal: Sizes.padding,
        paddingBottom: Sizes.padding,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        marginTop: Sizes.smallPadding,
    },
    addressText: {
        fontSize: Sizes.font,
        color: colors.text,
        marginBottom: Sizes.smallPadding / 2,
    },
    referenceText: {
        fontSize: Sizes.subtitle,
        color: colors.lightText,
        marginBottom: Sizes.padding,
    },
    previewMap: {
        width: '100%',
        height: 120,
        borderRadius: Sizes.radius,
        marginBottom: Sizes.padding,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: Sizes.smallPadding,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Sizes.smallPadding / 2,
    },
    actionText: {
        fontSize: Sizes.font,
        marginLeft: 6,
        fontWeight: 'bold',
        color: colors.secondary,
    },
    // Estilos para el botón flotante (opcional, si no usas headerRight)
    // addButton: {
    //     position: 'absolute',
    //     bottom: Sizes.largePadding,
    //     right: Sizes.largePadding,
    //     backgroundColor: colors.primary,
    //     borderRadius: 30,
    //     width: 60,
    //     height: 60,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     elevation: 5,
    // },
});