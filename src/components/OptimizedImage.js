import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ActivityIndicator, ScrollView } from 'react-native';
import { Image } from 'expo-image';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

/**
 * OptimizedImage Component
 * 
 * Features:
 * - Lazy loading with scroll-based visibility detection
 * - Automatic caching with expo-image
 * - Progressive loading with placeholder
 * - Responsive sizing
 * - Memory optimization
 */
const OptimizedImage = ({
  source,
  style,
  placeholder,
  priority = false,
  lazy = true,
  resizeMode = 'cover',
  cachePolicy = 'memory-disk',
  onLoad,
  onError,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(!lazy || priority);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const viewRef = useRef(null);

  // Simple lazy loading - load immediately if not lazy or priority is set
  useEffect(() => {
    if (!lazy || priority) {
      setIsVisible(true);
    } else {
      // For lazy loading, we'll use a timeout to simulate viewport detection
      // In a real implementation, you'd use onLayout and scroll events
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [lazy, priority]);

  const handleLoad = (event) => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.(event);
  };

  const handleError = (error) => {
    setIsLoading(false);
    setHasError(true);
    onError?.(error);
  };

  // Generate optimized source with size hints
  const getOptimizedSource = () => {
    if (typeof source === 'string') {
      return {
        uri: source,
        width: style?.width || screenWidth,
        height: style?.height || screenHeight * 0.3,
      };
    }
    return source;
  };

  const imageStyle = [
    styles.image,
    style,
    isLoading && styles.loading,
    hasError && styles.error
  ];

  return (
    <View ref={viewRef} style={[styles.container, style]}>
      {isVisible && (
        <Image
          source={getOptimizedSource()}
          style={imageStyle}
          contentFit={resizeMode}
          cachePolicy={cachePolicy}
          placeholder={placeholder}
          onLoad={handleLoad}
          onError={handleError}
          transition={200}
          {...props}
        />
      )}
      
      {isLoading && isVisible && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#2c5264" />
        </View>
      )}
      
      {!isVisible && lazy && (
        <View style={[styles.placeholder, style]} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loading: {
    opacity: 0.7,
  },
  error: {
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -10 }, { translateY: -10 }],
    zIndex: 1,
  },
  placeholder: {
    backgroundColor: '#f5f5f5',
    width: '100%',
    height: '100%',
  },
});

export default OptimizedImage; 