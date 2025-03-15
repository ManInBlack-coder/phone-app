import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator, Dimensions, FlatList } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '@/hooks/types';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiUrl } from '../utils/apiUtils';

type ListingDetailRouteProp = RouteProp<RootStackParamList, 'ListingDetail'>;
type ListingDetailNavigationProp = StackNavigationProp<RootStackParamList>;

interface Listing {
  id: number;
  title: string;
  price: number;
  imageUrl: string; 
  imageUrls: string[]; // Changed from image_url to match the backend response
  category: string;
  description?: string;
}

// Function to fix malformed image URLs
const fixImageUrl = (imageUrl: string | null): string | null => {
  if (!imageUrl) return null;
  return imageUrl;
};

const ListingDetailScreen = () => {
  const route = useRoute<ListingDetailRouteProp>();
  const navigation = useNavigation<ListingDetailNavigationProp>();
  const { id } = route.params;
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const getSessionId = async () => {
      const storedSessionId = await AsyncStorage.getItem('sessionId');
      setSessionId(storedSessionId);
    };
    getSessionId();
    fetchListingDetails();
  }, [id]);

  const fetchListingDetails = async () => {
    try {
      setLoading(true);
      const email = await AsyncStorage.getItem('userEmail');
      const password = await AsyncStorage.getItem('userPassword');
      const storedSessionId = await AsyncStorage.getItem('sessionId');

      const headers = {
        'Accept': 'application/json',
        ...(email && password ? { 
          'Authorization': `Basic ${btoa(`${email}:${password}`)}` 
        } : {}),
        ...(storedSessionId ? { 'Cookie': `JSESSIONID=${storedSessionId}` } : {})
      };

      const response = await fetch(`${getApiUrl()}/api/listings/${id}`, {
        headers: headers,
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setListing(data);
      } else {
        console.error('Failed to fetch listing details');
      }
    } catch (error) {
      console.error('Error fetching listing details:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleContactSeller = () => {
    // Implement contact seller functionality
    console.log('Contact seller for listing:', id);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4B5FBD" />
      </View>
    );
  }

  if (!listing) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Listing not found</Text>
        <TouchableOpacity style={styles.backButtonContainer} onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Fix image URL if needed
  let imageUrl = listing.imageUrl;
  if (imageUrl && !imageUrl.startsWith('http')) {
    imageUrl = `${getApiUrl()}${imageUrl}`;
  }
  console.log('imageUrl: ',imageUrl);
  console.log('Image URLs:', listing.imageUrls);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <FlatList
            data={listing.imageUrls}
            renderItem={({ item }) => (
              <Image 
                source={{ uri: item }}
                style={styles.image}
              />
            )}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
        
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>{listing.title}</Text>
            <Text style={styles.price}>$ {listing.price.toFixed(2)}</Text>
          </View>
          
          <Text style={styles.description}>
            {listing.description || `${listing.title} is made of by natural wood. The design that is very simple and minimal. This is truly one of the best furnitures in any family for now. With 3 different colors, you can easily select the best match for your home.`}
          </Text>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.bookmarkButton}
              onPress={toggleBookmark}
            >
              <Ionicons 
                name={isBookmarked ? "bookmark" : "bookmark-outline"} 
                size={24} 
                color="#4B5FBD" 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.contactButton}
              onPress={handleContactSeller}
            >
              <Text style={styles.contactButtonText}>Contact Seller</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    marginBottom: 16,
    color: '#000',
  },
  backButtonContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  backButton: {
    fontSize: 16,
    color: '#4B5FBD',
    fontWeight: '500',
  },
  imageContainer: {
    width: windowWidth,
    height: windowWidth,
    backgroundColor: '#F5F5F5',
    position: 'relative',
  },
  image: {
    width: windowWidth,
    height: windowWidth,
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  imageErrorText: {
    marginTop: 8,
    fontSize: 14,
    color: '#8E8E93',
  },
  contentContainer: {
    padding: 24,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '500',
    color: '#000',
    marginBottom: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    marginBottom: 32,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookmarkButton: {
    width: 56,
    height: 56,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contactButton: {
    flex: 1,
    height: 56,
    backgroundColor: '#4B5FBD',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  carouselContainer: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
});

export default ListingDetailScreen; 