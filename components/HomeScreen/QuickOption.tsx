// components/QuickOptions.tsx

import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/colors';
import Sizes from '../../constants/Sizes';

const { width } = Dimensions.get('window');
const GRID_PADDING = Sizes.padding;
const GAP = 10;
const COLUMN_WIDTH = (width - (GRID_PADDING * 2) - GAP) / 2;

const QuickOptions: React.FC = () => {
  const navigation = useRouter();

  const handlePress = (name: string) => {
    navigation.push(name as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        
        {/* 1. BOTÓN GRANDE (Combos Especiales) - Ocupa toda la columna izquierda */}
        <TouchableOpacity 
          style={[styles.bigCard, { backgroundColor: '#FFF4E5' }]} 
          onPress={() => handlePress('Combos')}
        >
          <View style={styles.iconCircleBig}>
            <Ionicons name="fast-food" size={32} color="#FF8C00" />
          </View>
          <Text style={styles.bigCardTitle}>Combos{"\n"}Especiales</Text>
          <Text style={styles.tagline}>Ahorra más</Text>
        </TouchableOpacity>

        <View style={styles.rightColumn}>
          {/* 2. BOTÓN MEDIANO (Farmacia) */}
          <TouchableOpacity 
            style={[styles.mediumCard, { backgroundColor: '#E8F5E9' }]} 
            onPress={() => handlePress('Farmacia')}
          >
            <Ionicons name="medical" size={24} color="#2E7D32" />
            <Text style={styles.mediumCardTitle}>Farmacia</Text>
          </TouchableOpacity>

          {/* FILA DE 3 BOTONES PEQUEÑOS ABAJO */}
          <View style={styles.smallRow}>
             {/* 3. Restaurantes */}
             <TouchableOpacity style={styles.smallCard} onPress={() => handlePress('Restaurantes')}>
                <Ionicons name="restaurant" size={20} color={Colors.primary} />
                <Text style={styles.smallCardText}>Locales</Text>
             </TouchableOpacity>

             {/* 4. Mandaditos (O similar) */}
             <TouchableOpacity style={styles.smallCard} onPress={() => handlePress('Mandaditos')}>
                <Ionicons name="bicycle" size={20} color={Colors.primary} />
                <Text style={styles.smallCardText}>Envíos</Text>
             </TouchableOpacity>
          </View>
          
          {/* 5. OTRO BOTÓN MEDIANO (Supermercado / Otros) */}
          <TouchableOpacity 
            style={[styles.mediumCard, { backgroundColor: '#E3F2FD', marginTop: GAP }]} 
            onPress={() => handlePress('Super')}
          >
            <Ionicons name="cart" size={24} color="#1565C0" />
            <Text style={styles.mediumCardTitle}>Super</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: GRID_PADDING,
    marginVertical: 10,
  },
  grid: {
    flexDirection: 'row',
    height: 220, // Altura fija para el rompecabezas
  },
  // --- CARD GRANDE ---
  bigCard: {
    width: COLUMN_WIDTH,
    height: '100%',
    borderRadius: 20,
    padding: 15,
    justifyContent: 'space-between',
    marginRight: GAP,
  },
  iconCircleBig: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bigCardTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#CC7000',
  },
  tagline: {
    fontSize: 12,
    color: '#FF8C00',
    fontWeight: '600',
  },
  // --- COLUMNA DERECHA ---
  rightColumn: {
    flex: 1,
    justifyContent: 'space-between',
  },
  mediumCard: {
    flex: 1,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  mediumCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 10,
    color: Colors.text,
  },
  smallRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: GAP,
    height: 70,
  },
  smallCard: {
    width: '48%',
    backgroundColor: '#F3F4F6',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallCardText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 4,
  }
});

export default QuickOptions;