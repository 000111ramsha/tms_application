import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';
import Fonts from '../constants/Fonts';

const SubmitButton = ({ 
  onPress, 
  title = "SUBMIT", 
  isPressed = false, 
  onPressIn, 
  onPressOut,
  isSubmitting = false,
  disabled = false,
  icon = "send",
  style = {} 
}) => {
  return (
    <TouchableOpacity 
      style={[
        styles.submitButton,
        isPressed && styles.submitButtonPressed,
        (isSubmitting || disabled) && styles.submitButtonDisabled,
        style
      ]}
      onPress={onPress}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      activeOpacity={1}
      disabled={disabled || isSubmitting}
    >
      <Text style={[
        styles.submitButtonText,
        isPressed && styles.submitButtonTextPressed,
        (isSubmitting || disabled) && styles.submitButtonTextDisabled
      ]}>
        {isSubmitting ? "SUBMITTING..." : title}
      </Text>
      {!isSubmitting && (
        <Ionicons 
          name={icon} 
          size={18} 
          color={isPressed ? Colors.white : Colors.white} 
          style={styles.submitButtonIcon} 
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: Layout.borderRadius.medium,
    paddingVertical: 14, // Standardized vertical padding
    paddingHorizontal: 24, // Standardized horizontal padding  
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Layout.spacing.large,
    marginBottom: Layout.spacing.xlarge,
    minHeight: 48, // Consistent minimum height
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: Colors.white,
    fontWeight: Fonts.weights.bold,
    fontSize: Fonts.sizes.regular,
    letterSpacing: 1,
    marginRight: 8,
  },
  submitButtonIcon: {
    marginLeft: 0,
  },
  submitButtonPressed: {
    backgroundColor: Colors.secondary,
  },
  submitButtonTextPressed: {
    color: Colors.white,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.darkGray,
    opacity: 0.7,
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonTextDisabled: {
    color: Colors.white,
  },
});

export default SubmitButton; 