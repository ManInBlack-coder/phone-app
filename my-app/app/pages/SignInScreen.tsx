import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../hooks/types';
import { Ionicons } from '@expo/vector-icons';
import { getApiUrl } from '../utils/apiUtils';

type SignInScreenNavigationProp = StackNavigationProp<RootStackParamList>;


export default function SignInScreen() {
  const navigation = useNavigation<SignInScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async () => {
    try {
      const response = await fetch(`${getApiUrl()}/api/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      console.log('Profile data:', data);
      console.log('Response headers:', response.headers);

      if (response.ok) {
        const setCookieHeader = response.headers.get('set-cookie');
        console.log('Set-Cookie header:', setCookieHeader);
        
        if (setCookieHeader) {
          const sessionMatch = setCookieHeader.match(/JSESSIONID=([^;]+)/);
          console.log('Session match:', sessionMatch);
          
          if (sessionMatch && sessionMatch[1]) {
            const sessionId = sessionMatch[1];
            console.log('Saving session ID:', sessionId);
            await AsyncStorage.setItem('sessionId', sessionId);
          }
        }

        await AsyncStorage.setItem('userEmail', email);
        await AsyncStorage.setItem('userPassword', password);
        
        // Log token
        const token = data.token || data.accessToken || data.jwt;
        console.log('Token from response:', token);
        
        if (token) {
          console.log('Saving token:', token);
          await AsyncStorage.setItem('token', token);
        } else {
          console.log('No token found in response');
          const authHeader = response.headers.get('Authorization');
          if (authHeader) {
            const tokenMatch = authHeader.match(/Bearer\s+(.+)/);
            if (tokenMatch && tokenMatch[1]) {
              console.log('Saving token from header:', tokenMatch[1]);
              await AsyncStorage.setItem('token', tokenMatch[1]);
            }
          }
        }

        if (data.user) {
          await AsyncStorage.setItem('userId', data.user.id.toString());
          await AsyncStorage.setItem('userEmail', data.user.email);
        } else {
          console.error('User data is undefined');
        }

        navigation.navigate('Main');
        console.log('User authenticated:', data);
      } else {
        setError(data.message || 'Sign in failed');
      }
    } catch (error) {
      setError('Network error');
      console.error('Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#4B5FBD" />
        <Text style={styles.backText}>Sign In</Text>
      </TouchableOpacity>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="example@gmail.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="********"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity 
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons 
                name={showPassword ? "eye-off-outline" : "eye-outline"} 
                size={24} 
                color="#4B5FBD" 
              />
            </TouchableOpacity>
          </View>
        </View>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity 
          style={styles.signInButton}
          onPress={handleSignIn}
        >
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.signUpContainer}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.signUpText}>
            Don't have an account? <Text style={styles.link}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
  },
  backText: {
    fontSize: 20,
    fontWeight: '600',
    marginLeft: 8,
    color: '#4B5FBD',
  },
  form: {
    flex: 1,
    padding: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#4B5FBD',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  error: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
  signInButton: {
    backgroundColor: '#4B5FBD',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  signInButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  signUpContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  signUpText: {
    fontSize: 14,
    color: '#666',
  },
  link: {
    color: '#4B5FBD',
    fontWeight: '500',
  },
});