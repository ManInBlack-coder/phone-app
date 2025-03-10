import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Pressable, ScrollView, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '@/hooks/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface UserProfile {
  id: number;
  nimi: string;
  email: string;
}

// API base URL
const API_BASE_URL = 'http://192.168.1.71:8080';

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const userEmail = await AsyncStorage.getItem('userEmail');
      if (!userEmail) {
        console.error('No user email found');
        navigation.navigate('SignIn');
        return;
      }

      const password = await AsyncStorage.getItem('userPassword');
      const sessionId = await AsyncStorage.getItem('sessionId');

      const response = await fetch(`${API_BASE_URL}/api/users/profile/${encodeURIComponent(userEmail)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Basic ${btoa(`${userEmail}:${password}`)}`,
          ...(sessionId ? { 'Cookie': `JSESSIONID=${sessionId}` } : {})
        }
      });

      console.log('Profile response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Profile data:', data);
        setUserProfile(data);
      } else {
        const errorText = await response.text();
        console.error('Failed to fetch user profile:', response.status, errorText);
        navigation.navigate('SignIn');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      navigation.navigate('SignIn');
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userEmail');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={24} color="#4B5FBD" />
        </TouchableOpacity>
      </View>

      <View style={styles.profileInfo}>
        <Text style={styles.name}>{userProfile?.nimi || 'Loading...'}</Text>
        <Text style={styles.email}>{userProfile?.email || 'Loading...'}</Text>
      </View>

      <Pressable style={styles.section} onPress={() => navigation.navigate('MyListings')}>
        <View style={styles.sectionContent}>
          <Text style={styles.sectionTitle}>My Listings</Text>
          <Text style={styles.sectionSubtitle}>Already have 10 listing</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#4B5FBD" />
      </Pressable>

      <Pressable style={styles.section} onPress={() => navigation.navigate('Settings')}>
        <View style={styles.sectionContent}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <Text style={styles.sectionSubtitle}>Account, FAQ, Contact</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#4B5FBD" />
      </Pressable>

      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => navigation.navigate('AddListing')}
      >
        <Text style={styles.addButtonText}>Add a new listing</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  logoutButton: {
    padding: 8,
  },
  profileInfo: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#8E8E93',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 1,
    justifyContent: 'space-between',
  },
  sectionContent: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#4B5FBD',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
  },
  addButton: {
    backgroundColor: '#4B5FBD',
    margin: 20,
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  }
}); 