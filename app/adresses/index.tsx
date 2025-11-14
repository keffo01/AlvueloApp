// app/adresses/index.tsx

import colors from '@/constants/colors';
import Sizes from '@/constants/Sizes';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
// --- Datos de Simulación ---
interface Address {
    id: string;
    label: string;
    fullAddress: string;
    reference: string;
    coords: {
        latitude: number;
        longitude: number;
    };
}

// Datos de ejemplo con coordenadas reales para el mapa
const MOCK_ADDRESSES: Address[] = [
    {
        id: '1',
        label: 'Casa',
        fullAddress: 'Avenida La Palma, Colonia San Benito, San Salvador',
        reference: 'Frente a la embajada.',
        coords: { latitude: 13.7011, longitude: -89.2223 },
    },
    {
        id: '2',
        label: 'Oficina',
        fullAddress: 'Calle El Mirador, Edificio World Trade Center',
        reference: 'Piso 15, recepción.',
        coords: { latitude: 13.6925, longitude: -89.2435 },
    },
];
// ----------------------------

// 💡 Componente de Elemento de Dirección
const AddressItem: React.FC<{ address: Address, onEdit: (id: string) => void, onDelete: (id: string) => void }> = ({ address, onEdit, onDelete }) => {
    const [isMapVisible, setIsMapVisible] = useState(false);

    // Región para el mapa de previsualización
    const mapRegion: Region = {
        latitude: address.coords.latitude,
        longitude: address.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
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
                    <Text style={styles.label}>{address.label}</Text>
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
                        <Marker coordinate={address.coords} pinColor={colors.primary} />
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
    // 💡 Inicializar el router dentro del componente
    const router = useRouter(); 
    const [addresses, setAddresses] = useState<Address[]>(MOCK_ADDRESSES);

    // Lógica para ir a la pantalla de mapa para agregar una nueva dirección
    const handleAddNew = () => {
        // 💡 Ajusta esta ruta a tu componente de mapa (ej: /profile/addresses/map)
        router.push('/adresses/map'); 
    };

    // Lógica para ir a la pantalla de mapa para editar una dirección existente
    const handleEdit = (id: string) => {
        const addressToEdit = addresses.find(a => a.id === id);
        if (addressToEdit) {
            // 💡 Puedes pasar el ID o la data a la ruta del mapa para precargar
            router.push(`/profile/addresses/create?id=${id}`); 
        }
    };

    // Lógica de eliminación
    const handleDelete = (id: string) => {
        Alert.alert(
            'Confirmar Eliminación',
            '¿Estás seguro de que quieres eliminar esta dirección?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { 
                    text: 'Eliminar', 
                    style: 'destructive', 
                    onPress: () => {
                        setAddresses(prev => prev.filter(a => a.id !== id));
                    }
                },
            ]
        );
    };


    return (
        <View style={styles.container}>
            <Stack.Screen
                options={{
                    title: 'Mis Direcciones',
                    headerStyle: { backgroundColor: colors.white },
                    headerShadowVisible: true,
                    // 💡 FUNCIÓN DE REGRESO USANDO router.back()
                    headerLeft: () => (
                        <TouchableOpacity onPress={() => router.replace('/Profile')} style={{ marginLeft: Sizes.smallPadding / 2 }}>
                            <Ionicons name="arrow-back" size={24} color={colors.text} />
                        </TouchableOpacity>
                    ),
                    // 💡 BOTÓN DE AGREGAR EN EL HEADER DERECHO
                    headerRight: () => (
                        <TouchableOpacity onPress={handleAddNew} style={{ marginRight: Sizes.smallPadding / 2 }}>
                            <Ionicons name="add-circle" size={30} color={colors.primary} />
                        </TouchableOpacity>
                    ),
                }}
            />
            
            {/* 1. Lista de Direcciones */}
            <FlatList
                data={addresses}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => (
                    <AddressItem 
                        address={item} 
                        onEdit={handleEdit} 
                        onDelete={handleDelete} 
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