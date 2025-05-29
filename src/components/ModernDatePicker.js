import React, { useState, useCallback } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Platform,
  Modal,
  Pressable,
  Animated
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

// Import constants
import Colors from '../constants/Colors';
import Fonts from '../constants/Fonts';
import Layout from '../constants/Layout';

/**
 * Modern Date Picker Component
 * 
 * Features:
 * - Sleek modern design
 * - Prevents selection of current date and past dates
 * - Cross-platform compatibility (iOS/Android)
 * - Smooth animations
 * - Error state handling
 * - Accessibility support
 */
const ModernDatePicker = ({
  value,
  onDateChange,
  placeholder = "Select Date",
  error = "",
  style = {},
  disabled = false,
  minimumDate = null, // Will be set to tomorrow by default
  maximumDate = null,
  onFocus = () => {},
  onBlur = () => {},
  placeholderTextColor = "#bdbdbd", // Default to HomeScreen color
  textColor = "#222", // Default text color
  ...props
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));

  // Set minimum date to tomorrow (users cannot select today or past dates)
  const getMinimumDate = useCallback(() => {
    if (minimumDate) return minimumDate;
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return tomorrow;
  }, [minimumDate]);

  // Set maximum date to 1 year from now if not specified
  const getMaximumDate = useCallback(() => {
    if (maximumDate) return maximumDate;
    
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
    return oneYearFromNow;
  }, [maximumDate]);

  // Format date for display
  const formatDate = useCallback((date) => {
    if (!date) return '';
    
    const options = { 
      weekday: 'short',
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return date.toLocaleDateString('en-US', options);
  }, []);

  // Handle date selection
  const handleDateChange = useCallback((event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    
    if (event.type === 'set' && selectedDate) {
      // Ensure selected date is not today or in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const selected = new Date(selectedDate);
      selected.setHours(0, 0, 0, 0);
      
      if (selected <= today) {
        // Don't allow selection of today or past dates
        return;
      }
      
      onDateChange(selectedDate);
      onBlur();
    }
    
    if (Platform.OS === 'ios' && event.type === 'dismissed') {
      setShowPicker(false);
      onBlur();
    }
  }, [onDateChange, onBlur]);

  // Handle picker open
  const handlePress = useCallback(() => {
    if (disabled) return;
    
    setIsPressed(true);
    onFocus();
    
    if (Platform.OS === 'ios') {
      // Animate modal appearance
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
    
    setShowPicker(true);
    
    // Reset pressed state after animation
    setTimeout(() => setIsPressed(false), 150);
  }, [disabled, onFocus, fadeAnim]);

  // Handle iOS modal close
  const handleIOSModalClose = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setShowPicker(false);
      onBlur();
    });
  }, [fadeAnim, onBlur]);

  // Render iOS Modal
  const renderIOSModal = () => (
    <Modal
      transparent
      visible={showPicker}
      animationType="none"
      onRequestClose={handleIOSModalClose}
    >
      <Animated.View 
        style={[styles.modalOverlay, { opacity: fadeAnim }]}
      >
        <Pressable 
          style={styles.modalBackdrop} 
          onPress={handleIOSModalClose}
        />
        <Animated.View 
          style={[
            styles.modalContent,
            {
              transform: [{
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [300, 0],
                })
              }]
            }
          ]}
        >
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={handleIOSModalClose}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Date</Text>
            <TouchableOpacity 
              onPress={handleIOSModalClose}
              style={styles.modalDoneButton}
            >
              <Text style={styles.modalDoneText}>Done</Text>
            </TouchableOpacity>
          </View>
          
          <DateTimePicker
            value={value || getMinimumDate()}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
            minimumDate={getMinimumDate()}
            maximumDate={getMaximumDate()}
            style={styles.iosDatePicker}
          />
        </Animated.View>
      </Animated.View>
    </Modal>
  );

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={[
          styles.dateInput,
          style && styles.dateInputNoMargin, // Remove margin when custom style is provided
          error ? styles.dateInputError : null,
          disabled ? styles.dateInputDisabled : null,
          isPressed ? styles.dateInputPressed : null,
        ]}
        onPress={handlePress}
        disabled={disabled}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={value ? `Selected date: ${formatDate(value)}` : placeholder}
        accessibilityHint="Tap to select a date"
        {...props}
      >
        <View style={styles.dateInputContent}>
          <Text 
            style={[
              styles.dateText,
              { color: value ? textColor : placeholderTextColor },
              disabled && styles.disabledText,
            ]}
            numberOfLines={1}
          >
            {value ? formatDate(value) : placeholder}
          </Text>
          <Ionicons 
            name="calendar-outline" 
            size={20} 
            color={disabled ? Colors.darkGray : Colors.primary} 
            style={styles.calendarIcon}
          />
        </View>
      </TouchableOpacity>

      {error ? (
        <View style={[styles.errorContainer, style && styles.errorContainerNoMargin]}>
          <Ionicons name="alert-circle" size={16} color={Colors.error} style={styles.errorIcon} />
          <Text style={styles.errorMessage}>{error}</Text>
        </View>
      ) : null}

      {/* Android Date Picker */}
      {Platform.OS === 'android' && showPicker && (
        <DateTimePicker
          value={value || getMinimumDate()}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={getMinimumDate()}
          maximumDate={getMaximumDate()}
        />
      )}

      {/* iOS Modal Date Picker */}
      {Platform.OS === 'ios' && renderIOSModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 0, // Let parent handle spacing
  },
  dateInput: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: Layout.borderRadius.medium,
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontSize: Fonts.sizes.medium,
    marginBottom: 16,
  },
  dateInputNoMargin: {
    marginBottom: 0,
  },
  dateInputError: {
    borderColor: Colors.error,
  },
  dateInputDisabled: {
    backgroundColor: Colors.lightGray,
    opacity: 0.6,
  },
  dateInputPressed: {
    backgroundColor: '#f8f9fa',
    transform: [{ scale: 0.98 }],
  },
  dateInputContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  calendarIcon: {
    marginLeft: 8,
  },
  dateText: {
    flex: 1,
    fontSize: Fonts.sizes.medium,
  },

  disabledText: {
    color: Colors.darkGray,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingHorizontal: 4,
  },
  errorContainerNoMargin: {
    marginTop: 6,
    marginBottom: 0,
  },
  errorIcon: {
    marginRight: 6,
  },
  errorMessage: {
    color: Colors.error,
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
  },
  
  // iOS Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34, // Safe area padding for iOS
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  modalTitle: {
    fontSize: Fonts.sizes.large,
    fontWeight: Fonts.weights.bold,
    color: Colors.text,
  },
  modalCloseButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  modalCloseText: {
    fontSize: Fonts.sizes.medium,
    color: Colors.gray,
    fontWeight: Fonts.weights.medium,
  },
  modalDoneButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  modalDoneText: {
    fontSize: Fonts.sizes.medium,
    color: Colors.primary,
    fontWeight: Fonts.weights.bold,
  },
  iosDatePicker: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
  },
});

export default ModernDatePicker; 