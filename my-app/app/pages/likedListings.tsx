import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiUrl } from './../utils/apiUtils';
import { Listing } from '../../hooks/Listing';
import { Ionicons } from '@expo/vector-icons';

const LikedListings = () => {
    const [likedListings, setLikedListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLikedListings = async () => {
            const userId = await AsyncStorage.getItem('userId');
            if (userId) {
                try {
                    const response = await fetch(`${getApiUrl()}/api/listings/liked/${userId}`);
                    if (response.ok) {
                        const data = await response.json();
                        setLikedListings(data);
                    } else {
                        console.error('Failed to fetch liked listings:', response.status);
                    }
                } catch (error) {
                    console.error('Error fetching liked listings:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchLikedListings();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4B5FBD" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={likedListings}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.listingItem}>
                        {item.imageUrls && item.imageUrls.length > 0 && (
                            <Image
                                source={{ uri: item.imageUrls[0] }}
                                style={styles.image}
                            />
                        )}
                        <View style={styles.listingInfo}>
                            <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
                       
                       
                        </View>
                        <View style={styles.backButton}>
                            <Ionicons style={styles.backButton} name="trash" size={24} color="black" />
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item) => item.id.toString()}
            />
           
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listingItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderColor: '#000000',
        borderRadius: 10,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        marginBottom: 10,
    },
    image: {
        width: 100,
        height: 100,
        resizeMode: 'cover',
        borderRadius: 8,
        marginRight: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#8a8a8a'
    },
    price: {
        fontSize: 16,
        color: '#0d0d0d',
    },
    listingInfo: {
        flex: 1,
        paddingLeft: 10,
        flexDirection: 'column',
        },
    backButton: {
        marginLeft: 0,
        alignSelf: 'flex-end',
        height: '100%',
    },
});

export default LikedListings;