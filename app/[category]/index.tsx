// app/[category]/index.tsx

import { Stack, useLocalSearchParams } from 'expo-router'; // 💡 useLocalSearchParams para obtener el ID de la ruta
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import Sizes from '../../constants/Sizes';

// Importar datos y componentes
import EstablishmentCard from '@/compoents/HomeScreen/EstablishmentCard';
import colors from '@/constants/colors';
import { Establishment } from '@/models/commons.model';
import { MOCK_ALL_ESTABLISHMENTS } from '../../constants/mockData';

const EstablishmentListScreen: React.FC = () => {
  // Obtener los parámetros de la URL. 'category' es el nombre de la carpeta [category]
  const { category: categoryId } = useLocalSearchParams();
  
  // Si el parámetro no es string (puede ser undefined o array si la ruta es compleja)
  const categoryName = Array.isArray(categoryId) ? categoryId[0] : categoryId || 'Establecimientos';

  // 1. Filtrar los establecimientos por la categoría
  const filteredEstablishments = MOCK_ALL_ESTABLISHMENTS.filter(
    (est) => est.category === categoryName
  );

  // 2. Componente de Renderizado de la Tarjeta (reutilizando la de la Home)
  const renderEstablishment = ({ item }: { item: Establishment }) => (
    // Reutilizamos la tarjeta, pero ajustamos los márgenes para la lista vertical
    <View style={styles.cardWrapper}>
      <EstablishmentCard establishment={item} />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 💡 Configuración del Header para esta pantalla */}
      <Stack.Screen 
        options={{ 
          title: categoryName, 
          headerBackTitle: 'Inicio', // Título para el botón de retroceso
          headerTintColor: colors.primary, // Color del texto de la flecha/botón
        }} 
      />
      
      {/* 3. Mostrar el listado */}
      {filteredEstablishments.length > 0 ? (
        <FlatList
          data={filteredEstablishments}
          renderItem={renderEstablishment}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No hay establecimientos en la categoría "{categoryName}".</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: Sizes.padding,
  },
  cardWrapper: {
    // Sobreescribe el margen inferior que ya tiene la tarjeta, si es necesario.
    marginBottom: Sizes.smallPadding, 
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Sizes.padding * 2,
  },
  emptyText: {
    fontSize: Sizes.title,
    color: colors.lightText,
    textAlign: 'center',
  }
});

export default EstablishmentListScreen;