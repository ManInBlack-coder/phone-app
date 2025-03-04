import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../pages/HomeScreen';
import SignUpScreen from '../pages/SignUpScreen';
import SignInScreen from '../pages/SignInScreen';
import MainScreen from '../pages/main/main';
import { RootStackParamList } from '@/hooks/types';

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="SignIn" component={SignInScreen} />
        <Stack.Screen name="Main" component={MainScreen} /> {/* Add Main screen */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}