import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image, TextInput, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image as ExpoImage } from "expo-image";

// Import components
import AppBar from "../src/components/AppBar";
import ModernDatePicker from "../src/components/ModernDatePicker";
import SubmitButton from "../src/components/SubmitButton";

// Import context
import { useScrollViewPadding } from "../src/context/BottomNavContext";

// Import hooks
import { useScreenAnimation } from "../src/hooks/useScreenAnimation";

// Import constants
import Colors from "../src/constants/Colors";
import Fonts from "../src/constants/Fonts";
import Layout from "../src/constants/Layout";

const medicationCategories = {
  SSRI: [
    "Sertraline (Zoloft)",
    "Fluoxetine (Prozac)",
    "Citalopram (Celexa)",
    "Fluvoxamine (Luvox)",
    "Paroxetine (Paxil)",
    "Paroxetine CR (Paxil CR)",
    "Escitalopram (Lexapro)",
    "Vilazodone (Viibryd)",
    "Vortioxetine (Brintellix/Trintellix)"
  ],
  SNRI: [
    "Venlafaxine (Effexor) IR/XR",
    "Duloxetine (Cymbalta)",
    "Desvenlafaxine (Pristiq)",
    "Levomilnacipran (Fetzima)",
    "Milnacipran (Savella)"
  ],
  TRICYCLIC: [
    "Amitriptyline (Elavil)",
    "Imipramine (Tofranil)",
    "Desipramine (Norpramin/Pertofrane)",
    "Trimipramine (Surmontil)",
    "Clomipramine (Anafranil)",
    "Maprotiline (Ludiomil)",
    "Doxepin (Sinequan)",
    "Nomifensine (Merital)",
    "Nortriptyline (Pamelor/Aventyl)",
    "Protriptyline (Vivactil)",
    "Amoxapine (Asendin)"
  ],
  MAOI: [
    "Phenelzine (Nardil)",
    "Selegiline (Emsam/Eldepryl)",
    "Selegiline patch (Emsam)",
    "Isocarboxazid (Marplan)",
    "Tranylcypromine (Parnate)"
  ],
  ATYPICAL: [
    "Bupropion (Wellbutrin) SR XL",
    "Nefazodone (Serzone/Serzone)",
    "Trazodone (Desyrel)",
    "Mirtazapine (Remeron)"
  ],
  "AUGMENTING AGENT": [
    "Aripiprazole (Abilify)",
    "Ziprasidone (Geodon)",
    "Risperidone (Risperdal)",
    "Quetiapine (Seroquel)",
    "Olanzapine (Zyprexa)",
    "Asenapine (Saphris)",
    "Cariprazine (Vraylar)",
    "Lurasidone (Latuda)",
    "Clozapine (Clozaril)",
    "Paliperidone (Invega)",
    "Brexpiprazole (Rexulti)",
    "Lithium (Eskalith/Lithobid/Lithonate)",
    "Gabapentin (Neurontin)",
    "Lamotrigine (Lamictal)",
    "Topiramate (Topamax)"
  ]
};

export default function PreCertMedListScreen() {
  const router = useRouter();
  const scrollViewPadding = useScrollViewPadding();
  const { animatedStyle } = useScreenAnimation();
  
  const [formData, setFormData] = useState({
    name: "",
    dateOfBirth: null,
    selectedMedications: {},
    medicationDetails: {}
  });
  
  const [isSubmitPressed, setIsSubmitPressed] = useState(false);

  const handleMedicationToggle = (category, medication) => {
    const isCurrentlySelected = formData.selectedMedications[category]?.[medication];
    
    setFormData(prev => {
      const newSelectedMedications = {
        ...prev.selectedMedications,
        [category]: {
          ...prev.selectedMedications[category],
          [medication]: !isCurrentlySelected
        }
      };
      
      const newMedicationDetails = { ...prev.medicationDetails };
      const medicationKey = `${category}_${medication}`;
      
      if (!isCurrentlySelected) {
        // Adding medication - initialize empty details
        newMedicationDetails[medicationKey] = {
          dose: "",
          startDate: null,
          endDate: null,
          reasonForDiscontinuing: ""
        };
      } else {
        // Removing medication - delete details
        delete newMedicationDetails[medicationKey];
      }
      
      return {
        ...prev,
        selectedMedications: newSelectedMedications,
        medicationDetails: newMedicationDetails
      };
    });
  };

  const handleMedicationDetailChange = (category, medication, field, value) => {
    const medicationKey = `${category}_${medication}`;
    setFormData(prev => ({
      ...prev,
      medicationDetails: {
        ...prev.medicationDetails,
        [medicationKey]: {
          ...prev.medicationDetails[medicationKey],
          [field]: value
        }
      }
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.dateOfBirth) {
      Alert.alert("Error", "Please fill in all required fields (Name and Date of Birth).");
      return;
    }
    
    // Here you would typically send the data to your backend
    Alert.alert("Success", "Pre-Certification Medication List submitted successfully!");
    
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
            <ExpoImage source={require("../assets/new-patient-hero.jpg")} style={styles.heroImage} />
            <View style={styles.heroOverlay}>
              <TouchableOpacity 
                style={styles.backButton}
                onPress={handleGoBack}
              >
                <Ionicons name="arrow-back" size={24} color={Colors.white} />
              </TouchableOpacity>
              <Text style={styles.heroTitle}>TMS PRE-CERTIFICATION{'\n'}MEDICATION LIST</Text>
            </View>
          </View>

          {/* Form Content */}
          <View style={styles.formContainer}>
            {/* Personal Information */}
            <View style={styles.personalInfoSection}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="person" size={20} color={Colors.primary} style={styles.sectionIcon} />
                <Text style={styles.sectionTitle}>Personal Information</Text>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.name}
                  onChangeText={(value) => handleInputChange('name', value)}
                  placeholder="Enter your full name"
                  placeholderTextColor="#666666"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Date of Birth</Text>
                <ModernDatePicker
                  value={formData.dateOfBirth}
                  onDateChange={(date) => handleInputChange('dateOfBirth', date)}
                  placeholder="Select Date of Birth"
                  placeholderTextColor="#666666"
                  textColor="#000000"
                  isDateOfBirth={true}
                  style={styles.datePickerContainer}
                />
              </View>
            </View>

            {/* Medication Categories */}
            {Object.entries(medicationCategories).map(([category, medications]) => (
              <View key={category} style={styles.categorySection}>
                <View style={styles.categoryTitleContainer}>
                  <Ionicons name="medical" size={18} color={Colors.primary} style={styles.categoryIcon} />
                  <Text style={styles.categoryTitle}>{category}</Text>
                </View>
                
                {medications.map((medication) => {
                  const isSelected = formData.selectedMedications[category]?.[medication];
                  const medicationKey = `${category}_${medication}`;
                  const details = formData.medicationDetails[medicationKey];
                  
                  return (
                    <View key={medication}>
                      <TouchableOpacity
                        style={styles.medicationItem}
                        onPress={() => handleMedicationToggle(category, medication)}
                      >
                        <View style={styles.checkboxContainer}>
                          <View style={[
                            styles.checkbox,
                            isSelected && styles.checkboxSelected
                          ]}>
                            {isSelected && (
                              <Ionicons name="checkmark" size={16} color={Colors.white} />
                            )}
                          </View>
                          <Text style={styles.medicationText}>{medication}</Text>
                        </View>
                      </TouchableOpacity>
                      
                      {/* Medication Details Fields */}
                      {isSelected && details && (
                        <View style={styles.medicationDetailsContainer}>
                          <View style={styles.detailInputGroup}>
                            <Text style={styles.detailLabel}>Dose (mg)</Text>
                            <TextInput
                              style={styles.detailInput}
                              value={details.dose}
                              onChangeText={(value) => handleMedicationDetailChange(category, medication, 'dose', value)}
                              placeholder="Enter dose"
                              placeholderTextColor="#666666"
                            />
                          </View>
                          
                          <View style={styles.detailInputGroup}>
                            <Text style={styles.detailLabel}>Start Date</Text>
                            <ModernDatePicker
                              value={details.startDate}
                              onDateChange={(date) => handleMedicationDetailChange(category, medication, 'startDate', date)}
                              placeholder="Select Start Date"
                              placeholderTextColor="#666666"
                              textColor="#000000"
                              style={styles.detailDatePickerContainer}
                            />
                          </View>
                          
                          <View style={styles.detailInputGroup}>
                            <Text style={styles.detailLabel}>End Date</Text>
                            <ModernDatePicker
                              value={details.endDate}
                              onDateChange={(date) => handleMedicationDetailChange(category, medication, 'endDate', date)}
                              placeholder="Select End Date"
                              placeholderTextColor="#666666"
                              textColor="#000000"
                              style={styles.detailDatePickerContainer}
                            />
                          </View>
                          
                          <View style={styles.detailInputGroup}>
                            <Text style={styles.detailLabel}>Reason For Discontinuing</Text>
                            <TextInput
                              style={styles.detailInput}
                              value={details.reasonForDiscontinuing}
                              onChangeText={(value) => handleMedicationDetailChange(category, medication, 'reasonForDiscontinuing', value)}
                              placeholder="Enter reason"
                              placeholderTextColor="#666666"
                            />
                          </View>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            ))}

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
    alignItems: "flex-start",
    paddingLeft: Layout.spacing.xlarge,
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
    alignSelf: "center",
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  formContainer: {
    padding: Layout.spacing.large,
  },
  personalInfoSection: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.medium,
    padding: Layout.spacing.large,
    marginBottom: Layout.spacing.large,
    shadowColor: Colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.medium,
  },
  sectionIcon: {
    marginRight: Layout.spacing.small,
  },
  sectionTitle: {
    fontSize: Fonts.sizes.large,
    fontWeight: Fonts.weights.bold,
    color: Colors.primary,
  },
  inputGroup: {
    marginBottom: Layout.spacing.medium,
  },
  inputLabel: {
    fontSize: Fonts.sizes.regular,
    fontWeight: Fonts.weights.bold,
    color: Colors.text,
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
  categorySection: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.medium,
    padding: Layout.spacing.large,
    marginBottom: Layout.spacing.large,
    shadowColor: Colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  categoryTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.medium,
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  categoryIcon: {
    marginRight: Layout.spacing.small,
  },
  categoryTitle: {
    fontSize: Fonts.sizes.large,
    fontWeight: Fonts.weights.bold,
    color: Colors.primary,
  },
  medicationItem: {
    paddingVertical: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 4,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  checkboxSelected: {
    backgroundColor: Colors.primary,
  },
  medicationText: {
    fontSize: Fonts.sizes.regular,
    color: Colors.text,
    flex: 1,
  },
  medicationDetailsContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: Layout.borderRadius.medium,
    padding: Layout.spacing.medium,
    marginTop: Layout.spacing.small,
    marginLeft: 32,
    borderLeftWidth: 3,
    borderLeftColor: Colors.primary,
  },
  detailInputGroup: {
    marginBottom: Layout.spacing.medium,
  },
  detailLabel: {
    fontSize: Fonts.sizes.regular,
    fontWeight: Fonts.weights.bold,
    color: Colors.text,
    marginBottom: 8,
  },
  detailInput: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: Layout.borderRadius.medium,
    padding: 12,
    fontSize: Fonts.sizes.regular,
    color: '#000000',
    backgroundColor: Colors.white,
    fontWeight: Fonts.weights.medium,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: Layout.borderRadius.medium,
    backgroundColor: Colors.white,
  },
  datePickerContainer: {
    // Remove custom styling to use default ModernDatePicker styling
  },
  detailDatePickerContainer: {
    // Remove custom styling to use default ModernDatePicker styling
  },
}); 