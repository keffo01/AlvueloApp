import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

const index = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerTitle}>Ayuda y Asistencia</Text>

      <Text style={styles.sectionTitle}>CONTÁCTANOS</Text>
      
      <Text style={styles.paragraph}>
        En Al Vuelo estamos comprometidos en brindarte la mejor experiencia. Si tienes alguna duda, inconveniente con un pedido, o necesitas asistencia con tu cuenta, estamos aquí para apoyarte.
      </Text>

      <Text style={styles.paragraph}>
        Para mayor información, soporte técnico o atención personalizada, por favor escríbenos o llámanos directamente al siguiente número:
      </Text>

      <View style={styles.contactBox}>
        <Text style={styles.contactNumber}>+503 7975-4047</Text>
      </View>

      <Text style={styles.paragraph}>
        Nuestro equipo de soporte recibirá tu mensaje y se pondrá en contacto contigo a la brevedad posible para resolver tus inquietudes.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 15,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 22,
    color: '#555555',
    marginBottom: 15,
    textAlign: 'justify',
  },
  contactBox: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  contactNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000', 
    letterSpacing: 1,
  },
});

export default index;