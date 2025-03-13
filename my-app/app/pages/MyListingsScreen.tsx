import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { getApiUrl } from '../utils/apiUtils';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ListingImage from '../components/ListingImage';

const MyListingsScreen = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const sessionId = await AsyncStorage.getItem('sessionId');
        const userEmail = await AsyncStorage.getItem('userEmail');

        if (!userEmail) {
          setError('User email not found. Please log in again.');
          return; // Exit if userEmail is null
        }

        const response = await fetch(`${getApiUrl()}/api/users/listings/${encodeURIComponent(userEmail)}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...(sessionId ? { 'Cookie': `JSESSIONID=${sessionId}` } : {})
          }
        });

        if (response.ok) {
          const data = await response.json();
          setListings(data);
        } else {
          const data = await response.json();
          setListings(data);
        }
      }  finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.listingItem}>
      <ListingImage imageUrl={item.imageUrl} sessionId={null} />
     
     <View style={styles.listingDetails}>
          <Text style={styles.listingTitle}>{item.title}</Text>
          <Text style={styles.listingPrice}> $ {item.price} </Text>
     </View>
     
    </View>
  ); 

  if (loading) {
    return <ActivityIndicator size="large" color="#4B5FBD" />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#4B5FBD" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>My Listings</Text>

      {listings.length === 0 ? (
        <Text style={styles.noListingsText}>Pole ühtegi listingut lisatud</Text>
      ) : (
        <FlatList
          data={listings}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9F9F9',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    color: '#4B5FBD',
  },
  listingItem: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    flexDirection: 'row',
  },
  listingDetails: {
    flexDirection: 'column',
    marginLeft: 20,
  },
  listingTitle: {
    fontSize: 18,
    fontWeight: '500',
    flexDirection: 'row',
    color: '#8a8a8a',
  },
  listingPrice: {
    fontSize: 16,
    color: '#0d0d0d',
    flexDirection: 'row',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
  },
  backText: {
    fontSize: 16,
    color: '#4B5FBD',
    marginLeft: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
  noListingsText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#8a8a8a',
    marginTop: 20,
  },
});

export default MyListingsScreen;
