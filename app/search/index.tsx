import Ionicons from '@expo/vector-icons/Ionicons';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import Colors from '../../constants/colors';
import Sizes from '../../constants/Sizes';
import SearchResultEstablishment from './SearchResultEstablishment';
import SearchResultProductCard from './SearchResultProductCard';

// Importamos el nuevo Hook
import { useSearch } from '../../hooks/useSearch';

const SearchScreen: React.FC = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  

  // 💡 Consumimos la API y los Tags dinámicos
  const { establishments, products, popularTags, loading } = useSearch(searchText);

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* HEADER MODERNO */}
      <View style={styles.header}>
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
            autoFocus={true} 
            returnKeyType="search"
            selectionColor={Colors.primary}
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
        keyboardShouldPersistTaps="handled" 
      >
        {/* ESTADO 1: Cargando */}
        {loading && searchText.length >= 3 ? (
            <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 40 }} />
        ) : 
        
        /* ESTADO 2: Sin búsqueda (Tags dinámicos) */
        searchText.length < 3 ? (
            <View style={styles.recentContainer}>
              <Text style={styles.sectionTitleModern}>Búsquedas populares</Text>
              <View style={styles.chipsContainer}>
                {popularTags.map((item, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.chip}
                    onPress={() => setSearchText(item)} 
                  >
                    <Ionicons name="trending-up-outline" size={16} color={Colors.lightText} />
                    <Text style={styles.chipText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
        ) : (
            /* ESTADO 3: Resultados de la API */
            <>
                <Text style={styles.sectionTitle}>Locales ({establishments.length})</Text>
                {establishments.length > 0 ? (
                    establishments.map((e: any) => (
                        <SearchResultEstablishment key={e.id} establishment={e} />
                    ))
                ) : (
                    <Text style={styles.noResultsText}>No se encontraron locales.</Text>
                )}

                <View style={styles.sectionDivider} />

                <Text style={styles.sectionTitle}>Platos/Productos ({products.length})</Text>
                {products.length > 0 ? (
                    products.map((p: any) => (
                        <SearchResultProductCard key={p.productId} product={p} />
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

// ... Mantén tus mismos styles de StyleSheet aquí abajo ...

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingTop: Platform.OS === 'android' ? 40 : 0, 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Sizes.padding,
    paddingTop: 10,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6', 
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6', 
    borderRadius: 12, 
    paddingHorizontal: 12,
    height: 46, 
  },
  searchIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    height: '100%', 
    paddingVertical: 0, 
  },
  clearButton: {
    padding: 4,
  },
  scrollContent: {
    padding: Sizes.padding,
    paddingBottom: 40,
  },
  
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