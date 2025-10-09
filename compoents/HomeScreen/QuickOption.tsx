// components/QuickOptions.tsx

import Ionicons from '@expo/vector-icons/Ionicons'; // Importa la librería de iconos
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/colors';
import Sizes from '../../constants/Sizes';
import { QuickOption } from '../../models/commons.model';

interface QuickOptionsProps {
  options: QuickOption[];
}

const OptionItem: React.FC<{ item: QuickOption }> = ({ item }) => {
  const navigation = useRouter();

   const handlePress = () => {
    // 💡 CAMBIO CLAVE: Usar el nombre de la ruta dinámica. 
    // La navegación pasa el nombre como parámetro de la URL.
    // Ej: navigation.push('Restaurantes') irá a app/[category]/index.tsx con category='Restaurantes'
    navigation.push(item.name as any); // Usamos 'name' como la categoría a buscar
  };

  return (
    <TouchableOpacity style={styles.optionItem} onPress={handlePress}>
      <View style={styles.iconCircle}>
        <Ionicons name={item.iconName as any} size={Sizes.icon} color={Colors.primary} />
      </View>
      <Text style={styles.optionText}>{item.name}</Text>
    </TouchableOpacity>
  );
};

const QuickOptions: React.FC<QuickOptionsProps> = ({ options }) => {
  return (
    <View style={styles.container}>
      <FlatList
        data={options}
        renderItem={({ item }) => <OptionItem item={item} />}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Sizes.padding * 1.5,
  },
  optionItem: {
    alignItems: 'center',
    width: 80, // Ancho fijo para cada item
    marginRight: Sizes.smallPadding,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F3F4F6', // Un gris muy claro
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Sizes.smallPadding / 2,
  },
  optionText: {
    fontSize: Sizes.subtitle,
    color: Colors.text,
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default QuickOptions;