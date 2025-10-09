// views/InfoTab.tsx

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Sizes from '../../constants/Sizes';
import Colors from '../../constants/colors';
import { Establishment } from '../../models/commons.model';

interface InfoTabProps {
  establishment: Establishment;
}

const InfoTab: React.FC<InfoTabProps> = ({ establishment }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Horario de Servicio</Text>
      <Text style={styles.infoText}>Lunes a Viernes: 10:00 AM - 10:00 PM</Text>
      <Text style={styles.infoText}>Sábados y Domingos: 11:00 AM - 11:00 PM</Text>

      <View style={styles.divider} />

      <Text style={styles.sectionTitle}>Detalles de la Empresa</Text>
      <Text style={styles.infoText}>Categoría: {establishment.category}</Text>
      <Text style={styles.infoText}>Establecido en: 2018</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Sizes.padding,
    backgroundColor: Colors.background,
  },
  sectionTitle: {
    fontSize: Sizes.title,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: Sizes.smallPadding,
    marginBottom: Sizes.smallPadding,
  },
  infoText: {
    fontSize: Sizes.font,
    color: Colors.lightText,
    marginBottom: 4,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.background,
    marginVertical: Sizes.padding,
  }
});

export default InfoTab;