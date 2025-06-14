import React, { useState, useRef } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image, Alert, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image as ExpoImage } from "expo-image";
import FormSubmissionService from "../src/services/FormSubmissionService";

// Import validation
import { FormValidator } from "../src/utils/formValidation";

// Import components
import AppBar from "../src/components/AppBar";
import SubmitButton from "../src/components/SubmitButton";
import LoadingOverlay from "../src/components/LoadingOverlay";
import SuccessModal from "../src/components/SuccessModal";

// Import context
import { useScrollViewPadding } from "../src/context/BottomNavContext";

// Import hooks
import { useScreenAnimation } from "../src/hooks/useScreenAnimation";

// Import constants
import Colors from "../src/constants/Colors";
import Fonts from "../src/constants/Fonts";
import Layout from "../src/constants/Layout";
import Spacing from "../src/constants/Spacing";

const medicalConditions = [
  'ASTHMA', 'HEADACHE', 'HEART DISEASE', 'APPETITE PROBLEMS', 'WEIGHT LOSS/GAIN',
  'SLEEP DIFFICULTY', 'ANXIETY', 'STOMACH TROUBLE', 'CONSTIPATION', 'GLAUCOMA',
  'AIDS/HIV', 'HEPATITIS', 'THYROID DISEASE', 'SYPHILIS', 'SEIZURES',
  'GONORRHEA', 'TB', 'HIGH BLOOD PRESSURE', 'DIABETES', 'DRINKING PROBLEMS',
  'SUBSTANCE ABUSE', 'FATIGUE', 'LOSS OF CONCENTRATION', 'RECURRENT THOUGHTS', 'SEXUAL PROBLEMS'
];

const MedicalHistoryScreen = () => {
  const router = useRouter();
  const scrollViewPadding = useScrollViewPadding();
  const { animatedStyle } = useScreenAnimation();
  
  const [formData, setFormData] = useState({
    medicalConditions: {},
    suicidalThoughts: '',
    attempts: '',
    suicidalExplanation: '',
    previousPsychiatrist: '',
    psychiatricHospitalizations: '',
    legalCharges: '',
    legalExplanation: '',
    allergies: '',
    familyHistory: '',
    signature: ''
  });
  
  const [isSubmitPressed, setIsSubmitPressed] = useState(false);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Create refs for each section
  const sectionRefs = {
    medicalConditionsSection: useRef(null),
    suicidalHistorySection: useRef(null),
    allergiesSection: useRef(null),
    familyHistorySection: useRef(null),
    signatureSection: useRef(null)
  };

  // Add scrollView ref
  const scrollViewRef = useRef(null);

  // Helper function to get section ref based on field name
  const getSectionRef = (fieldName) => {
    const sectionMap = {
      // Medical Conditions fields
      medicalConditions: 'medicalConditionsSection',
      
      // Suicidal History fields
      suicidalThoughts: 'suicidalHistorySection',
      attempts: 'suicidalHistorySection',
      suicidalExplanation: 'suicidalHistorySection',
      
      // Allergies fields
      allergies: 'allergiesSection',
      
      // Family History fields
      familyHistory: 'familyHistorySection',
      
      // Signature fields
      signature: 'signatureSection'
    };

    return sectionRefs[sectionMap[fieldName]];
  };

  const handleConditionChange = (condition, checked) => {
    setFormData(prev => ({
      ...prev,
      medicalConditions: {
        ...prev.medicalConditions,
        [condition]: checked
      }
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDropdownSelect = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setOpenDropdownIndex(null);
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    try {
      setShowErrors(true);

      // Validate form data
      const errors = {};

      // Validate medical conditions
      if (!formData.medicalConditions || Object.keys(formData.medicalConditions).length === 0) {
        errors.medicalConditions = "Please select at least one medical condition or mark 'None'";
      }

      // Validate suicidal history
      if (!formData.suicidalThoughts) {
        errors.suicidalThoughts = "Please indicate if you have had suicidal thoughts";
      }
      if (!formData.attempts) {
        errors.attempts = "Please indicate if you have had any attempts";
      }
      if (formData.suicidalThoughts === 'Yes' && !formData.suicidalExplanation) {
        errors.suicidalExplanation = "Please provide details about your suicidal thoughts";
      }
      if (formData.attempts === 'Yes' && !formData.suicidalExplanation) {
        errors.suicidalExplanation = "Please provide details about your attempts";
      }

      // Validate allergies
      if (!formData.allergies) {
        errors.allergies = "Please list any allergies or indicate 'None'";
      }

      // Validate family history
      if (!formData.familyHistory) {
        errors.familyHistory = "Please provide family medical history or indicate 'None'";
      }

      // Validate signature
      if (!formData.signature) {
        errors.signature = "Please provide your signature to authorize this form";
      }

      if (Object.keys(errors).length > 0) {
        setValidationErrors(errors);
        const firstError = Object.values(errors)[0];
        Alert.alert(
          "Validation Error",
          firstError,
          [
            {
              text: "OK",
              onPress: () => {
                // Scroll to the first error
                const firstErrorField = Object.keys(errors)[0];
                const sectionRef = getSectionRef(firstErrorField);
                if (sectionRef && sectionRef.current && scrollViewRef.current) {
                  sectionRef.current.measureLayout(
                    scrollViewRef.current,
                    (x, y) => {
                      scrollViewRef.current.scrollTo({ y, animated: true });
                    },
                    () => console.log('Failed to measure layout')
                  );
                }
              }
            }
          ]
        );
        return;
      }

      // Clear validation errors and start submission
      setValidationErrors({});
      setIsSubmitting(true);

      // Submit medical history using the service
      const result = await FormSubmissionService.submitMedicalHistory(formData);

      if (!result.success) {
        throw new Error(result.error || 'Failed to submit medical history');
      }

      // Show success modal
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error saving medical history:', error);
      Alert.alert(
        "Error",
        error.message || "Failed to save medical history. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.back();
  };

  const handleGoBack = () => {
    router.back();
  };

  const renderDropdown = (field, options, placeholder) => {
    const isOpen = openDropdownIndex === field;
    const selectedValue = formData[field];
    const displayText = selectedValue || placeholder;
    
    return (
      <View style={styles.dropdownContainer}>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setOpenDropdownIndex(isOpen ? null : field)}
        >
          <Text style={[styles.dropdownText, !selectedValue && styles.placeholderText]}>
            {displayText}
          </Text>
          <Ionicons 
            name={isOpen ? "chevron-up" : "chevron-down"} 
            size={20} 
            color={Colors.primary} 
            style={{ marginLeft: 8 }} 
          />
        </TouchableOpacity>
        
        {isOpen && (
          <ScrollView style={styles.dropdownOptions} nestedScrollEnabled={true}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.dropdownOption,
                  index === options.length - 1 && styles.lastDropdownOption
                ]}
                onPress={() => handleDropdownSelect(field, option.value)}
              >
                <Text style={styles.dropdownOptionText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    );
  };

  const yesNoOptions = [
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" }
  ];

  return (
    <AppBar>
      <SafeAreaView style={styles.container}>
        <ScrollView 
          ref={scrollViewRef}
          contentContainerStyle={scrollViewPadding}
        >
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <ExpoImage source={require("../assets/new-patient-hero.jpg")} style={styles.heroImage} />
            <View style={styles.heroOverlay}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={handleGoBack}
              >
                <Ionicons name="arrow-back" size={24} color={Colors.white} />
              </TouchableOpacity>
              <Text style={styles.heroTitle}>MEDICAL{'\n'}HISTORY</Text>
            </View>
          </View>

          {/* Form Content */}
          <View style={styles.formContainer}>
            {/* Medical Conditions Section */}
            <View ref={sectionRefs.medicalConditionsSection} style={styles.section}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="fitness" size={20} color={Colors.primary} style={styles.sectionIcon} />
                <Text style={styles.sectionTitle}>Medical Conditions</Text>
              </View>
              <Text style={styles.instructionText}>Please check if you have a history of:</Text>
              
              <View style={styles.conditionsGrid}>
                {medicalConditions.map((condition, index) => (
                  <TouchableOpacity
                    key={condition}
                    style={styles.checkboxRow}
                    onPress={() => handleConditionChange(condition, !formData.medicalConditions[condition])}
                  >
                    <View style={[
                      styles.checkbox,
                      formData.medicalConditions[condition] && styles.checkboxChecked
                    ]}>
                      {formData.medicalConditions[condition] && (
                        <Ionicons name="checkmark" size={16} color={Colors.white} />
                      )}
                    </View>
                    <Text style={styles.checkboxLabel}>{condition}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Suicidal History Section */}
            <View ref={sectionRefs.suicidalHistorySection} style={styles.section}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="alert-circle" size={20} color={Colors.primary} style={styles.sectionIcon} />
                <Text style={styles.sectionTitle}>Suicidal History</Text>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Have you had suicidal thoughts? *</Text>
                {renderDropdown('suicidalThoughts', yesNoOptions, 'Select Yes/No')}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Attempts? *</Text>
                {renderDropdown('attempts', yesNoOptions, 'Select Yes/No')}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Please explain:</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={formData.suicidalExplanation}
                  onChangeText={(value) => handleInputChange('suicidalExplanation', value)}
                  placeholder="Please provide details if applicable"
                  placeholderTextColor="#666666"
                  multiline={true}
                  numberOfLines={4}
                />
              </View>
            </View>

            {/* Psychiatric History Section */}
            <View style={styles.section}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="pulse" size={20} color={Colors.primary} style={styles.sectionIcon} />
                <Text style={styles.sectionTitle}>Psychiatric History</Text>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Previous Psychiatrist(s) or Therapist:</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={formData.previousPsychiatrist}
                  onChangeText={(value) => handleInputChange('previousPsychiatrist', value)}
                  placeholder="List previous mental health providers"
                  placeholderTextColor="#666666"
                  multiline={true}
                  numberOfLines={3}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Psychiatric hospitalizations (Date, Hospital, Location and Treatment):</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={formData.psychiatricHospitalizations}
                  onChangeText={(value) => handleInputChange('psychiatricHospitalizations', value)}
                  placeholder="List any psychiatric hospitalizations with details"
                  placeholderTextColor="#666666"
                  multiline={true}
                  numberOfLines={4}
                />
              </View>
            </View>

            {/* Other Section */}
            <View style={styles.section}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="information-circle" size={20} color={Colors.primary} style={styles.sectionIcon} />
                <Text style={styles.sectionTitle}>Other</Text>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>History of Legal Charges:</Text>
                {renderDropdown('legalCharges', yesNoOptions, 'Select Yes/No')}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Please explain:</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={formData.legalExplanation}
                  onChangeText={(value) => handleInputChange('legalExplanation', value)}
                  placeholder="Please provide details if applicable"
                  placeholderTextColor="#666666"
                  multiline={true}
                  numberOfLines={3}
                />
              </View>
            </View>

            {/* Allergies Section */}
            <View ref={sectionRefs.allergiesSection} style={styles.section}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="medical" size={20} color={Colors.primary} style={styles.sectionIcon} />
                <Text style={styles.sectionTitle}>Allergies</Text>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Allergies *</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={formData.allergies}
                  onChangeText={(value) => handleInputChange('allergies', value)}
                  placeholder="List any allergies or indicate 'None'"
                  placeholderTextColor="#666666"
                  multiline={true}
                  numberOfLines={4}
                />
                {validationErrors.allergies && showErrors && (
                  <Text style={styles.errorText}>{validationErrors.allergies}</Text>
                )}
              </View>
            </View>

            {/* Family History Section */}
            <View ref={sectionRefs.familyHistorySection} style={styles.section}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="people" size={20} color={Colors.primary} style={styles.sectionIcon} />
                <Text style={styles.sectionTitle}>Family History</Text>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Family Medical History: *</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={formData.familyHistory}
                  onChangeText={(value) => handleInputChange('familyHistory', value)}
                  placeholder="List family medical history"
                  placeholderTextColor="#666666"
                  multiline={true}
                  numberOfLines={4}
                />
              </View>
            </View>

            {/* Authorization Section */}
            <View style={styles.section}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="document-text" size={20} color={Colors.primary} style={styles.sectionIcon} />
                <Text style={styles.sectionTitle}>Authorization</Text>
              </View>
              
              <Text style={styles.authorizationText}>
                I hereby authorize Emerald Coast Psychiatric Care, P.A. to furnish insurance carriers with information concerning my illness and assign to the doctor all payments for medical services rendered. I understand I am financially responsible for all charges whether or not covered by insurance.
              </Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Signature of responsible party: *</Text>
                <TextInput
                  style={[
                    styles.textInput,
                    validationErrors.signature && showErrors && styles.textInputError
                  ]}
                  value={formData.signature}
                  onChangeText={(value) => handleInputChange('signature', value)}
                  placeholder="Enter your full name to sign this form"
                  placeholderTextColor="#666666"
                />
                {validationErrors.signature && showErrors && (
                  <Text style={styles.errorText}>{validationErrors.signature}</Text>
                )}
              </View>
            </View>

            {/* Submit Button */}
            <SubmitButton
              onPress={handleSubmit}
              onPressIn={() => setIsSubmitPressed(true)}
              onPressOut={() => setIsSubmitPressed(false)}
              isPressed={isSubmitPressed}
              title="SUBMIT"
              icon="send"
            />
          </View>
        </ScrollView>

        {/* Loading Overlay */}
        <LoadingOverlay
          visible={isSubmitting}
          message="Submitting medical history..."
        />

        {/* Success Modal */}
        <SuccessModal
          visible={showSuccessModal}
          title="Medical History Submitted!"
          message="Your medical history has been successfully submitted."
          onClose={handleSuccessModalClose}
          buttonText="Continue"
        />
      </SafeAreaView>
    </AppBar>
  );
};

export default MedicalHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  heroSection: {
    height: 220,
    position: "relative",
    marginBottom: Layout.spacing.large,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.heroOverlay,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Layout.spacing.xxlarge,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 1,
    padding: 8,
  },
  heroTitle: {
    fontSize: Fonts.sizes.xlarge,
    fontWeight: Fonts.weights.bold,
    color: Colors.overlayText,
    letterSpacing: 1,
    textAlign: "center",
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  formContainer: {
    marginHorizontal: Layout.spacing.large,
    marginTop: 0,
    marginBottom: Spacing.SECTION_TO_SECTION,
  },
  section: {
    backgroundColor: '#f8f9fa',
    borderRadius: 0,
    padding: Layout.spacing.large,
    marginBottom: Spacing.SECTION_TO_SECTION,
    shadowColor: Colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.large,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
    paddingBottom: 12,
  },
  sectionIcon: {
    marginRight: Layout.spacing.medium,
  },
  sectionTitle: {
    fontSize: Fonts.sizes.large,
    fontWeight: Fonts.weights.bold,
    color: Colors.primary,
  },
  instructionText: {
    fontSize: Fonts.sizes.regular,
    color: Colors.text,
    marginBottom: Layout.spacing.medium,
    fontWeight: Fonts.weights.medium,
  },
  inputGroup: {
    marginBottom: Layout.spacing.large,
  },
  label: {
    fontSize: Fonts.sizes.regular,
    fontWeight: Fonts.weights.bold,
    color: '#000000',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: Layout.borderRadius.medium,
    padding: 14,
    fontSize: Fonts.sizes.regular,
    color: '#000000',
    backgroundColor: Colors.white,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  conditionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
  },
  checkboxLabel: {
    fontSize: Fonts.sizes.small,
    color: '#000000',
    fontWeight: Fonts.weights.medium,
    flex: 1,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: Layout.borderRadius.medium,
    backgroundColor: Colors.white,
  },
  dropdown: {
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownText: {
    fontSize: Fonts.sizes.regular,
    color: '#000000',
    flex: 1,
  },
  placeholderText: {
    color: '#666666',
  },
  dropdownOptions: {
    maxHeight: 150,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: Layout.borderRadius.medium,
    marginTop: 4,
    overflow: 'hidden',
  },
  dropdownOption: {
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  lastDropdownOption: {
    borderBottomWidth: 0,
  },
  dropdownOptionText: {
    fontSize: Fonts.sizes.regular,
    color: '#000000',
  },
  authorizationText: {
    fontSize: Fonts.sizes.regular,
    color: Colors.text,
    marginBottom: Layout.spacing.medium,
    lineHeight: 20,
    fontStyle: 'italic',
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: Layout.borderRadius.medium,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  errorText: {
    fontSize: Fonts.sizes.small,
    color: Colors.error,
    marginTop: 4,
  },
  textInputError: {
    borderColor: Colors.error,
  },
}); 