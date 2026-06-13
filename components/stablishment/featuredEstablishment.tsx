import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import EstablishmentCard from '../../components/HomeScreen/EstablishmentCard'; // Ajusta la ruta si es necesario
import Colors from '../../constants/colors';
import { Establishment } from '../../models/commons.model';
import { fetchAllEstablishments } from '../../services/establishment.service';

const FeaturedEstablishments = () => {
  const [establishments, setEstablishments] = useState<Establishment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchAllEstablishments();
      setEstablishments(data);
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Buscando favoritos...</Text>
      </View>
    );
  }

  if (establishments.length === 0) return null;

  return (
    <View style={styles.container}>
      {establishments.map((est) => (
        <EstablishmentCard key={est.id} establishment={est} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
  loadingContainer: {
    paddingVertical: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: Colors.lightText,
    fontSize: 14,
  }
});

export default FeaturedEstablishments;