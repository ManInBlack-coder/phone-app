import 'react-native-gesture-handler';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../pages/HomeScreen';
import SignUpScreen from '../pages/SignUpScreen';
import SignInScreen from '../pages/SignInScreen';
import MainScreen from '../pages/main/main';
import ProfileScreen from '../pages/ProfileScreen';
import CreateListingScreen from '../pages/CreateListingScreen';
import ListingDetailScreen from '../pages/ListingDetailScreen';
import { RootStackParamList } from '@/hooks/types';
import MyListingsScreen from '../pages/MyListingsScreen';
import SettingsScreen from '../pages/SettingsScreen';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <Stack.Navigator 
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: 'white',
          height: 10,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          headerLeft: () => null,
          gestureEnabled: false
        }}
      />
      <Stack.Screen 
        name="SignUp" 
        component={SignUpScreen}
      />
      <Stack.Screen 
        name="SignIn" 
        component={SignInScreen}
        options={{
          headerLeft: () => null,
          gestureEnabled: false
        }}
      />
      <Stack.Screen 
        name="Main" 
        component={MainScreen}
        options={{
          headerLeft: () => null,
          gestureEnabled: false
        }}
      />
      <Stack.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="MyListings" 
        component={MyListingsScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="AddListing" 
        component={CreateListingScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="ListingDetail" 
        component={ListingDetailScreen}
        options={{
          headerShown: true,
          headerTransparent: true,
          headerTitle: '',
          headerTintColor: '#000',
        }}
      />
      <Stack.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          headerShown: false
        }}
        />
    </Stack.Navigator>
  );
}