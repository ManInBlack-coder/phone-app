import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ProfileScreen from '../ProfileScreen';
import { RootStackParamList } from '../../../hooks/types';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiUrl } from '../../utils/apiUtils';
import LikedListings from '../likedListings';
const Tab = createBottomTabNavigator();

interface Category {
  id: string;
  name: string;
  icon: string;
}


const categories: Category[] = [
  { id: 'Popular', name: 'All', icon: 'star' },
  { id: 'Electronics', name: 'Electronics', icon: 'phone-portrait' },
  { id: 'Furniture', name: 'Furniture', icon: 'chair-outline' },
  { id: 'Clothing', name: 'Clothing', icon: 'shirt' },
  { id: 'Books', name: 'Books', icon: 'book' },
  { id: 'Sports', name: 'Sports', icon: 'basketball' },
  { id: 'Other', name: 'Other', icon: 'ellipsis-horizontal' },
];

interface Listing {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
  imageUrls: string[];
  category: string;
  description?: string;
}

const ListingImage = ({ imageUrl, sessionId }: { imageUrl: string | null, sessionId: string | null }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  if (!imageUrl) {
    return (
      <View style={[styles.image, styles.imagePlaceholder]}>
        <ActivityIndicator size="large" color="#4B5FBD" />
      </View>
    );
  }

  // Fix URL if it's malformed
  let fixedUrl = imageUrl;
  if (!imageUrl.startsWith('http')) {
    fixedUrl = `${getApiUrl()}${imageUrl}`;
  }

  return (
    <View style={styles.imageContainer}>
      <Image 
        source={{ 
          uri: fixedUrl,
          headers: {
            'Accept': 'image/*',
            ...(sessionId ? { 'Cookie': `JSESSIONID=${sessionId}` } : {})
          }
        }}
        style={styles.image}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        onError={(e) => {
          console.error('Error loading image:', e.nativeEvent.error);
          setError(e.nativeEvent.error);
          setIsLoading(false);
        }}
      />
      {isLoading && (
        <View style={[styles.imagePlaceholder, StyleSheet.absoluteFill]}>
          <ActivityIndicator size="large" color="#4B5FBD" />
        </View>
      )}
      {error && !isLoading && (
        <View style={[styles.imagePlaceholder, StyleSheet.absoluteFill]}>
          <Ionicons name="image-outline" size={40} color="#8E8E93" />
          <Text style={styles.errorText}>Failed to load image</Text>
        </View>
      )}
    </View>
  );
};

const ListingsTab = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [token, setToken] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const pollingInterval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const getAuthData = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      const storedSessionId = await AsyncStorage.getItem('sessionId');
      setToken(storedToken);
      setSessionId(storedSessionId);
    };
    getAuthData();
  }, []);

  const fetchListings = async () => {
    try {
      const url = `${getApiUrl()}/api/listings/category/${selectedCategory}`;
      console.log('Fetching from URL:', url);
      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched listings data: ', data);
      setListings(data);
    } catch (error) {
      console.log('Error fetching listings:', error);
    }
  };

  useEffect(() => {
    fetchListings();

    // Set up polling every 5 seconds
    pollingInterval.current = setInterval(fetchListings, 5000);

    // Cleanup interval on unmount
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, [selectedCategory]);

  const filteredListings = listings.filter(listing =>
    listing.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }: { item: Listing }) => {
    const imageUrl = item.imageUrls && item.imageUrls.length > 0 ? item.imageUrls[0] : null;

    return (
      <TouchableOpacity 
          style={styles.listingCard}
          onPress={() => navigation.navigate('ListingDetail', { id: item.id.toString() })}
      >
          <ListingImage imageUrl={imageUrl} sessionId={sessionId} />
          <View style={styles.listingInfo}>
              <Text style={styles.listingTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.listingPrice}>${item.price.toFixed(2)}</Text>
          </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Find All You Need"
            value={searchQuery}
            onChangeText={text => setSearchQuery(text)}
          />
        </View>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
        contentContainerStyle={styles.categoriesContent}
      >
        {categories.map((category) => (
          <React.Fragment key={category.id}>
            <TouchableOpacity 
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonActive
              ]}
              onPress={() => {
                setSelectedCategory(category.id);
                fetchListings();
              }}
            >
              <View style={[
                styles.categoryIcon,
                selectedCategory === category.id && styles.categoryIconActive
              ]}>
                <Ionicons 
                  name={category.icon as any} 
                  size={24} 
                  color={selectedCategory === category.id ? '#fff' : '#000'} 
                />
              </View>
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          </React.Fragment>
        ))}
      </ScrollView>

      <FlatList
        data={filteredListings}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        columnWrapperStyle={styles.row}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const BookmarksTab = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Favorites</Text>
    <LikedListings />
  </View>
);

export default function MainScreen() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === 'ListingsTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'BookmarksTab') {
            iconName = focused ? 'bookmark' : 'bookmark-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4B5FBD',
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="ListingsTab" 
        component={ListingsTab}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="BookmarksTab" 
        component={BookmarksTab}
        options={{ title: 'Bookmarks' }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
     
    </Tab.Navigator>
  );
}

const windowWidth = Dimensions.get('window').width;
const cardWidth = (windowWidth - 48) / 2; 

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    paddingTop: 28,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  searchIcon: {
    marginRight: 8,
    marginLeft: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
    color: '#000',
    padding: 8,
  },
  categoriesContainer: {
    backgroundColor: '#F5F5F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 9,
    elevation: 3,
  },
  categoriesContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  categoryButton: {
    alignItems: 'center',
    marginRight: 20,
    marginBottom: 50,
  },
  categoryButtonActive: {
    opacity: 1,
  },
  categoryIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  categoryIconActive: {
    backgroundColor: '#000',
  },
  categoryText: {
    fontSize: 13,
    color: '#8E8E93',
  },
  categoryTextActive: {
    color: '#000',
    fontWeight: '500',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 470,
    marginTop: 30,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
    width: '100%',
  },
  listingCard: {
    width: cardWidth,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '100%',
    height: cardWidth,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  errorText: {
    marginTop: 8,
    fontSize: 14,
    color: '#8E8E93',
  },
  listingInfo: {
    paddingTop: 12,
    paddingHorizontal: 4,
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 6,
    color: '#000000',
  },
  listingPrice: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000000',
  },
  text: {
    fontSize: 25,
    textAlign: 'center',
    marginTop: 20,
    color: '#000000',
  },
});