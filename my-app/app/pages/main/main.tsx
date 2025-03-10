import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, ScrollView, TextInput } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ProfileScreen from '../ProfileScreen';
import { RootStackParamList } from '@/hooks/types';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Tab = createBottomTabNavigator();

interface Category {
  id: string;
  name: string;
  icon: string;
}

const categories: Category[] = [
  { id: 'popular', name: 'Popular', icon: 'star' },
  { id: 'chair', name: 'Chair', icon: 'grid' },
  { id: 'table', name: 'Table', icon: 'square' },
  { id: 'armchair', name: 'Armchair', icon: 'cube' },
  { id: 'bed', name: 'Bed', icon: 'bed' },
  { id: 'lamp', name: 'Lamp', icon: 'bulb' },
];

interface Listing {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
  category: string;
}

const ListingsTab = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('popular');
  const [token, setToken] = useState<string | null>(null);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const pollingInterval = useRef<NodeJS.Timeout>();

  const fetchListings = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('jwtToken');
      setToken(storedToken);
      
      const response = await fetch('http://10.15.16.201:8080/api/listings', {
        headers: {
          'Authorization': storedToken ? `Bearer ${storedToken}` : ''
        }
      });
      if (response.ok) {
        const data = await response.json();
        setListings(data);
      } else {
        console.error('Failed to fetch listings');
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchListings();

    // Set up polling every 5 seconds
    pollingInterval.current = setInterval(fetchListings, 5000);

    // Cleanup interval on unmount
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, []);

  const renderItem = ({ item }: { item: Listing }) => {
    console.log('Rendering item:', item);
    const imageUrl = item.imageUrl ? `http://10.15.16.201:8080${item.imageUrl}` : null;
    console.log('Image URL:', imageUrl);
    
    return (
    <TouchableOpacity 
      style={styles.listingCard}
      onPress={() => navigation.navigate('ListingDetail', { id: item.id })}
    >
      {imageUrl ? (
        <Image 
          source={{ 
            uri: imageUrl,
            headers: {
              'Accept': 'image/*',
              'Authorization': token ? `Bearer ${token}` : ''
            }
          }}
          style={styles.listingImage}
          resizeMode="cover"
          onError={(error) => console.error('Image loading error:', error.nativeEvent)}
          onLoad={() => console.log('Image loaded successfully:', imageUrl)}
        />
      ) : (
        <View style={[styles.listingImage, styles.placeholderContainer]}>
          <Ionicons name="image-outline" size={40} color="#8E8E93" />
          <Text style={styles.placeholderText}>No Image</Text>
        </View>
      )}
      <View style={styles.listingInfo}>
        <Text style={styles.listingTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.listingPrice}>${item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
    );
  };

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity 
      style={[
        styles.categoryButton,
        selectedCategory === item.id && styles.categoryButtonActive
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      <View style={[
        styles.categoryIcon,
        selectedCategory === item.id && styles.categoryIconActive
      ]}>
        <Ionicons 
          name={item.icon as any} 
          size={24} 
          color={selectedCategory === item.id ? '#fff' : '#000'} 
        />
      </View>
      <Text style={[
        styles.categoryText,
        selectedCategory === item.id && styles.categoryTextActive
      ]}>
        {item.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
          <Text style={styles.searchPlaceholder}>Find All You Need</Text>
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
            {renderCategory({ item: category })}
          </React.Fragment>
        ))}
      </ScrollView>

      <FlatList
        data={listings}
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
    <Text style={styles.text}>Bookmarks</Text>
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
const cardWidth = (windowWidth - 48) / 2; // 32px container padding + 16px gap between cards

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    paddingTop: 48,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  searchIcon: {
    marginRight: 8,
    marginLeft: 4,
  },
  searchPlaceholder: {
    fontSize: 17,
    color: '#000',
    fontWeight: '500',
  },
  categoriesContainer: {
    backgroundColor: '#fff',
  },
  categoriesContent: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  categoryButton: {
    alignItems: 'center',
    marginRight: 20,
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
    paddingBottom: 120,
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
  listingImage: {
    width: '100%',
    height: cardWidth,
    borderRadius: 12,
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
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  placeholderContainer: {
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 14,
    color: '#8E8E93',
  },
});