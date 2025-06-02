import { useState, useRef, useCallback } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Linking,
  Alert,
  Platform,
  ActivityIndicator,
  Image,
  ImageBackground,
  Animated,
  Pressable,
  Keyboard,
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Import components
import AppBar from "../src/components/AppBar";
import OptimizedMapbox from "../src/components/OptimizedMapbox";
import ModernDatePicker from "../src/components/ModernDatePicker";
import FloatingActionButton from "../src/components/FloatingActionButton";
import SubmitButton from "../src/components/SubmitButton";

// Import context
import { useScrollViewPadding } from "../src/context/BottomNavContext";

// Import hooks
import { useFormReducer } from "../src/hooks/useFormReducer";
import { useFadeAnimation } from "../src/hooks/useScreenAnimation";

// Import constants
import Colors from "../src/constants/Colors";
import Fonts from "../src/constants/Fonts";
import Layout from "../src/constants/Layout";
import Spacing from "../src/constants/Spacing";

// Import utils
import { validateEmail } from "../src/utils/validation";

// Location coordinates
const OFFICE_LOCATION = {
  longitude: -86.6218,
  latitude: 30.4205,
  address: "403 Hollywood Blvd NW Suite 104A Fort Walton Beach, FL 32548",
  zoom: 15,
  markerColor: "f74e4e" // Hex color for the map marker (red, without #)
};

/**
 * Contact Screen Component
 */
export default function ContactScreen() {
  const router = useRouter();
  const scrollViewPadding = useScrollViewPadding();
  
  // Use fade animation hook for calming, therapeutic effect
  const { animatedStyle } = useFadeAnimation(400);
  
  // Use form reducer for better state management
  const {
    fields,
    errors,
    pressedStates,
    setField,
    setError,
    clearError,
    clearAllErrors,
    resetForm,
    setPressedState,
  } = useFormReducer(
    // Initial fields
    {
      name: "",
      email: "",
      message: "",
      date: null, // Changed to null for date object
      consultationType: "Consultation",
    },
    // Initial errors
    {
      name: "",
      email: "",
      message: "",
      date: "",
      consultationType: "",
    },
    // Initial pressed states
    {
      mapStyle: false,
      mapDirections: false,
      sendMessage: false,
    }
  );

  // Separate state for UI elements that don't belong in the form
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConsultationOptions, setShowConsultationOptions] = useState(false);

  const handleCall = () => {
    Linking.openURL("tel:850-254-9575");
  };

  // Function to open location in maps app
  const openInMaps = () => {
    const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
    const latLng = `${OFFICE_LOCATION.latitude},${OFFICE_LOCATION.longitude}`;
    const label = encodeURIComponent(OFFICE_LOCATION.address);
    const url = Platform.select({
      ios: `${scheme}${label}@${latLng}`,
      android: `${scheme}${latLng}(${label})`
    });

    Linking.openURL(url);
  };



  const handleEmail = () => {
    Linking.openURL("mailto:info@tmsofemeraldcoast.com");
  };

  // Individual field validation functions
  const validateNameField = useCallback((value) => {
    if (!value.trim()) {
      setError("name", "Please enter your name");
      return false;
    } else if (value.trim().length < 2) {
      setError("name", "Name must be at least 2 characters");
      return false;
    } else {
      clearError("name");
      return true;
    }
  }, [setError, clearError]);

  const validateEmailField = useCallback((value) => {
    if (!value.trim()) {
      setError("email", "Please enter your email");
      return false;
    } else if (!validateEmail(value.trim())) {
      setError("email", "Please enter a valid email address");
      return false;
    } else {
      clearError("email");
      return true;
    }
  }, [setError, clearError]);



  const validateDateField = useCallback((value) => {
    if (value) {
      // Validate that the selected date is not today or in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const selectedDate = new Date(value);
      selectedDate.setHours(0, 0, 0, 0);
      
      if (selectedDate <= today) {
        setError("date", "Please select a future date");
        return false;
      }
    }
    clearError("date");
    return true;
  }, [setError, clearError]);

  const validateMessageField = useCallback((value) => {
    if (!value.trim()) {
      setError("message", "Please enter your message");
      return false;
    } else if (value.trim().length < 10) {
      setError("message", "Message must be at least 10 characters");
      return false;
    } else {
      clearError("message");
      return true;
    }
  }, [setError, clearError]);

  const validateConsultationField = useCallback((value) => {
    if (!value || value === "") {
      setError("consultationType", "Please select a consultation type");
      return false;
    } else {
      clearError("consultationType");
      return true;
    }
  }, [setError, clearError]);

  // Comprehensive form validation
  const validateForm = useCallback(() => {
    const isNameValid = validateNameField(fields.name);
    const isEmailValid = validateEmailField(fields.email);
    const isDateValid = validateDateField(fields.date);
    const isMessageValid = validateMessageField(fields.message);
    const isConsultationValid = validateConsultationField(fields.consultationType);

    return isNameValid && isEmailValid && isDateValid && isMessageValid && isConsultationValid;
  }, [fields, validateNameField, validateEmailField, validateDateField, validateMessageField, validateConsultationField]);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare email content
      const adminEmail = "jasonmiller.dev87@gmail.com";
      const senderName = "TMS of Emerald Coast";
      const senderEmail = "onboarding@resend.dev"; // For production, use your verified domain
      const resendApiKey = "re_a6sV9E4m_7z2rZVBbLQpkxbuqdLCam3DR"; // IMPORTANT: Replace with your actual Resend API key

      const preferredDateFormatted = fields.date 
        ? new Date(fields.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
        : 'Not specified';
      
      const submissionTime = new Date().toLocaleString('en-US', { 
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', timeZoneName: 'short' 
      });

      const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>New Message Submission</title>
<style>
  body { margin: 0; padding: 0; width: 100% !important; -webkit-font-smoothing: antialiased; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f0f4f8; color: #333333; }
  .email-container { max-width: 680px; margin: 20px auto; background-color: #F7FAFC; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
  .header { background-color: #2C5282; /* Muted Dark Blue from image */ padding: 30px 30px; text-align: center; }
  .header h1 { color: #ffffff; font-size: 24px; margin: 0 0 5px 0; font-weight: 500; }
  .header p { color: #ffffff; /* Lighter grey/blue for subtitle */ font-size: 14px; margin: 0; }
  .attention-banner { background-color: #FCEEEE; /* Light Pink from image */ padding: 10px 20px; border-left: 5px solid #CC0000; /* Red from image */ margin: 20px 20px; }
  .attention-banner p { margin: 0; font-size: 15px; font-weight: bold; color: #222222; /* Red from image */ }
  .content { padding: 20px 30px 30px 30px; }
  .field-block { margin-bottom: 18px; }
  .field-block label { display: block; font-size: 14px; color: #2c5264; /* Label color to match header blue */ font-weight: bold; margin-bottom: 6px; }
  .field-block .value { font-size: 13px; color: #333333; padding: 12px; background-color: #FFFFFF; border-radius: 5px; border: 1px solid #e9ecef; word-wrap: break-word; white-space: pre-wrap; /* To preserve message line breaks */ }
  .field-block .value a { color: #2E6AD2; text-decoration: none; }
  .next-steps { background-color: #EFF6FC; /* Light Blue from image */ padding: 20px 30px; margin-top: 20px; border-top: 1px solid #d0e0f0; /* Slightly darker border for definition */ }
  .next-steps h3 { font-size: 16px; color: #3A537E; /* Heading color to match header blue */ margin-top: 0; margin-bottom: 10px; font-weight: bold; }
  .next-steps ul { margin: 0; padding-left: 20px; list-style-type: disc; }
  .next-steps li { font-size: 14px; color: #333333; margin-bottom: 5px; line-height: 1.5; }
  .footer { text-align: center; padding: 20px; font-size: 12px; color: #777777; }
</style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>New Message Submission</h1>
      <p>From: TMS of Emerald Coast App</p>
    </div>
    <div class="attention-banner">
      <p>&#9888;&#65039; New patient inquiry requires attention</p>
    </div>
    <div class="content">
      <div class="field-block">
        <label>Patient Name:</label>
        <div class="value">${fields.name}</div>
      </div>
      <div class="field-block">
        <label>Email Address:</label>
        <div class="value"><a href="mailto:${fields.email.trim()}">${fields.email.trim()}</a></div>
      </div>
      <div class="field-block">
        <label>Preferred Date:</label>
        <div class="value">${preferredDateFormatted}</div>
      </div>
      <div class="field-block">
        <label>Consultation Type:</label>
        <div class="value">${fields.consultationType}</div>
      </div>
      <div class="field-block">
        <label>Message:</label>
        <div class="value">${fields.message}</div>
      </div>
      <div class="field-block">
        <label>Submission Time:</label>
        <div class="value">${submissionTime}</div>
      </div>
      <div class="field-block">
        <label>Source:</label>
        <div class="value">Contact Page Form</div>
      </div>
    </div>
    <div class="next-steps">
      <h3>Next Steps:</h3>
      <ul>
        <li>Contact the patient within 24 hours</li>
        <li>Schedule their preferred consultation type</li>
        <li>Send intake forms if needed</li>
      </ul>
    </div>
  </div>
  <div class="footer">
    <p>&copy; ${new Date().getFullYear()} TMS of Emerald Coast. All rights reserved.</p>
  </div>
</body>
</html>
      `;

      const emailData = {
        from: `"${senderName}" <${senderEmail}>`,
        to: [adminEmail],
        subject: `New Message Submission from ${fields.name}`,
        html: htmlBody,
        reply_to: fields.email.trim(),
      };

      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Resend API error:', responseData);
        throw new Error(responseData.message || "Failed to send email via Resend.");
      }

      console.log('Message sent and email delivered via Resend:', responseData);
      
      Alert.alert("Message Sent", "Thank you for contacting us. We will get back to you soon!", [
        {
          text: "OK",
          onPress: () => {
            resetForm();
            // Optionally, navigate away or clear other states
          },
        },
      ]);
    } catch (error) {
      console.error('Message sending error:', error);
      Alert.alert("Error", `Failed to send message: ${error.message || 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, validateForm, fields, resetForm]);

  return (
    <AppBar>
      <SafeAreaView style={styles.container}>
        <Animated.View style={[styles.animatedContainer, animatedStyle]}>
          <ScrollView
            style={styles.content}
            contentContainerStyle={scrollViewPadding}
          >
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Image source={require("../assets/contact-hero.jpg")} style={styles.heroImage} />
            <View style={styles.heroOverlay}>
              <Text style={styles.heroTitle}>Contact</Text>
            </View>
              </View>

          {/* Contact Info Card Section */}
          <View style={styles.contactCardWrapper}>
            <ImageBackground source={require("../assets/contact-form-bg.jpg")} style={styles.contactCardBg} imageStyle={styles.contactCardBgImg}>
              <View style={styles.contactCardOverlay}>
                <View style={styles.supportContainer}>
                  <View style={styles.supportLine} />
                  <Text style={styles.contactCardTitle}>GET SUPPORT</Text>
                </View>
                <Text style={styles.contactCardSubtitle}>Reach Us By Contact Information.</Text>
                <Text style={styles.contactCardDesc}>Connect with our dedicated care team for personalized support and healing.</Text>
                <View style={styles.contactCardInfoRow}>
                  <Ionicons name="mail" size={22} color="#fff" style={styles.contactCardIcon} />
                  <Text style={styles.contactCardInfoText}>info@tmsofemeraldcoast.com</Text>
              </View>
                <View style={styles.contactCardInfoRow}>
                  <Ionicons name="call" size={22} color="#fff" style={styles.contactCardIcon} />
                  <Text style={styles.contactCardInfoText}>850-254-9575</Text>
                </View>
                <View style={styles.contactCardInfoRow}>
                  <Ionicons name="print" size={22} color="#fff" style={styles.contactCardIcon} />
                  <Text style={styles.contactCardInfoText}>Fax: 850 750-4712</Text>
                </View>
                <View style={styles.contactCardInfoRow}>
                  <Ionicons name="location" size={22} color="#fff" style={styles.contactCardIcon} />
                  <Text style={styles.contactCardInfoText}>{OFFICE_LOCATION.address}</Text>
                </View>
                <View style={styles.cardDivider} />
                <View style={styles.socialLinksContainer}>
                  <TouchableOpacity style={styles.socialIconButton} onPress={() => Linking.openURL('https://www.facebook.com/profile.php?id=61568383621462&mibextid=LQQJ4di&rdid=NQbuAVyeIjACv0jp&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2FaAL7QjSekUpwb3oP%2F%3Fmibextid%3DLQQJ4di#')}>
                    <FontAwesome name="facebook" size={22} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.socialIconButton} onPress={() => Linking.openURL('https://www.linkedin.com/company/tms-of-emerald-coast-llc/')}>
                    <FontAwesome name="linkedin" size={22} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.socialIconButton} onPress={() => Linking.openURL('https://www.instagram.com/tmsemeraldcoast/?igsh=MWk1dHd1cmFwbWN6bg%3D%3D#')}>
                    <FontAwesome name="instagram" size={22} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </ImageBackground>
          </View>

          <View style={styles.contentContainer}>
          <Pressable
            style={styles.formContainer}
            onPress={() => {
              clearAllErrors();
              Keyboard.dismiss();
            }}
          >
              <Text style={styles.formTitle}>Send Us Message</Text>
              <Text style={styles.formSubtitle}>Reach Out for Immediate Support</Text>

            {/* Name Field */}
            <View style={styles.fieldContainer}>
              <TextInput
                style={[styles.input, errors.name ? styles.inputError : null]}
                placeholder="Your Name"
                value={fields.name}
                onChangeText={(value) => {
                  setField("name", value);
                  if (errors.name) validateNameField(value);
                }}
                onBlur={() => validateNameField(fields.name)}
                placeholderTextColor="#666"
              />
              {errors.name ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={16} color={Colors.error} style={styles.errorIcon} />
                  <Text style={styles.errorText}>{errors.name}</Text>
                </View>
              ) : null}
            </View>

            {/* Date Field */}
            <ModernDatePicker
              value={fields.date}
              onDateChange={(date) => {
                // Validate date for contact form only
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                const selectedDate = new Date(date);
                selectedDate.setHours(0, 0, 0, 0);
                
                if (selectedDate <= today) {
                  setError("date", "Please select a future date");
                  return;
                }
                
                setField("date", date);
                if (errors.date) validateDateField(date);
              }}
              placeholder="Select Preferred Date"
              error={errors.date}
              onFocus={() => clearError("date")}
              onBlur={() => validateDateField(fields.date)}
              style={styles.datePickerContainer}
              placeholderTextColor="#666"
              textColor="#222"
              minimumDate={new Date()} // Contact form should restrict to future dates
              borderStyle="transparent"
            />

            {/* Email Field */}
            <View style={styles.fieldContainer}>
              <TextInput
                style={[styles.input, errors.email ? styles.inputError : null]}
                placeholder="Your Email"
                value={fields.email}
                onChangeText={(value) => {
                  setField("email", value);
                  if (errors.email) validateEmailField(value);
                }}
                onBlur={() => validateEmailField(fields.email)}
                keyboardType="email-address"
                placeholderTextColor="#666"
                autoCapitalize="none"
              />
              {errors.email ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={16} color={Colors.error} style={styles.errorIcon} />
                  <Text style={styles.errorText}>{errors.email}</Text>
                </View>
              ) : null}
            </View>



            {/* Consultation Type Field */}
            <View style={styles.fieldContainer}>
              <TouchableOpacity
                style={[styles.dropdown, errors.consultationType ? styles.inputError : null]}
                onPress={() => setShowConsultationOptions(!showConsultationOptions)}
                onPressIn={() => clearError("consultationType")}
              >
                <Text style={styles.dropdownText}>{fields.consultationType}</Text>
                <Ionicons name={showConsultationOptions ? "chevron-up" : "chevron-down"} size={20} color="#666" style={{ marginLeft: 8 }} />
              </TouchableOpacity>
              {showConsultationOptions && (
                <View style={styles.dropdownOptions}>
                  {['Consultation', 'Family Counseling', 'Anxiety Disorder', 'Depression', 'TMS Treatment'].map(option => (
                    <TouchableOpacity
                      key={option}
                      style={styles.dropdownOption}
                      onPress={() => {
                        setField("consultationType", option);
                        setShowConsultationOptions(false);
                        if (errors.consultationType) validateConsultationField(option);
                      }}
                    >
                      <Text style={styles.dropdownOptionText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              {errors.consultationType ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={16} color={Colors.error} style={styles.errorIcon} />
                  <Text style={styles.errorText}>{errors.consultationType}</Text>
                </View>
              ) : null}
            </View>

            {/* Message Field */}
            <View style={styles.fieldContainer}>
              <TextInput
                style={[styles.input, styles.textArea, errors.message ? styles.inputError : null]}
                placeholder="Your Message"
                value={fields.message}
                onChangeText={(value) => {
                  setField("message", value);
                  if (errors.message) validateMessageField(value);
                }}
                onBlur={() => validateMessageField(fields.message)}
                multiline
                numberOfLines={5}
                placeholderTextColor="#666"
              />
              {errors.message ? (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={16} color={Colors.error} style={styles.errorIcon} />
                  <Text style={styles.errorText}>{errors.message}</Text>
                </View>
              ) : null}
            </View>

            <SubmitButton
              onPress={handleSubmit}
              onPressIn={() => !isSubmitting && setPressedState("sendMessage", true)}
              onPressOut={() => setPressedState("sendMessage", false)}
              isPressed={pressedStates.sendMessage}
              isSubmitting={isSubmitting}
              disabled={isSubmitting}
              title="SEND MESSAGE"
              icon="send"
            />
            </Pressable>

            {/* Optimized Map Section with Caching and Offline Support */}
            <View style={styles.mapContainer}>
              <OptimizedMapbox
                location={OFFICE_LOCATION}
                initialStyle="satelliteStreets"
                onPress={openInMaps}
                onDirectionsPress={openInMaps}
                showStyleButton={true}
                showDirectionsButton={true}
              />
            </View>


          </View>
        </ScrollView>
        
        {/* Floating Action Button */}
        <FloatingActionButton />
        </Animated.View>
      </SafeAreaView>
    </AppBar>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  animatedContainer: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    marginHorizontal: Layout.spacing.large,
    marginTop: 0,
    marginBottom: Spacing.SECTION_TO_SECTION,
  },
  title: {
    fontSize: Fonts.sizes.xlarge,
    fontWeight: Fonts.weights.bold,
    color: Colors.primary,
    marginBottom: Layout.spacing.xxlarge,
    textAlign: "center",
  },
  contactInfo: {
    marginBottom: Layout.spacing.xxlarge,
  },
  contactItem: {
    flexDirection: "row",
    marginBottom: Layout.spacing.large,
  },
  iconContainer: {
    width: 50,
    height: 50,
    backgroundColor: Colors.lightGray,
    borderRadius: Layout.borderRadius.round,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Layout.spacing.medium,
  },
  contactDetails: {
    justifyContent: "center",
  },
  contactLabel: {
    fontSize: Fonts.sizes.regular,
    fontWeight: Fonts.weights.bold,
    color: Colors.text,
  },
  contactValue: {
    fontSize: Fonts.sizes.medium,
    color: Colors.lightText,
    marginTop: 5,
  },
  link: {
    color: Colors.primary,
    textDecorationLine: "underline",
  },
  socialLinks: {
    marginBottom: Layout.spacing.xxlarge,
  },
  socialTitle: {
    fontSize: Fonts.sizes.large,
    fontWeight: Fonts.weights.bold,
    color: Colors.primary,
    marginBottom: Layout.spacing.medium,
  },
  socialIcons: {
    flexDirection: "row",
  },
  socialIcon: {
    width: 40,
    height: 40,
    backgroundColor: Colors.lightGray,
    borderRadius: Layout.borderRadius.round,
    justifyContent: "center",
    alignItems: "center",
    marginRight: Layout.spacing.medium,
  },
  formContainer: {
    backgroundColor: '#d3e1e1',
    padding: 20,
    borderRadius: 18,
    marginBottom: Spacing.SECTION_TO_SECTION,
    borderWidth: 2,
    borderColor: '#b7c9c9',
    shadowColor: Colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  formTitle: {
    fontSize: Fonts.sizes.large,
    fontWeight: Fonts.weights.bold,
    color: Colors.primary,
    marginBottom: Spacing.TEXT_SPACING,
    textAlign: 'left',
  },
  formSubtitle: {
    fontSize: Fonts.sizes.medium,
    color: '#222',
    marginBottom: Layout.spacing.medium,
    textAlign: 'left',
    fontWeight: Fonts.weights.normal,
  },
  fieldContainer: {
    marginBottom: Spacing.FORM_INTERNAL,
  },
  datePickerContainer: {
    marginBottom: Spacing.FORM_INTERNAL,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: Layout.borderRadius.medium,
    padding: Spacing.FORM_INTERNAL,
    fontSize: Fonts.sizes.regular,
    color: '#222',
    minHeight: 48,
  },
  inputError: {
    borderColor: Colors.error,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingHorizontal: 4,
  },
  errorIcon: {
    marginRight: 6,
  },
  errorText: {
    color: Colors.error,
    fontSize: Fonts.sizes.small,
    fontWeight: Fonts.weights.medium,
    flex: 1,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: Layout.borderRadius.medium,
    paddingVertical: Spacing.FORM_INTERNAL,
    paddingHorizontal: Spacing.FORM_INTERNAL,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 48,
  },
  dropdownText: {
    fontSize: Fonts.sizes.regular,
    color: '#222',
  },
  dropdownOptions: {
    backgroundColor: '#fff',
    borderRadius: Layout.borderRadius.medium,
    marginTop: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dropdownOption: {
    paddingVertical: Spacing.FORM_INTERNAL,
    paddingHorizontal: Spacing.FORM_INTERNAL,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dropdownOptionText: {
    fontSize: Fonts.sizes.regular,
    color: '#222',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  requiredNote: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginBottom: 16,
    textAlign: 'center',
  },
  heroSection: {
    height: 180,
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
    paddingHorizontal: Layout.spacing.large,
    paddingVertical: Layout.spacing.large,
  },
  heroTitle: {
    fontSize: Fonts.sizes.xxlarge,
    fontWeight: Fonts.weights.bold,
    color: Colors.overlayText,
    letterSpacing: 1,
    textAlign: "left",
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  contactCardWrapper: {
    marginHorizontal: Layout.spacing.large,
    marginTop: 0,
    marginBottom: Spacing.SECTION_TO_SECTION,
    borderRadius: Layout.borderRadius.large,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: Colors.black,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  contactCardBg: {
    width: '100%',
    minHeight: 220,
    justifyContent: 'center',
  },
  contactCardBgImg: {
    resizeMode: 'cover',
  },
  contactCardOverlay: {
    backgroundColor: Colors.contactOverlay,
    padding: Layout.spacing.large,
    borderRadius: 0,
  },
  supportContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.TEXT_SPACING,
  },
  supportLine: {
    width: 40,
    height: 3,
    backgroundColor: '#4db3c9',
    marginRight: Layout.spacing.medium,
  },
  contactCardTitle: {
    color: Colors.overlayTextAccent,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  contactCardSubtitle: {
    color: Colors.overlayText,
    fontSize: Fonts.sizes.large,
    fontWeight: Fonts.weights.bold,
    marginBottom: Spacing.TEXT_SPACING,
  },
  contactCardDesc: {
    color: Colors.overlayTextSecondary,
    fontSize: Fonts.sizes.medium,
    marginBottom: Layout.spacing.medium,
  },
  contactCardInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Layout.spacing.small,
  },
  contactCardIcon: {
    marginRight: Layout.spacing.medium,
  },
  contactCardInfoText: {
    color: Colors.overlayText,
    fontSize: Fonts.sizes.regular,
    flex: 1,
    flexWrap: 'wrap',
  },
  socialLinksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Layout.spacing.large,
    gap: Layout.spacing.large,
  },
  socialIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginVertical: Layout.spacing.large,
  },
  mapContainer: {
    marginBottom: Layout.spacing.xxlarge,
  },
});


