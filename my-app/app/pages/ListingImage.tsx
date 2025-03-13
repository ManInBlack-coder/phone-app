import React, { useState } from 'react';
import { View, Image, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { getApiUrl } from '../utils/apiUtils';

interface ListingImageProps {
  imageUrl: string | null;
  sessionId: string | null;
}

const ListingImage: React.FC<ListingImageProps> = ({ imageUrl, sessionId }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  if (!imageUrl) {
    return (
      <View style={styles.imagePlaceholder}>
        <ActivityIndicator size="large" color="#4B5FBD" />
      </View>
    );
  }

  // Paranda URL, kui see on vale
  let fixedUrl = imageUrl;
  if (!imageUrl.startsWith('http')) {
    fixedUrl = `${getApiUrl()}${imageUrl}`;
  }

  return (
    <View style={styles.imageContainer}>
      <Image 
        source={{ 
          uri: fixedUrl,
          headers: {
            'Accept': 'image/*',
            ...(sessionId ? { 'Cookie': `JSESSIONID=${sessionId}` } : {})
          }
        }}
        style={styles.image}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        onError={(e) => {
          console.error('Error loading image:', e.nativeEvent.error);
          setError(e.nativeEvent.error);
          setIsLoading(false);
        }}
      />
      {isLoading && (
        <View style={styles.imagePlaceholder}>
          <ActivityIndicator size="large" color="#4B5FBD" />
        </View>
      )}
      {error && !isLoading && (
        <View style={styles.imagePlaceholder}>
          <Text style={styles.errorText}>Failed to load image</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    height: 200, // Võite muuta kõrgust vastavalt vajadusele
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  imagePlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});

export default ListingImage; 