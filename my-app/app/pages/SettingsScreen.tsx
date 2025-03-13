import React from 'react';
import { View, Text,TouchableOpacity,Platform,StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const SettingsScreen = () => {
    const navigation = useNavigation();
    return (
        <View>
             <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#4B5FBD" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
            <Text>Settings</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingTop: Platform.OS === 'ios' ? 60 : 16,
      },
      backText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#4B5FBD',
      },
})

export default SettingsScreen;