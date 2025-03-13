// Import necessary libraries
import { Platform } from 'react-native';

// Function to get the API URL
export const getApiUrl = () => {
  // Define the URL based on platform
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    // Example condition to choose IP
    const useFirstIP = true; // Change this condition as needed
    return useFirstIP ? 'http://192.168.1.71:8080' : 'http://10.15.17.10:8080';
  }
  
  // For web platform, use localhost
  return 'http://127.0.0.1:8080';
}; 