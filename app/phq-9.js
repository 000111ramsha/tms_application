import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image, Alert } from "react-native";
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

const phqQuestions = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself — or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
  "Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead or of hurting yourself in some way"
];

// All PHQ-9 questions have the same options
const phqOptions = [
  { label: "0. Not at all", value: "0" },
  { label: "1. Several days", value: "1" },
  { label: "2. More than half the days", value: "2" },
  { label: "3. Nearly every day", value: "3" }
];

const PHQ9Screen = () => {
  const router = useRouter();
  const scrollViewPadding = useScrollViewPadding();
  const { animatedStyle } = useScreenAnimation();
  const scrollViewRef = useRef(null);
  
  const [formData, setFormData] = useState({
    responses: {}
  });

  const [isSubmitPressed, setIsSubmitPressed] = useState(false);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Calculate total score
  const calculateTotalScore = () => {
    let total = 0;
    for (let i = 0; i < phqQuestions.length; i++) {
      const response = formData.responses[i];
      if (response) {
        total += parseInt(response);
      }
    }
    return total;
  };

  const handleResponseChange = (questionIndex, value) => {
    setFormData(prev => ({
      ...prev,
      responses: {
        ...prev.responses,
        [questionIndex]: value
      }
    }));

    // Clear validation errors when user makes a selection
    if (validationErrors.responses) {
      setValidationErrors(prev => ({
        ...prev,
        responses: ''
      }));
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    try {
      setShowErrors(true);

      // Validate responses using FormValidator
      const validation = FormValidator.validateAssessmentResponses(formData.responses, phqQuestions.length);

      if (!validation.isValid) {
        setValidationErrors({ responses: validation.error });
        
        // Scroll to the first unanswered question
        if (validation.unansweredQuestions.length > 0) {
          const firstUnansweredIndex = validation.unansweredQuestions[0] - 1;
          const questionRef = questionRefs.current[firstUnansweredIndex];
          if (questionRef && scrollViewRef.current) {
            questionRef.measureLayout(
              scrollViewRef.current,
              (x, y) => {
                scrollViewRef.current.scrollTo({ y, animated: true });
              },
              () => console.log('Failed to measure layout')
            );
          }
        }

        Alert.alert(
          "Validation Error",
          validation.error,
          [{ text: "OK" }]
        );
        return;
      }

      // Clear validation errors and start submission
      setValidationErrors({});
      setIsSubmitting(true);

      const totalScore = calculateTotalScore();

      // Submit PHQ-9 screening using the new service
      const result = await FormSubmissionService.submitPHQ9Screening({
        totalScore: totalScore,
        responses: formData.responses
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      // Show success modal
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error saving PHQ-9 responses:', error);
      Alert.alert("Error", "Failed to save PHQ-9 screening. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Create refs for each question
  const questionRefs = useRef([]);

  // Initialize refs array
  useEffect(() => {
    questionRefs.current = questionRefs.current.slice(0, phqQuestions.length);
  }, []);

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    router.back();
  };

  const handleGoBack = () => {
    router.back();
  };

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
              <Text style={styles.heroTitle}>PATIENT HEALTH{'\n'}QUESTIONNAIRE{'\n'}(PHQ - 9)</Text>
            </View>
          </View>

          {/* Form Content */}
          <View style={styles.formContainer}>
            {/* PHQ-9 Questions */}
            <View style={styles.questionsSection}>
              {phqQuestions.map((question, index) => {
                const isSelected = formData.responses[index];
                const isOpen = openDropdownIndex === index;
                const selectedOption = phqOptions.find(opt => opt.value === isSelected);
                const displayText = selectedOption ? selectedOption.label : "Select";
                
                return (
                  <View 
                    key={index} 
                    ref={el => questionRefs.current[index] = el}
                    style={[
                      styles.questionCard,
                      validationErrors.responses && showErrors && !formData.responses[index] && styles.questionCardError
                    ]}
                  >
                    <Text style={styles.questionNumber}>{index + 1}. {question}</Text>
                    
                    <View style={[
                      styles.dropdownContainer,
                      validationErrors.responses && showErrors && !formData.responses[index] && styles.dropdownContainerError
                    ]}>
                      <TouchableOpacity
                        style={styles.dropdown}
                        onPress={() => setOpenDropdownIndex(isOpen ? null : index)}
                      >
                        <Text style={[styles.dropdownText, !isSelected && styles.placeholderText]}>
                          {displayText}
                        </Text>
                        <Ionicons 
                          name={isOpen ? "chevron-up" : "chevron-down"} 
                          size={20} 
                          color={validationErrors.responses && showErrors && !formData.responses[index] ? '#dc3545' : Colors.primary} 
                          style={{ marginLeft: 8 }} 
                        />
                      </TouchableOpacity>
                      
                      {isOpen && (
                        <ScrollView style={styles.dropdownOptions} nestedScrollEnabled={true}>
                          {phqOptions.map((option, optionIndex) => (
                            <TouchableOpacity
                              key={option.value}
                              style={[
                                styles.dropdownOption,
                                optionIndex === phqOptions.length - 1 && styles.lastDropdownOption
                              ]}
                              onPress={() => {
                                handleResponseChange(index, option.value);
                                setOpenDropdownIndex(null);
                              }}
                            >
                              <Text style={styles.dropdownOptionText}>{option.label}</Text>
                            </TouchableOpacity>
                          ))}
                        </ScrollView>
                      )}
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Total Score Section */}
            <View style={styles.totalScoreSection}>
              <Text style={styles.totalScoreLabel}>Total Score</Text>
              <View style={styles.totalScoreField}>
                <Text style={styles.totalScoreText}>{calculateTotalScore()}</Text>
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
          message="Submitting PHQ-9 screening..."
        />

        {/* Success Modal */}
        <SuccessModal
          visible={showSuccessModal}
          title="Screening Submitted!"
          message="Your PHQ-9 screening has been successfully submitted."
          onClose={handleSuccessModalClose}
          buttonText="Continue"
        />
      </SafeAreaView>
    </AppBar>
  );
};

export default PHQ9Screen;

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
  questionsSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 0,
    padding: Layout.spacing.large,
    marginBottom: Spacing.SECTION_TO_SECTION,
    shadowColor: Colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  questionCard: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.medium,
    padding: Layout.spacing.large,
    marginBottom: Layout.spacing.medium,
    shadowColor: Colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  questionCardError: {
    borderWidth: 2,
    borderColor: '#dc3545',
  },
  questionNumber: {
    fontSize: Fonts.sizes.regular,
    fontWeight: Fonts.weights.bold,
    color: Colors.text,
    marginBottom: Layout.spacing.medium,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: Layout.borderRadius.medium,
    backgroundColor: Colors.white,
  },
  dropdownContainerError: {
    borderColor: '#dc3545',
    borderWidth: 2,
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
    color: '#999',
  },
  errorText: {
    color: '#dc3545',
    fontSize: Fonts.sizes.small,
    marginTop: 4,
    marginLeft: 4,
  },
  dropdownOptions: {
    maxHeight: 200,
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
  totalScoreSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 0,
    padding: Layout.spacing.large,
    marginBottom: Spacing.SECTION_TO_SECTION,
    shadowColor: Colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  totalScoreLabel: {
    fontSize: Fonts.sizes.regular,
    fontWeight: Fonts.weights.bold,
    color: Colors.text,
    marginBottom: 8,
  },
  totalScoreField: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: Layout.borderRadius.medium,
    backgroundColor: Colors.white,
    padding: 14,
    minHeight: 50,
    justifyContent: 'center',
  },
  totalScoreText: {
    fontSize: Fonts.sizes.regular,
    color: Colors.text,
    textAlign: 'left',
    fontWeight: Fonts.weights.bold,
  },
}); 