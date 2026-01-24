// components/ProfileOption.tsx

import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/colors';
import Sizes from '../../constants/Sizes';

interface ProfileOptionProps {
  iconName: keyof typeof Ionicons.glyphMap; // Para asegurar que el nombre del icono es válido
  title: string;
  onPress: () => void;
  isLast?: boolean; // Para controlar el borde inferior
}

const ProfileOption: React.FC<ProfileOptionProps> = ({
  iconName,
  title,
  onPress,
  isLast = false,
}) => {
  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        isLast && { borderBottomWidth: 0 } // Quita el borde si es el último
      ]} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.leftContent}>
        {/* Icono Principal */}
        <Ionicons 
          name={iconName} 
          size={22} 
          color={Colors.primary} 
          style={styles.icon}
        />
        {/* Título de la Opción */}
        <Text style={styles.title}>{title}</Text>
      </View>
      
      {/* Flecha de Navegación */}
      <Ionicons 
        name="chevron-forward-outline" 
        size={22} 
        color={Colors.lightText}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Sizes.padding,
    paddingHorizontal: Sizes.padding,
    backgroundColor: '#fff',
    borderBottomWidth: StyleSheet.hairlineWidth, // Borde muy fino
    borderBottomColor: Colors.background,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: Sizes.padding,
    minWidth: 25, // Asegura que los iconos estén alineados
    textAlign: 'center',
  },
  title: {
    fontSize: Sizes.font,
    color: Colors.text,
    fontWeight: '500',
  },
});

export default ProfileOption;