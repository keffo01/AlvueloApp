// components/HomeSearchInput.tsx

import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import Colors from '../../constants/colors';
import Sizes from '../../constants/Sizes';

const HomeSearchInput: React.FC = () => {
  const router = useRouter();

  const handlePress = () => {
    // 💡 Navegamos a la pantalla de búsqueda completa que estará en app/search/index.tsx
    router.push('/search'); 
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.searchBarContainer}>
      <Ionicons name="search" size={Sizes.header} color={Colors.lightText} style={styles.searchIcon} />
      <Text style={styles.placeholderText}>
        Busca locales, platos o categorías...
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: Sizes.smallPadding,
    marginHorizontal: Sizes.padding,
    borderRadius: Sizes.radius * 2,
    borderWidth: 1,
    borderColor: Colors.background,
    height: Sizes.header + 10,
    elevation: 2, // Sombra suave para destacar
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  searchIcon: {
    marginRight: Sizes.smallPadding,
  },
  placeholderText: {
    flex: 1,
    fontSize: Sizes.font,
    color: Colors.lightText,
  },
});

export default HomeSearchInput;