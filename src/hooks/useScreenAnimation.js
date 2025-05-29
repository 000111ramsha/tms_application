import { useState, useEffect } from 'react';
import { Animated } from 'react-native';

/**
 * Custom hook for screen entrance animations
 * Provides fade-in + slide-up animation similar to HomeScreen
 * Or fade-only animation for calming transitions
 */
export const useScreenAnimation = (
  duration = { fade: 800, slide: 600 }, 
  animationType = 'fadeAndSlide' // 'fadeAndSlide' or 'fadeOnly'
) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(animationType === 'fadeOnly' ? 0 : 50));

  useEffect(() => {
    if (animationType === 'fadeOnly') {
      // Simple fade-in animation for calming effect
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: duration.fade,
        useNativeDriver: true,
      }).start();
    } else {
      // Original fade + slide animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: duration.fade,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: duration.slide,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [fadeAnim, slideAnim, duration.fade, duration.slide, animationType]);

  // Return animation styles based on type
  const animatedStyle = animationType === 'fadeOnly' 
    ? { opacity: fadeAnim }
    : {
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      };

  return {
    animatedStyle,
    fadeAnim,
    slideAnim,
  };
};

/**
 * Simple fade-only hook for therapeutic, calming transitions
 * Perfect for medical apps where subtle animations are preferred
 */
export const useFadeAnimation = (duration = 400) => {
  return useScreenAnimation({ fade: duration }, 'fadeOnly');
}; 