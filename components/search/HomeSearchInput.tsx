// components/HomeSearchInput.tsx

import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/colors';

const HomeSearchInput: React.FC = () => {
  const router = useRouter();

  const handlePress = () => {
    // 💡 Navegamos a la pantalla de búsqueda completa que estará en app/search/index.tsx
    router.push('/search'); 
  };

  return (
    <TouchableOpacity 
      activeOpacity={0.8} 
      onPress={handlePress} 
      style={styles.searchBarContainer}
    >
      <Ionicons name="search-outline" size={20} color={Colors.lightText} style={styles.searchIcon} />
      
      <Text style={styles.placeholderText}>
        Busca locales, platos o categorías...
      </Text>

      {/* Agregamos un ícono de filtro visual para darle un toque más Pro */}
      <View style={styles.filterBtn}>
        <Ionicons name="options-outline" size={20} color={Colors.primary} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa', // Un gris ultra claro y moderno
    borderRadius: 16, // Bordes bien redondos
    paddingHorizontal: 15,
    height: 55, // Altura cómoda para tocar
    // Hemos quitado el marginHorizontal para que el contenedor padre (HomeScreen) maneje los márgenes laterales
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  placeholderText: {
    flex: 1,
    fontSize: 15,
    color: Colors.lightText,
  },
  filterBtn: {
    padding: 8,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  }
});

export default HomeSearchInput;