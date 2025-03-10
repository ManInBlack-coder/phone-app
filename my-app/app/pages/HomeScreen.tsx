import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '@/hooks/types';

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  return (
    <ImageBackground 
      source={require('../../assets/images/Home_background.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>You'll Find</Text>
          <Text style={styles.subtitle}>All you need</Text>
          <Text style={styles.title}>Here!</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.signUpButton} 
              onPress={() => navigation.navigate('SignUp')}
            >
              <Text style={styles.signUpButtonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.signInButton} 
              onPress={() => navigation.navigate('SignIn')}
            >
              <Text style={styles.signInButtonText}>Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 50,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF9F1C',
    textDecorationLine: 'underline',
    textAlign: 'center',
    marginVertical: 5,
  },
  buttonContainer: {
    width: '80%',
    marginTop: 40,
  },
  signUpButton: {
    backgroundColor: '#4B5FBD',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  signUpButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  signInButton: {
    backgroundColor: 'transparent',
    padding: 15,
    borderRadius: 10,
  },
  signInButtonText: {
    color: '#4B5FBD',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
