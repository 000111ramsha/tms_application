import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import OptimizedImage from './OptimizedImage';

// Import constants
import Colors from '../constants/Colors';
import Fonts from '../constants/Fonts';
import Layout from '../constants/Layout';

/**
 * Reusable Take Control Section Component
 * Used across multiple screens for consistent CTA section
 */
const TakeControlSection = ({ 
  title = "Take Control Of",
  subtitle = "Your Depression",
  description = "Reclaim your life with TMS therapy. Schedule a consultation with our experienced team at TMS of Emerald Coast to discuss your treatment options and start your journey to recovery.",
  buttonText = "CONTACT US",
  onPress,
  imageSource = require("../../assets/depression.png"),
  style = {}
}) => {
  const router = useRouter();
  const [isPressed, setIsPressed] = useState(false);

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push("/contact");
    }
  };

  return (
    <View style={[styles.takeControlSection, style]}>
      <Text style={styles.takeControlTitle}>{title}</Text>
      <Text style={styles.takeControlSubtitle}>{subtitle}</Text>
      <Text style={styles.takeControlText}>{description}</Text>
      <TouchableOpacity 
        style={[
          styles.takeControlButton, 
          isPressed && styles.takeControlButtonPressed
        ]} 
        onPress={handlePress}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        activeOpacity={1}
      >
        <Text style={[
          styles.takeControlButtonText,
          isPressed && styles.takeControlButtonTextPressed
        ]}>
          {buttonText}
        </Text>
        <Ionicons 
          name="arrow-forward" 
          size={18} 
          color={isPressed ? Colors.white : Colors.primary} 
          style={styles.takeControlButtonIcon} 
        />
      </TouchableOpacity>
      <View style={styles.takeControlImageWrapper}>
        <OptimizedImage 
          source={imageSource} 
          style={styles.takeControlImage} 
          resizeMode="cover"
          lazy={true}
          priority={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  takeControlSection: {
    backgroundColor: Colors.primary,
    borderRadius: Layout.borderRadius.xxlarge,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 0,
    alignItems: 'center',
  },
  takeControlTitle: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: Fonts.weights.bold,
    textAlign: 'center',
    marginBottom: 0,
  },
  takeControlSubtitle: {
    color: Colors.overlayTextAccent, // This is '#4db3c9' - light blue/cyan color
    fontSize: 24,
    fontWeight: Fonts.weights.bold,
    textAlign: 'center',
    marginBottom: 18,
    marginTop: 0,
  },
  takeControlText: {
    color: Colors.white,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 24,
    marginHorizontal: 8,
  },
  takeControlButton: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.xxlarge,
    paddingVertical: 12,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
    marginTop: 0,
  },
  takeControlButtonText: {
    color: Colors.primary,
    fontWeight: Fonts.weights.bold,
    fontSize: 15,
    marginRight: 8,
  },
  takeControlButtonIcon: {
    marginLeft: 0,
  },
  takeControlButtonPressed: {
    backgroundColor: Colors.black,
  },
  takeControlButtonTextPressed: {
    color: Colors.white,
  },
  takeControlImageWrapper: {
    width: '100%',
    backgroundColor: '#e5e7eb',
    borderRadius: Layout.borderRadius.large,
    alignItems: 'center',
    marginTop: 0,
  },
  takeControlImage: {
    width: '100%',
    height: 140,
    borderRadius: Layout.borderRadius.large,
  },
});

export default TakeControlSection; 