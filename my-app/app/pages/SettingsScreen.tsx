import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiUrl } from '../utils/apiUtils';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../hooks/types';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList>;

interface UserProfile {
  id: number;
  nimi: string;
  email: string;
  listings: Array<{ id: number; title: string; price: string }>;
}

const SettingsScreen = () => {

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
      
            const response = await fetch(`${getApiUrl()}/api/users/profile/${encodeURIComponent(userEmail)}`, {
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
      
    
        
    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity 
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="arrow-back" size={24} color="#4B5FBD" />
                <Text style={styles.backText}>Back</Text>
            </TouchableOpacity>

            <Text style={styles.title}>Settings</Text>

            <View style={styles.section2}>
                <Text style={styles.sectionTitle}>Personal Information</Text>
              
                <View style={styles.section}>

                <Text style={styles.infoText}>Name</Text>
                <Text style={styles.infoValue}>{userProfile?.nimi || 'Loading...'}</Text>
                </View>
            <View style={styles.section}>

                <Text style={styles.infoText}>Email</Text>
                <Text style={styles.infoValue}>{userProfile?.email || 'Loading...'}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Help Center</Text>
                <TouchableOpacity style={styles.link}>
                    <Text style={styles.linkText}>FAQ</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.link}>
                    <Text style={styles.linkText}>Contact Us</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.link}>
                    <Text style={styles.linkText}>Privacy & Terms</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
    },
    backText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#4B5FBD',
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        marginBottom: 20,
        color: '#4B5FBD',
    },
    section: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#F9F9F9',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.91,
        elevation: 2,
    },
    section2: {
      marginBottom: 20,
        padding: 10,
        borderRadius: 8,
       
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '500',
        marginBottom: 10,
    },
    infoText: {
        fontSize: 16,
        color: '#000',
    },
    infoValue: {
        fontSize: 16,
        color: '#4B5FBD',
        marginBottom: 10,
    },
    link: {
        marginVertical: 10,
    },
    linkText: {
        fontSize: 16,
        color: '#4B5FBD',
    },
});

export default SettingsScreen;