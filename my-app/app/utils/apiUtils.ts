// Import necessary libraries
import { Platform } from 'react-native';

// Function to get the API URL
export const getApiUrl = () => {
  // Define the URL based on platform
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    // For mobile devices, try multiple IP addresses
    try {
      return 'http://10.15.17.10:8080';
    } catch {
      return 'http://192.168.1.71:8080';
    }
  }
  
  // For web platform, use localhost
  return 'http://localhost:8080';
}; 