import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Platform,
  ScrollView,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApiUrl } from '../utils/apiUtils';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';


const categories = [
  'Electronics',
  'Furniture',
  'Clothing',
  'Books',
  'Sports',
  'Other'
];

export default function CreateListingScreen() {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [showCategories, setShowCategories] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.3,
    });

    if (!result.canceled && result.assets[0].uri) {
      setImages([...images, result.assets[0].uri]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    try {
      if (!title || !category || !price) {
        alert('Please fill in all required fields');
        return;
      }

      const userEmail = await AsyncStorage.getItem('userEmail');
      if (!userEmail) {
        alert('Please sign in first');
        return;
      }

      const password = await AsyncStorage.getItem('userPassword');
      const sessionId = await AsyncStorage.getItem('sessionId');
      const authHeader = `Basic ${btoa(`${userEmail}:${password}`)}`;

      // Get user_id first
      const userResponse = await fetch(`${getApiUrl()}/api/users/profile/${encodeURIComponent(userEmail)}`, {
        headers: {
          'Authorization': authHeader,
          'Accept': 'application/json',
          ...(sessionId ? { 'Cookie': `JSESSIONID=${sessionId}` } : {})
        }
      });

      if (!userResponse.ok) {
        throw new Error('Failed to get user profile');
      }

      const userData = await userResponse.json();
      
      const formData = new FormData();
      formData.append('title', title);
      formData.append('price', price);
      formData.append('category', category);
      formData.append('description', description);
      formData.append('user_id', userData.id);

      // Append image if exists
      if (images.length > 0) {
        const imageUri = images[0];
        const filename = imageUri.split('/').pop() || 'image.jpg';
        
        // Create file object from URI
        const file = {
          uri: Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri,
          type: 'image/jpeg',
          name: filename
        };

        // Append image with specific field name
        formData.append('image', file as any);
      }

      const response = await fetch(`${getApiUrl()}/api/listings/create`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Accept': 'application/json',
          ...(sessionId ? { 'Cookie': `JSESSIONID=${sessionId}` } : {})
        },
        body: formData
      });

      if (response.ok) {
        alert('Listing created successfully!');
        navigation.goBack();
      } else {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to create listing');
      }
    } catch (error) {
      console.error('Error creating listing:', error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Failed to create listing. Please try again.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#4B5FBD" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create a new listing</Text>
      </View>

      <ScrollView style={styles.form}>
        <Text style={styles.label}>Upload photos</Text>
        <View style={styles.imageContainer}>
          <TouchableOpacity 
            style={styles.addImageButton} 
            onPress={pickImage}
          >
            <Ionicons name="add" size={40} color="#4B5FBD" />
          </TouchableOpacity>
          {images.map((image, index) => (
            <View key={index} style={styles.imageWrapper}>
              <Image source={{ uri: image }} style={styles.image} />
              <TouchableOpacity 
                style={styles.removeImageButton}
                onPress={() => removeImage(index)}
              >
                <Ionicons name="close-circle" size={24} color="#4B5FBD" />
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Listing Title"
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Category</Text>
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowCategories(!showCategories)}
          >
            <Text style={category ? styles.inputText : styles.placeholder}>
              {category || 'Select the category'}
            </Text>
            <Ionicons name="chevron-down" size={24} color="#4B5FBD" />
          </TouchableOpacity>
          {showCategories && (
            <View style={styles.categoryDropdown}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  style={styles.categoryItem}
                  onPress={() => {
                    setCategory(cat);
                    setShowCategories(false);
                  }}
                >
                  <Text style={styles.categoryText}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Price</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter price in USD"
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            placeholder="Tell us more..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 60 : 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  form: {
    flex: 1,
    padding: 24,
  },
  label: {
    fontSize: 16,
    color: '#4B5FBD',
    marginBottom: 8,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#4B5FBD',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 8,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 8,
    marginBottom: 8,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  removeImageButton: {
    position: 'absolute',
    right: -8,
    top: -8,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputText: {
    fontSize: 16,
    color: '#000',
  },
  placeholder: {
    fontSize: 16,
    color: '#999',
  },
  descriptionInput: {
    height: 120,
    textAlignVertical: 'top',
  },
  categoryDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#E8E8E8',
    borderRadius: 8,
    zIndex: 1000,
    elevation: 3,
  },
  categoryItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  categoryText: {
    fontSize: 16,
    color: '#000',
  },
  submitButton: {
    backgroundColor: '#4B5FBD',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 32,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
}); 