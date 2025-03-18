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
import MyListingsScreen from '../pages/MyListingsScreen';
import SettingsScreen from '../pages/SettingsScreen';

// Deklareeri RootStackParamList siin
export type RootStackParamList = {
    Home: undefined;
    SignUp: undefined;
    SignIn: undefined;
    Main: undefined;
    Profile: undefined;
    MyListings: undefined;
    AddListing: undefined; // Veendu, et see on olemas
    ListingDetail: { id: string }; // Veendu, et see on olemas
    Settings: undefined;
    CreateListing: undefined;
};

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
        headerShown: false
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
        name="CreateListing" 
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
          headerTransparent: false,
          headerTitle: '',
          headerTintColor: '#000000',
          headerStyle: {
            elevation: 4,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            height: 100,
            borderBottomWidth: 1, 
            borderBottomColor: '#000000',
          },
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