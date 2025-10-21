// app/(tabs)/search/index.tsx

import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { Product } from '@/models/commons.model';
import Colors from '../../constants/colors';
import {
    MOCK_ALL_ESTABLISHMENTS,
    MOCK_PRODUCTS
} from '../../constants/mockData';
import Sizes from '../../constants/Sizes';
import SearchResultEstablishment from './SearchResultEstablishment';
import SearchResultProductCard from './SearchResultProductCard';

// --- Interfaces para los resultados enriquecidos ---
interface SearchResultProduct extends Product {
    establishmentName: string; // Para mostrar de qué local es el producto
}

const SearchScreen: React.FC = () => {
  const [searchText, setSearchText] = useState('');

  // 💡 Lógica de Filtrado (Sección 2)
  const { filteredEstablishments, filteredProducts } = useMemo(() => {
    if (searchText.length < 3) {
        // Mostrar solo resultados recientes o populares si el texto es muy corto
        return { filteredEstablishments: [], filteredProducts: [] }; 
    }
    
    const query = searchText.toLowerCase();

    // --- 1. Filtrar Establecimientos ---
    const estResults = MOCK_ALL_ESTABLISHMENTS.filter(e => 
        e.name.toLowerCase().includes(query) || 
        e.description?.toLowerCase().includes(query) ||
        e.tags?.some(tag => tag.toLowerCase().includes(query))
    );

    // --- 2. Filtrar Productos y Enriquecerlos ---
    const prodResults: SearchResultProduct[] = MOCK_PRODUCTS
        .filter(p => p.name.toLowerCase().includes(query) || p.description?.toLowerCase().includes(query))
        .map(p => {
            // Encontrar el establecimiento para obtener el nombre
            const establishment = MOCK_ALL_ESTABLISHMENTS.find(e => e.id === p.establishment.id);
            return {
                ...p,
                establishmentName: establishment ? establishment.name : 'Desconocido',
            };
        });

    return { filteredEstablishments: estResults, filteredProducts: prodResults };
  }, [searchText]);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ 
        title: 'Buscar',
        headerShown: false // Ocultamos el header nativo para usar uno personalizado
      }} />

      {/* 💡 Barra de Búsqueda Personalizada */}
      <View style={styles.searchBarContainer}>
        <Ionicons name="search" size={Sizes.header} color={Colors.lightText} style={styles.searchIcon} />
        <TextInput
          style={styles.textInput}
          placeholder="Busca locales, platos o categorías..."
          placeholderTextColor={Colors.lightText}
          value={searchText}
          onChangeText={setSearchText}
          autoCapitalize="none"
        />
        {searchText.length > 0 && (
          <TouchableOpacity onPress={() => setSearchText('')} style={styles.clearButton}>
            <Ionicons name="close-circle" size={Sizes.header} color={Colors.lightText} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 💡 Renderizado de Resultados (Sección 3) */}
        {searchText.length < 3 ? (
            <View style={styles.hintContainer}>
                <Text style={styles.hintText}>Empieza a escribir para buscar.</Text>
            </View>
        ) : (
            <>
                <Text style={styles.sectionTitle}>Locales ({filteredEstablishments.length})</Text>
                {filteredEstablishments.length > 0 ? (
                    filteredEstablishments.map(e => (
                        <SearchResultEstablishment key={e.id} establishment={e} />
                    ))
                ) : (
                    <Text style={styles.noResultsText}>No se encontraron locales.</Text>
                )}

                <View style={styles.sectionDivider} />

                <Text style={styles.sectionTitle}>Platos/Productos ({filteredProducts.length})</Text>
                {filteredProducts.length > 0 ? (
                    filteredProducts.map(p => (
                        <SearchResultProductCard key={p.productId} product={{
                            id: p.productId,
                            name: p.name,
                            price: p.price,
                            establishmentName: p.establishmentName
                        }} />
                    ))
                ) : (
                    <Text style={styles.noResultsText}>No se encontraron productos.</Text>
                )}
            </>
        )}
      </ScrollView>
    </View>
  );
};

// ... (Estilos) ...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 50, // Ajuste para iOS/Android (puedes usar useSafeAreaInsets)
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: Sizes.smallPadding,
    margin: Sizes.padding,
    borderRadius: Sizes.radius * 2,
    borderWidth: 1,
    borderColor: Colors.background,
  },
  searchIcon: {
    marginRight: Sizes.smallPadding / 2,
  },
  textInput: {
    flex: 1,
    fontSize: Sizes.font,
    color: Colors.text,
    height: Sizes.header,
  },
  clearButton: {
    marginLeft: Sizes.smallPadding / 2,
  },
  scrollContent: {
    padding: Sizes.padding,
  },
  hintContainer: {
    alignItems: 'center',
    padding: Sizes.padding * 4,
  },
  hintText: {
    fontSize: Sizes.title,
    color: Colors.lightText,
  },
  sectionTitle: {
    fontSize: Sizes.subtitle,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: Sizes.smallPadding,
    marginBottom: Sizes.smallPadding,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: Colors.background,
    marginVertical: Sizes.padding,
  },
  noResultsText: {
    fontSize: Sizes.font,
    color: Colors.lightText,
    marginBottom: Sizes.padding,
  }
});

export default SearchScreen;