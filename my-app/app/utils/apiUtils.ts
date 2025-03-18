// Import necessary libraries
import { Platform } from 'react-native';

// Function to get the API URL
export const getApiUrl = () => {
  // Define the URL based on platform
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    // Example condition to choose IP
    const useFirstIP = true; // Change this condition as needed
    return useFirstIP ? 'http://10.15.16.203:8080' : 'http://172.16.1.149:8080';
  }
  
  // For web platform, use localhost
  return 'http://127.0.0.1:8080';
};  