import React, { useState } from "react";
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image, Alert, TextInput } from "react-native";
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
import Spacing from "../src/constants/Spacing";

export default function PatientDemographicSheetScreen() {
  const router = useRouter();
  const scrollViewPadding = useScrollViewPadding();
  const { animatedStyle } = useScreenAnimation();
  
  const [formData, setFormData] = useState({
    fullLegalName: '',
    date: null,
    phone: '',
    email: '',
    address: '',
    cityStateZip: '',
    age: '',
    dob: null,
    ssn: '',
    gender: '',
    activeDutyServiceMember: '',
    dodBenefit: '',
    currentEmployer: '',
    spouseName: '',
    spouseAge: '',
    spouseDob: null,
    spouseSsn: '',
    spouseEmployer: '',
    referringProvider: '',
    primaryHealthInsurance: '',
    policy: '',
    group: '',
    knownMedicalConditions: '',
    drugAllergies: '',
    currentMedications: ''
  });
  
  const [isSubmitPressed, setIsSubmitPressed] = useState(false);
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);

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

  const handleSubmit = () => {
    // Check required fields
    const requiredFields = [
      'fullLegalName', 'date', 'phone', 'email', 'address', 'cityStateZip', 
      'age', 'dob', 'gender', 'activeDutyServiceMember'
    ];
    
    const missingFields = requiredFields.filter(field => {
      const value = formData[field];
      if (field === 'date' || field === 'dob') {
        return !value;
      }
      return !value;
    });
    
    if (missingFields.length > 0) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }
    
    // Here you would typically send the data to your backend
    Alert.alert("Success", "Patient demographic sheet submitted successfully!");
    
    // Navigate back or to next screen
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

  const genderOptions = [
    { label: "Male", value: "M" },
    { label: "Female", value: "F" }
  ];

  const yesNoOptions = [
    { label: "Yes", value: "Y" },
    { label: "No", value: "N" }
  ];

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
              <Text style={styles.heroTitle}>PATIENT{'\n'}DEMOGRAPHIC{'\n'}SHEET</Text>
            </View>
          </View>

          {/* Form Content */}
          <View style={styles.formContainer}>
            {/* Personal Information Section */}
            <View style={styles.section}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="person" size={20} color={Colors.primary} style={styles.sectionIcon} />
                <Text style={styles.sectionTitle}>Personal Information</Text>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Full Legal Name *</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.fullLegalName}
                  onChangeText={(value) => handleInputChange('fullLegalName', value)}
                  placeholder="Enter your full legal name"
                  placeholderTextColor="#666666"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Date *</Text>
                <ModernDatePicker
                  value={formData.date}
                  onDateChange={(date) => handleInputChange('date', date)}
                  placeholder="Select Date"
                  placeholderTextColor="#666666"
                  textColor="#000000"
                  style={styles.datePickerContainer}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Phone *</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.phone}
                  onChangeText={(value) => handleInputChange('phone', value)}
                  placeholder="(123) 456-7890"
                  placeholderTextColor="#666666"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Email *</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.email}
                  onChangeText={(value) => handleInputChange('email', value)}
                  placeholder="email@example.com"
                  placeholderTextColor="#666666"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Address *</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.address}
                  onChangeText={(value) => handleInputChange('address', value)}
                  placeholder="Street Address"
                  placeholderTextColor="#666666"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>City, State ZIP *</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.cityStateZip}
                  onChangeText={(value) => handleInputChange('cityStateZip', value)}
                  placeholder="City, State ZIP"
                  placeholderTextColor="#666666"
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>Age *</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.age}
                    onChangeText={(value) => handleInputChange('age', value)}
                    placeholder="Age"
                    placeholderTextColor="#666666"
                    keyboardType="numeric"
                  />
                </View>

                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>Date of Birth *</Text>
                  <ModernDatePicker
                    value={formData.dob}
                    onDateChange={(date) => handleInputChange('dob', date)}
                    placeholder="Select Date of Birth"
                    placeholderTextColor="#666666"
                    textColor="#000000"
                    isDateOfBirth={true}
                    style={styles.datePickerContainer}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Social Security Number</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.ssn}
                  onChangeText={(value) => handleInputChange('ssn', value)}
                  placeholder="XXX-XX-XXXX"
                  placeholderTextColor="#666666"
                  secureTextEntry={true}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Gender *</Text>
                {renderDropdown('gender', genderOptions, 'Select Gender')}
              </View>
            </View>

            {/* Military Information Section */}
            <View style={styles.section}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="shield" size={20} color={Colors.primary} style={styles.sectionIcon} />
                <Text style={styles.sectionTitle}>Military Information</Text>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Active Duty Service Member *</Text>
                {renderDropdown('activeDutyServiceMember', yesNoOptions, 'Select Yes/No')}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>DOD Benefit</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.dodBenefit}
                  onChangeText={(value) => handleInputChange('dodBenefit', value)}
                  placeholder="DOD Benefit Information"
                  placeholderTextColor="#666666"
                />
              </View>
            </View>

            {/* Employment Information Section */}
            <View style={styles.section}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="briefcase" size={20} color={Colors.primary} style={styles.sectionIcon} />
                <Text style={styles.sectionTitle}>Employment Information</Text>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Current Employer</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.currentEmployer}
                  onChangeText={(value) => handleInputChange('currentEmployer', value)}
                  placeholder="Current Employer"
                  placeholderTextColor="#666666"
                />
              </View>
            </View>

            {/* Spouse Information Section */}
            <View style={styles.section}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="heart" size={20} color={Colors.primary} style={styles.sectionIcon} />
                <Text style={styles.sectionTitle}>Spouse Information</Text>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Spouse Name</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.spouseName}
                  onChangeText={(value) => handleInputChange('spouseName', value)}
                  placeholder="Spouse Full Name"
                  placeholderTextColor="#666666"
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>Spouse Age</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.spouseAge}
                    onChangeText={(value) => handleInputChange('spouseAge', value)}
                    placeholder="Age"
                    placeholderTextColor="#666666"
                    keyboardType="numeric"
                  />
                </View>

                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>Spouse DOB</Text>
                  <ModernDatePicker
                    value={formData.spouseDob}
                    onDateChange={(date) => handleInputChange('spouseDob', date)}
                    placeholder="Select Spouse DOB"
                    placeholderTextColor="#666666"
                    textColor="#000000"
                    isDateOfBirth={true}
                    style={styles.datePickerContainer}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Spouse Social Security</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.spouseSsn}
                  onChangeText={(value) => handleInputChange('spouseSsn', value)}
                  placeholder="XXX-XX-XXXX"
                  placeholderTextColor="#666666"
                  secureTextEntry={true}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Spouse Employer</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.spouseEmployer}
                  onChangeText={(value) => handleInputChange('spouseEmployer', value)}
                  placeholder="Spouse Employer"
                  placeholderTextColor="#666666"
                />
              </View>
            </View>

            {/* Healthcare Information Section */}
            <View style={styles.section}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="medical" size={20} color={Colors.primary} style={styles.sectionIcon} />
                <Text style={styles.sectionTitle}>Healthcare Information</Text>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Referring Provider</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.referringProvider}
                  onChangeText={(value) => handleInputChange('referringProvider', value)}
                  placeholder="Referring Provider"
                  placeholderTextColor="#666666"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Primary Health Insurance</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.primaryHealthInsurance}
                  onChangeText={(value) => handleInputChange('primaryHealthInsurance', value)}
                  placeholder="Insurance Provider"
                  placeholderTextColor="#666666"
                />
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>Policy</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.policy}
                    onChangeText={(value) => handleInputChange('policy', value)}
                    placeholder="Policy Number"
                    placeholderTextColor="#666666"
                  />
                </View>

                <View style={[styles.inputGroup, styles.halfWidth]}>
                  <Text style={styles.label}>Group</Text>
                  <TextInput
                    style={styles.textInput}
                    value={formData.group}
                    onChangeText={(value) => handleInputChange('group', value)}
                    placeholder="Group Number"
                    placeholderTextColor="#666666"
                  />
                </View>
              </View>
            </View>

            {/* Medical Information Section */}
            <View style={styles.section}>
              <View style={styles.sectionTitleContainer}>
                <Ionicons name="fitness" size={20} color={Colors.primary} style={styles.sectionIcon} />
                <Text style={styles.sectionTitle}>Medical Information</Text>
              </View>
              
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Known Medical Conditions</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={formData.knownMedicalConditions}
                  onChangeText={(value) => handleInputChange('knownMedicalConditions', value)}
                  placeholder="List any known medical conditions"
                  placeholderTextColor="#666666"
                  multiline={true}
                  numberOfLines={4}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Drug Allergies</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={formData.drugAllergies}
                  onChangeText={(value) => handleInputChange('drugAllergies', value)}
                  placeholder="List any drug allergies"
                  placeholderTextColor="#666666"
                  multiline={true}
                  numberOfLines={4}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Current Medications</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={formData.currentMedications}
                  onChangeText={(value) => handleInputChange('currentMedications', value)}
                  placeholder="List current medications with dosages"
                  placeholderTextColor="#666666"
                  multiline={true}
                  numberOfLines={4}
                />
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
    marginRight: Layout.spacing.large,
  },
  sectionTitle: {
    fontSize: Fonts.sizes.large,
    fontWeight: Fonts.weights.bold,
    color: Colors.primary,
  },
  inputGroup: {
    marginBottom: Layout.spacing.large,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfWidth: {
    flex: 0.48,
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
  datePickerContainer: {
    // Remove custom styling to use default ModernDatePicker styling
  },
}); 