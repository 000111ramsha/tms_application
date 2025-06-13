import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image, TextInput, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Import components
import AppBar from "../src/components/AppBar";
import SubmitButton from "../src/components/SubmitButton";

// Import context
import { useScrollViewPadding } from "../src/context/BottomNavContext";

// Import hooks
import { useScreenAnimation } from "../src/hooks/useScreenAnimation";

// Import constants
import Colors from "../src/constants/Colors";
import Fonts from "../src/constants/Fonts";
import Layout from "../src/constants/Layout";
import Spacing from "../src/constants/Spacing";

const bdiQuestions = [
  "Sadness",
  "Pessimism", 
  "Past Failure",
  "Loss of Pleasure",
  "Guilty Feelings",
  "Punishment Feelings",
  "Self-Dislike",
  "Self-Criticalness",
  "Suicidal Thoughts or Wishes",
  "Crying",
  "Agitation",
  "Loss of Interest",
  "Indecisiveness",
  "Worthlessness",
  "Loss of Energy",
  "Changes in Sleeping Pattern",
  "Irritability",
  "Changes in Appetite",
  "Concentration Difficulty",
  "Tiredness or Fatigue",
  "Loss of Interest in Sex"
];

const bdiOptions = {
  0: [ // Sadness
    { label: "0. I do not feel sad.", value: "0" },
    { label: "1. I feel sad much of the time.", value: "1" },
    { label: "2. I am sad all the time.", value: "2" },
    { label: "3. I am so sad or unhappy that I can't stand it.", value: "3" }
  ],
  1: [ // Pessimism
    { label: "0. I am not discouraged about my future.", value: "0" },
    { label: "1. I feel more discouraged about my future than I used to.", value: "1" },
    { label: "2. I do not expect things to work out for me.", value: "2" },
    { label: "3. I feel my future is hopeless and will only get worse.", value: "3" }
  ],
  2: [ // Past Failure
    { label: "0. I do not feel like a failure.", value: "0" },
    { label: "1. I have failed more than I should have.", value: "1" },
    { label: "2. As I look back, I see a lot of failures.", value: "2" },
    { label: "3. I feel I am a total failure as a person.", value: "3" }
  ],
  3: [ // Loss of Pleasure
    { label: "0. I get as much pleasure as I ever did from the things I enjoy.", value: "0" },
    { label: "1. I don't enjoy things as much as I used to.", value: "1" },
    { label: "2. I get very little pleasure from the things I used to enjoy.", value: "2" },
    { label: "3. I can't get any pleasure from the things I used to enjoy.", value: "3" }
  ],
  4: [ // Guilty Feelings
    { label: "0. I don't feel particularly guilty.", value: "0" },
    { label: "1. I feel guilty over many things I have done or should have done.", value: "1" },
    { label: "2. I feel quite guilty most of the time.", value: "2" },
    { label: "3. I feel guilty all of the time.", value: "3" }
  ],
  5: [ // Punishment Feelings
    { label: "0. I don't feel I am being punished.", value: "0" },
    { label: "1. I feel I may be punished.", value: "1" },
    { label: "2. I expect to be punished.", value: "2" },
    { label: "3. I feel I am being punished.", value: "3" }
  ],
  6: [ // Self-Dislike
    { label: "0. I feel the same about myself as ever.", value: "0" },
    { label: "1. I have lost confidence in myself.", value: "1" },
    { label: "2. I am disappointed in myself.", value: "2" },
    { label: "3. I dislike myself.", value: "3" }
  ],
  7: [ // Self-Criticalness
    { label: "0. I don't criticize or blame myself more than usual.", value: "0" },
    { label: "1. I am more critical of myself than I used to be.", value: "1" },
    { label: "2. I criticize myself for all of my faults.", value: "2" },
    { label: "3. I blame myself for everything bad that happens.", value: "3" }
  ],
  8: [ // Suicidal Thoughts or Wishes
    { label: "0. I don't have any thoughts of killing myself.", value: "0" },
    { label: "1. I have thoughts of killing myself, but I would not carry them out.", value: "1" },
    { label: "2. I would like to kill myself.", value: "2" },
    { label: "3. I would kill myself if I had the chance.", value: "3" }
  ],
  9: [ // Crying
    { label: "0. I don't cry anymore than I used to.", value: "0" },
    { label: "1. I cry more than I used to.", value: "1" },
    { label: "2. I cry over every little thing.", value: "2" },
    { label: "3. I feel like crying, but I can't.", value: "3" }
  ],
  10: [ // Agitation
    { label: "0. I am no more restless or wound up than usual.", value: "0" },
    { label: "1. I feel more restless or wound up than usual.", value: "1" },
    { label: "2. I am so restless or agitated, it's hard to stay still.", value: "2" },
    { label: "3. I am so restless or agitated that I have to keep moving or doing something.", value: "3" }
  ],
  11: [ // Loss of Interest
    { label: "0. I have not lost interest in other people or activities.", value: "0" },
    { label: "1. I am less interested in other people or things than before.", value: "1" },
    { label: "2. I have lost most of my interest in other people or things.", value: "2" },
    { label: "3. It's hard to get interested in anything.", value: "3" }
  ],
  12: [ // Indecisiveness
    { label: "0. I make decisions about as well as ever.", value: "0" },
    { label: "1. I find it more difficult to make decisions than usual.", value: "1" },
    { label: "2. I have much greater difficulty in making decisions than I used to.", value: "2" },
    { label: "3. I have trouble making any decisions.", value: "3" }
  ],
  13: [ // Worthlessness
    { label: "0. I do not feel I am worthless.", value: "0" },
    { label: "1. I don't consider myself as worthwhile and useful as I used to.", value: "1" },
    { label: "2. I feel more worthless as compared to others.", value: "2" },
    { label: "3. I feel utterly worthless.", value: "3" }
  ],
  14: [ // Loss of Energy
    { label: "0. I have as much energy as ever.", value: "0" },
    { label: "1. I have less energy than I used to have.", value: "1" },
    { label: "2. I don't have enough energy to do very much.", value: "2" },
    { label: "3. I don't have enough energy to do anything.", value: "3" }
  ],
  15: [ // Changes in Sleeping Pattern
    { label: "0. I have not experienced any change in my sleeping.", value: "0" },
    { label: "1a. I sleep somewhat more than usual.", value: "1a" },
    { label: "1b. I sleep somewhat less than usual.", value: "1b" },
    { label: "2a. I sleep a lot more than usual.", value: "2a" },
    { label: "2b. I sleep a lot less than usual.", value: "2b" },
    { label: "3a. I sleep most of the day.", value: "3a" },
    { label: "3b. I wake up 1-2 hours early and can't get back to sleep.", value: "3b" }
  ],
  16: [ // Irritability
    { label: "0. I am not more irritable than usual.", value: "0" },
    { label: "1. I am more irritable than usual.", value: "1" },
    { label: "2. I am much more irritable than usual.", value: "2" },
    { label: "3. I am irritable all the time.", value: "3" }
  ],
  17: [ // Changes in Appetite
    { label: "0. I have not experienced any change in my appetite.", value: "0" },
    { label: "1a. My appetite is somewhat less than usual.", value: "1a" },
    { label: "1b. My appetite is somewhat greater than usual.", value: "1b" },
    { label: "2a. My appetite is much less than before.", value: "2a" },
    { label: "2b. My appetite is much greater than usual.", value: "2b" },
    { label: "3a. I have no appetite at all.", value: "3a" },
    { label: "3b. I crave food all the time.", value: "3b" }
  ],
  18: [ // Concentration Difficulty
    { label: "0. I can concentrate as well as ever.", value: "0" },
    { label: "1. I can't concentrate as well as usual.", value: "1" },
    { label: "2. It's hard to keep my mind on anything for very long.", value: "2" },
    { label: "3. I find I can't concentrate on anything.", value: "3" }
  ],
  19: [ // Tiredness or Fatigue
    { label: "0. I am no more tired or fatigued than usual.", value: "0" },
    { label: "1. I get more tired or fatigued more easily than usual.", value: "1" },
    { label: "2. I am too tired or fatigued to do a lot of the things I used to do.", value: "2" },
    { label: "3. I am too tired or fatigued to do most of the things I used to do", value: "3" }
  ],
  20: [ // Loss of Interest in Sex
    { label: "0. I have not noticed any recent change in my interest in sex.", value: "0" },
    { label: "1. I am less interested in sex than I used to be.", value: "1" },
    { label: "2. I am much less interested in sex now.", value: "2" },
    { label: "3. I have lost interest in sex completely.", value: "3" }
  ]
};

export default function BDIScreen() {
  const router = useRouter();
  const scrollViewPadding = useScrollViewPadding();
  const { animatedStyle } = useScreenAnimation();
  
  const [formData, setFormData] = useState({
    responses: {}
  });
  
  const [isSubmitPressed, setIsSubmitPressed] = useState(false);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

  // Calculate total score
  const calculateTotalScore = () => {
    let total = 0;
    for (let i = 0; i < bdiQuestions.length; i++) {
      const response = formData.responses[i];
      if (response) {
        // Handle special cases for sleep and appetite questions
        if (i === 15 || i === 17) { // Sleep and Appetite questions
          const value = response.replace(/[a-z]/g, ''); // Remove letters from values like "1a", "1b"
          total += parseInt(value);
        } else {
          total += parseInt(response);
        }
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
  };

  const handleSubmit = () => {
    // Check if all questions are answered
    const unansweredQuestions = [];
    for (let i = 0; i < bdiQuestions.length; i++) {
      if (!formData.responses[i] || formData.responses[i] === "Select") {
        unansweredQuestions.push(i + 1);
      }
    }
    
    if (unansweredQuestions.length > 0) {
      Alert.alert("Error", `Please answer all questions. Missing responses for question(s): ${unansweredQuestions.join(", ")}`);
      return;
    }
    
    // Here you would typically send the data to your backend
    Alert.alert("Success", "BDI questionnaire submitted successfully!");
    
    // Navigate back or to next screen
    router.back();
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <AppBar>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={scrollViewPadding}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Image source={require("../assets/new-patient-hero.jpg")} style={styles.heroImage} />
            <View style={styles.heroOverlay}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={handleGoBack}
              >
                <Ionicons name="arrow-back" size={24} color={Colors.white} />
              </TouchableOpacity>
              <Text style={styles.heroTitle}>BDI - II</Text>
            </View>
          </View>

          {/* Form Content */}
          <View style={styles.formContainer}>
            {/* Instructions */}
            <View style={styles.instructionsSection}>
              <Text style={styles.sectionTitle}>Instructions</Text>
              <Text style={styles.instructionsText}>
                This questionnaire consists of 21 groups of statements. Please read each group of statements carefully.
              </Text>
              
              <View style={styles.bulletPoints}>
                <View style={styles.bulletPoint}>
                  <View style={styles.bullet} />
                  <Text style={styles.bulletText}>
                    Then pick the one statement in each group that best describes the way you have been feeling during the past two weeks, including today.
                  </Text>
                </View>
                
                <View style={styles.bulletPoint}>
                  <View style={styles.bullet} />
                  <Text style={styles.bulletText}>
                    Circle the number beside the statement you have picked.
                  </Text>
                </View>
                
                <View style={styles.bulletPoint}>
                  <View style={styles.bullet} />
                  <Text style={styles.bulletText}>
                    If several statements in the group seem to apply equally well, circle the highest number for that group.
                  </Text>
                </View>
                
                <View style={styles.bulletPoint}>
                  <View style={styles.bullet} />
                  <Text style={styles.bulletText}>
                    Be sure that you do not choose more than one statement for any group, including Item 16 (Changes in Sleeping Pattern) or Item 18 (Changes in Appetite).
                  </Text>
                </View>
              </View>
            </View>

            {/* BDI Questions */}
            <View style={styles.questionsSection}>
              {bdiQuestions.map((question, index) => {
                const isSelected = formData.responses[index];
                const isOpen = openDropdownIndex === index;
                const selectedOption = bdiOptions[index].find(opt => opt.value === isSelected);
                const displayText = selectedOption ? selectedOption.label : "Select";
                
                return (
                  <View key={index} style={styles.questionCard}>
                    <Text style={styles.questionNumber}>{index + 1}. {question}</Text>
                    
                    <View style={styles.dropdownContainer}>
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
                          color={Colors.primary} 
                          style={{ marginLeft: 8 }} 
                        />
                      </TouchableOpacity>
                      
                      {isOpen && (
                        <ScrollView style={styles.dropdownOptions} nestedScrollEnabled={true}>
                          {bdiOptions[index].map((option, optionIndex) => (
                            <TouchableOpacity
                              key={option.value}
                              style={[
                                styles.dropdownOption,
                                optionIndex === bdiOptions[index].length - 1 && styles.lastDropdownOption
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

            {/* Total Score */}
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
      </SafeAreaView>
    </AppBar>
  );
}

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
    fontSize: Fonts.sizes.xxlarge,
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
  instructionsSection: {
    backgroundColor: '#f8f9fa',
    borderRadius: 0,
    padding: Layout.spacing.large,
    marginBottom: Spacing.SECTION_TO_SECTION,
    shadowColor: Colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  sectionTitle: {
    fontSize: Fonts.sizes.large,
    fontWeight: Fonts.weights.bold,
    color: Colors.primary,
    marginBottom: Layout.spacing.medium,
  },
  instructionsText: {
    fontSize: Fonts.sizes.regular,
    color: Colors.text,
    marginBottom: Layout.spacing.medium,
    lineHeight: 22,
  },
  bulletPoints: {
    marginTop: Layout.spacing.small,
  },
  bulletPoint: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Layout.spacing.small,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginRight: Layout.spacing.medium,
    marginTop: 8,
  },
  bulletText: {
    fontSize: Fonts.sizes.regular,
    color: Colors.text,
    flex: 1,
    lineHeight: 22,
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