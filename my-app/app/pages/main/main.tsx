import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import ProfileScreen from '../ProfileScreen';
import { RootStackParamList } from '@/hooks/types';

const Tab = createBottomTabNavigator();

const HomeTab = () => (
  <View style={styles.container}>
    <Text style={styles.text}>Welcome to the Main Screen!</Text>
  </View>
);

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

          if (route.name === 'HomeTab') {
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
        name="HomeTab" 
        component={HomeTab}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});