// components/SearchResultEstablishment.tsx

import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../../constants/colors';
import { Establishment } from '../../constants/mockData';
import Sizes from '../../constants/Sizes';

interface SearchResultEstablishmentProps {
    establishment: Establishment;
}

const SearchResultEstablishment: React.FC<SearchResultEstablishmentProps> = ({ establishment }) => {
    return (
        // Usar Link para navegar al detalle del establecimiento
        <Link 
            href={`/establishment/${establishment.id}`} 
            asChild
        >
            <TouchableOpacity style={styles.card}>
                <View style={styles.imagePlaceholder} />
                <View style={styles.infoContainer}>
                    <Text style={styles.name}>{establishment.name}</Text>
                    <Text style={styles.tags} numberOfLines={1}>{establishment.tags.join(' • ')}</Text>
                    <Text style={styles.rating}>{establishment.rating.toFixed(1)} ⭐</Text>
                </View>
            </TouchableOpacity>
        </Link>
    );
};

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: Sizes.radius,
        marginBottom: Sizes.smallPadding,
        padding: Sizes.smallPadding,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.background,
    },
    imagePlaceholder: {
        width: 60,
        height: 60,
        borderRadius: Sizes.radius,
        backgroundColor: Colors.background,
        marginRight: Sizes.smallPadding,
    },
    infoContainer: {
        flex: 1,
    },
    name: {
        fontSize: Sizes.font,
        fontWeight: 'bold',
        color: Colors.text,
    },
    tags: {
        fontSize: Sizes.smallPadding,
        color: Colors.lightText,
        marginTop: 2,
    },
    rating: {
        fontSize: Sizes.smallPadding,
        fontWeight: 'bold',
        color: Colors.rating,
        marginTop: 2,
    }
});

export default SearchResultEstablishment;