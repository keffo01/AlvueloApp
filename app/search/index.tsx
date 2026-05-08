// app/(tabs)/search/index.tsx

import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { Product } from '@/models/commons.model';
import Colors from '../../constants/colors';
import {
  MOCK_ALL_ESTABLISHMENTS,
  MOCK_PRODUCTS
} from '../../constants/mockData';
import Sizes from '../../constants/Sizes';
import SearchResultEstablishment from './SearchResultEstablishment';
import SearchResultProductCard from './SearchResultProductCard';

interface SearchResultProduct extends Product {
    establishmentName: string;
}

const SearchScreen: React.FC = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');

  // Mock de sugerencias para cuando el usuario aún no escribe
  const recentSearches = ['Pupusas', 'Pizza', 'Farmacia', 'Aguilares centro'];

  // 💡 Tu Lógica de Filtrado (Intacta)
  const { filteredEstablishments, filteredProducts } = useMemo(() => {
    if (searchText.length < 3) {
        return { filteredEstablishments: [], filteredProducts: [] }; 
    }
    
    const query = searchText.toLowerCase();

    const estResults = MOCK_ALL_ESTABLISHMENTS.filter(e => 
        e.name.toLowerCase().includes(query) || 
        e.description?.toLowerCase().includes(query) ||
        e.tags?.some(tag => tag.toLowerCase().includes(query))
    );

    const prodResults: SearchResultProduct[] = MOCK_PRODUCTS
        .filter(p => p.name.toLowerCase().includes(query) || p.description?.toLowerCase().includes(query))
        .map(p => {
            const establishment = MOCK_ALL_ESTABLISHMENTS.find(e => e.id === p.establishment.id);
            return {
                ...p,
                establishmentName: establishment ? establishment.name : 'Desconocido',
            };
        });

    return { filteredEstablishments: estResults, filteredProducts: prodResults };
  }, [searchText]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* 💡 HEADER MODERNO */}
      <View style={styles.header}>
        {/* Si vienes desde la Home, este botón te permite regresar. Si es un tab principal, puedes ocultarlo */}
        {router.canGoBack() && (
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.text} />
          </TouchableOpacity>
        )}

        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={Colors.lightText} style={styles.searchIcon} />
          
          <TextInput
            style={styles.textInput}
            placeholder="Busca locales, platos o categorías..."
            placeholderTextColor={Colors.lightText}
            value={searchText}
            onChangeText={setSearchText}
            autoCapitalize="none"
            autoFocus={true} // El teclado sube automáticamente
            returnKeyType="search"
            selectionColor={Colors.primary} // Color del cursor
          />
          
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color={Colors.lightText} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled" // Permite tocar resultados sin que el teclado bloquee el tap
      >
        {/* 💡 VISTA INICIAL (Menos de 3 letras) */}
        {searchText.length < 3 ? (
            <View style={styles.recentContainer}>
              <Text style={styles.sectionTitleModern}>Búsquedas populares</Text>
              <View style={styles.chipsContainer}>
                {recentSearches.map((item, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.chip}
                    onPress={() => setSearchText(item)} // Al tocar, busca automáticamente
                  >
                    <Ionicons name="trending-up-outline" size={16} color={Colors.lightText} />
                    <Text style={styles.chipText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
        ) : (
            /* 💡 TUS RESULTADOS (Más de 3 letras) */
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'android' ? 40 : 0, // Evita que se meta debajo del reloj en Android
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Sizes.padding,
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6', // Línea sutil elegante
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6', // Gris claro moderno
    borderRadius: 12, // Bordes más suaves
    paddingHorizontal: 12,
    height: 46, // Altura fija cómoda
  },
  searchIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    height: '100%', // 💡 Esto soluciona el texto invisible
    paddingVertical: 0, // 💡 Esto evita que Android corte el texto arriba/abajo
  },
  clearButton: {
    padding: 4,
  },
  scrollContent: {
    padding: Sizes.padding,
    paddingBottom: 40,
  },
  // Estilos de estado vacío
  recentContainer: {
    marginTop: 10,
  },
  sectionTitleModern: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 15,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 14,
    color: Colors.text,
    marginLeft: 6,
  },
  // Estilos de tus resultados
  sectionTitle: {
    fontSize: Sizes.subtitle,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: Sizes.smallPadding,
    marginBottom: Sizes.smallPadding,
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: Sizes.padding,
  },
  noResultsText: {
    fontSize: Sizes.font,
    color: Colors.lightText,
    marginBottom: Sizes.padding,
    fontStyle: 'italic',
  }
});

export default SearchScreen;