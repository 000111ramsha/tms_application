import { useState, useEffect, useCallback, useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Linking,
  Pressable,
  Keyboard,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Animated,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Import components
import AppBar from "../src/components/AppBar";
import TakeControlSection from "../src/components/TakeControlSection";
import HeroImage from "../src/components/HeroImage";
import OptimizedImage from "../src/components/OptimizedImage";
import FAQSection from "../src/components/FAQSection";
import FloatingActionButton from "../src/components/FloatingActionButton";
import ModernDatePicker from "../src/components/ModernDatePicker";

// Import context
import { useScrollViewPadding } from "../src/context/BottomNavContext";

// Import hooks
import { useResponsiveDimensions } from "../src/hooks/useResponsiveDimensions";
import { useFormReducer } from "../src/hooks/useFormReducer";

// Import constants
import Colors from "../src/constants/Colors";
import Fonts from "../src/constants/Fonts";
import Layout from "../src/constants/Layout";

// Import utils
import { validateEmail } from "../src/utils/validation";
import { preloadCriticalImages } from "../src/utils/imageCache";

/**
 * Home Screen Component - Enhanced with better UX and performance
 */
export default function HomeScreen() {
  const router = useRouter();
  const scrollViewPadding = useScrollViewPadding();
  const { window: dimensions, isTablet, isMobile, isSmallDevice } = useResponsiveDimensions();
  
  // Loading and refresh states
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  
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
      date: null, // Changed to null for date object
      consultationType: "Consultation",
    },
    // Initial errors
    {
      name: "",
      email: "",
      date: "",
      consultationType: "",
    },
    // Initial pressed states
    {
      learnMore: false,
      contactForm: false,
    }
  );

  // Separate state for UI elements that don't belong in the form
  const [showConsultationOptions, setShowConsultationOptions] = useState(false);

  // Memoized FAQ items for better performance
  const faqItems = useMemo(() => [
    {
      question: "Is TMS Therapy Painful?",
      answer:
        "No, TMS therapy is generally not painful. Most patients describe a tapping or knocking sensation on their scalp during treatment. Some may experience mild discomfort that typically subsides after the first few sessions.",
    },
    {
      question: "How Long Does TMS Treatment Session Last?",
      answer:
        "A typical TMS treatment session lasts about 20-40 minutes. The full course of treatment usually involves 5 sessions per week for 4-6 weeks, totaling 20-30 sessions.",
    },
    {
      question: "Will My Insurance Cover TMS?",
      answer:
        "Many insurance providers now cover TMS therapy for patients who have not responded to traditional depression treatments. Our staff will work with you to verify your coverage and explain any out-of-pocket costs.",
    },
    {
      question: "How Long Will The Effects of TMS Therapy Last?",
      answer:
        "The effects of TMS therapy can last for months to years. Some patients experience long-term relief after a single course of treatment, while others may benefit from occasional maintenance sessions.",
    },
    {
      question: "Can TMS Therapy Be Combined with Medication?",
      answer:
        "Yes, TMS therapy can be used alongside medication. In fact, many patients continue their current medications during TMS treatment. Your doctor will provide guidance on your specific treatment plan.",
    },
  ], []);

  // Enhanced initialization with loading states
  useEffect(() => {
    const initializeScreen = async () => {
      try {
        setIsLoading(true);
        await preloadCriticalImages();
        
        // Animate content in
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ]).start();
        
      } catch (error) {
        console.error('Error initializing HomeScreen:', error);
        Alert.alert('Error', 'Failed to load some content. Please try refreshing.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeScreen();
  }, [fadeAnim, slideAnim]);

  // Enhanced refresh functionality
  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await preloadCriticalImages();
      // Reset form if needed
      clearAllErrors();
    } catch (error) {
      console.error('Error refreshing:', error);
      Alert.alert('Error', 'Failed to refresh content.');
    } finally {
      setIsRefreshing(false);
    }
  }, [clearAllErrors]);

  // Enhanced contact handlers with better error handling
  const handleCall = useCallback(() => {
    try {
      Linking.openURL("tel:850-254-9575");
    } catch (error) {
      Alert.alert('Error', 'Unable to make phone call. Please dial 850-254-9575 manually.');
    }
  }, []);

  const handleEmail = useCallback(() => {
    try {
      Linking.openURL("mailto:info@tmsofemeraldcoast.com");
    } catch (error) {
      Alert.alert('Error', 'Unable to open email. Please email info@tmsofemeraldcoast.com manually.');
    }
  }, []);

  const handleBBBBadgePress = useCallback(() => {
    try {
      Linking.openURL("https://www.bbb.org/us/fl/fort-walton-beach/profile/mental-health-services/tms-of-emerald-coast-0683-90100824/#sealclick");
    } catch (error) {
      Alert.alert('Error', 'Unable to open BBB page. Please visit our website for more information.');
    }
  }, []);

  // Enhanced form validation with better UX
  const validateForm = useCallback(() => {
    let valid = true;
    const newErrors = {};

    if (!fields.name.trim()) {
      newErrors.name = "Please enter your name";
      valid = false;
    } else if (fields.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
      valid = false;
    }

    if (!fields.date) {
      newErrors.date = "Please select your preferred date";
      valid = false;
    } else {
      // Validate that the selected date is not today or in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const selectedDate = new Date(fields.date);
      selectedDate.setHours(0, 0, 0, 0);
      
      if (selectedDate <= today) {
        newErrors.date = "Please select a future date";
        valid = false;
      }
    }

    if (!fields.email.trim()) {
      newErrors.email = "Please enter your email";
      valid = false;
    } else if (!validateEmail(fields.email.trim())) {
      newErrors.email = "Please enter a valid email address";
      valid = false;
    }

    if (!fields.consultationType || fields.consultationType === "") {
      newErrors.consultationType = "Please select a consultation type";
      valid = false;
    }

    // Set all errors at once for better UX
    Object.keys(newErrors).forEach(key => setError(key, newErrors[key]));
    Object.keys(errors).forEach(key => {
      if (!newErrors[key]) clearError(key);
    });

    return valid;
  }, [fields, errors, setError, clearError]);

  // Enhanced form submission with loading states and better feedback
  const handleContactSubmit = useCallback(async () => {
    if (!validateForm()) {
      // Haptic feedback for errors (if available)
      try {
        const { Haptics } = await import('expo-haptics');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } catch (e) {
        // Haptics not available, continue silently
      }
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call - replace with actual submission logic
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Form submitted:', fields);
      
      // Success feedback
      try {
        const { Haptics } = await import('expo-haptics');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (e) {
        // Haptics not available, continue silently
      }
      
      Alert.alert(
        "Thank You!",
        "We've received your information and will get back to you soon!",
        [{ text: "OK", style: "default" }]
      );
      
      resetForm();
      setShowConsultationOptions(false);
      
    } catch (error) {
      console.error('Form submission error:', error);
      Alert.alert(
        "Error",
        "There was a problem submitting your information. Please try again or call us directly.",
        [
          { text: "Try Again", style: "default" },
          { text: "Call Now", style: "default", onPress: handleCall }
        ]
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, fields, resetForm, handleCall]);

  // Enhanced navigation with loading states
  const handleLearnMore = useCallback(() => {
    try {
      router.push("/treatment");
    } catch (error) {
      Alert.alert('Error', 'Unable to navigate. Please try again.');
    }
  }, [router]);

  const handleWatchVideo = useCallback(() => {
    // TODO: Implement video modal or navigation
    Alert.alert(
      "Coming Soon",
      "Video content will be available soon. Contact us for more information!",
      [
        { text: "Contact Us", onPress: () => router.push("/contact") },
        { text: "OK", style: "cancel" }
      ]
    );
  }, [router]);

  // Show loading screen
  if (isLoading) {
    return (
      <AppBar>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </AppBar>
    );
  }

  return (
    <AppBar>
      <View style={styles.container}>
        <Animated.View 
          style={[
            styles.animatedContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <ScrollView
            style={styles.content}
            contentContainerStyle={scrollViewPadding}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={onRefresh}
                colors={[Colors.primary]}
                tintColor={Colors.primary}
              />
            }
            showsVerticalScrollIndicator={false}
          >
            {/* Hero Section */}
            <HeroImage 
              source={require("../assets/hero-background.jpeg")}
              height={isMobile ? dimensions.height * 0.6 : isTablet ? 500 : 600}
              priority={true}
            >
              <View style={styles.heroOverlay}>
                <View style={[styles.heroContent, isMobile && { width: "100%" }]}>
                  <Text 
                    style={[styles.heroTitle, styles.heroTitleMargin, isSmallDevice && { fontSize: 28 }]}
                    accessibilityRole="header"
                    accessibilityLevel={1}
                  >
                    Discover Hope Without
                  </Text>
                  <Text 
                    style={[styles.heroTitle, isSmallDevice && { fontSize: 28 }]}
                    accessibilityRole="header"
                    accessibilityLevel={1}
                  >
                    Medication
                  </Text>

                  <TouchableOpacity 
                    style={styles.bbbBadge} 
                    onPress={handleBBBBadgePress}
                    accessibilityRole="button"
                    accessibilityLabel="Better Business Bureau Accredited Business"
                    accessibilityHint="Opens BBB profile in browser"
                  >
                    <OptimizedImage 
                      source={require("../assets/bbb-badge.png")} 
                      style={styles.bbbImageLarge} 
                      resizeMode="contain"
                      priority={true}
                      lazy={false}
                      accessibilityLabel="Better Business Bureau Accredited Business Badge"
                    />
                  </TouchableOpacity>

                  <Text style={[styles.heroDescription, isSmallDevice && { fontSize: 14 }]}>
                    If you're feeling overwhelmed and tired of the side effects of medication – TMS (Transcranial Magnetic
                    Stimulation) offers a safe, non-invasive, FDA approved option for treating depression. At TMS of Emerald
                    Coast, our experienced team is here to help you find relief.
                  </Text>

                  {/* Buttons Row */}
                  <View style={styles.heroButtonsRow}>
                    <TouchableOpacity 
                      style={styles.contactButton} 
                      onPress={() => router.push("/contact")}
                      accessibilityRole="button"
                      accessibilityLabel="Contact Us"
                    >
                      <Text style={styles.contactButtonText}>Contact Us</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.videoButton}
                      onPress={handleWatchVideo}
                      accessibilityRole="button"
                      accessibilityLabel="Watch Video"
                    >
                      <Ionicons name="play-outline" size={16} color="white" style={styles.videoIcon} />
                      <Text style={styles.videoButtonText}>Watch Video</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </HeroImage>

            {/* Enhanced Contact Form Section */}
            <View style={styles.heroFormWrapper}>
              <ImageBackground 
                source={require("../assets/contact-hero.jpg")} 
                style={styles.heroFormBackground}
                imageStyle={styles.heroFormBackgroundImage}
              >
                <Pressable
                  style={styles.heroFormSection}
                  onPress={() => {
                    clearAllErrors();
                    Keyboard.dismiss();
                  }}
                >
                  <Text style={styles.heroFormTitle} numberOfLines={2} ellipsizeMode="tail">
                    Get In Touch With TMS Of Emerald Coast Today
                  </Text>
              
              <TextInput
                style={[styles.heroFormInput, errors.name ? styles.heroFormInputError : null]}
                placeholder="Your Name"
                value={fields.name}
                onChangeText={(value) => setField("name", value)}
                placeholderTextColor="#bdbdbd"
                onFocus={() => clearError("name")}
                accessibilityLabel="Your Name"
                accessibilityHint="Enter your full name"
                autoCapitalize="words"
                autoCorrect={false}
                maxLength={50}
                returnKeyType="next"
                onSubmitEditing={() => {
                  // Focus will move to next input automatically
                }}
              />
              {errors.name ? (
                <View style={styles.heroFormErrorContainer}>
                  <Ionicons name="alert-circle" size={14} color={Colors.error} style={styles.heroFormErrorIcon} />
                  <Text style={styles.heroFormError}>{errors.name}</Text>
                </View>
              ) : null}
              
              <ModernDatePicker
                value={fields.date}
                onDateChange={(date) => setField("date", date)}
                placeholder="Select Preferred Date"
                error={errors.date}
                onFocus={() => clearError("date")}
                onBlur={() => {}}
                style={styles.heroFormDatePicker}
              />
              
              <TextInput
                style={[styles.heroFormInput, errors.email ? styles.heroFormInputError : null]}
                placeholder="Your Email"
                value={fields.email}
                onChangeText={(value) => setField("email", value)}
                placeholderTextColor="#bdbdbd"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                onFocus={() => clearError("email")}
                accessibilityLabel="Your Email"
                accessibilityHint="Enter your email address"
                maxLength={100}
                returnKeyType="done"
              />
              {errors.email ? (
                <View style={styles.heroFormErrorContainer}>
                  <Ionicons name="alert-circle" size={14} color={Colors.error} style={styles.heroFormErrorIcon} />
                  <Text style={styles.heroFormError}>{errors.email}</Text>
                </View>
              ) : null}
              
              <TouchableOpacity
                style={[styles.heroFormDropdown, errors.consultationType ? styles.heroFormInputError : null]}
                onPress={() => setShowConsultationOptions(!showConsultationOptions)}
                onPressIn={() => clearError("consultationType")}
                accessibilityRole="button"
                accessibilityLabel="Consultation Type"
                accessibilityHint="Select type of consultation"
                accessibilityState={{ expanded: showConsultationOptions }}
              >
                <Text style={styles.heroFormDropdownText}>{fields.consultationType}</Text>
                <Ionicons 
                  name={showConsultationOptions ? "chevron-up" : "chevron-down"} 
                  size={20} 
                  color="#333" 
                  style={{ marginLeft: 8 }} 
                />
              </TouchableOpacity>
              
              {showConsultationOptions && (
                <View style={styles.heroFormDropdownOptions}>
                  {['Consultation', 'Family Counseling', 'Anxiety Disorder', 'Depression', 'TMS Treatment'].map(option => (
                    <TouchableOpacity
                      key={option}
                      style={styles.heroFormDropdownOption}
                      onPress={() => {
                        setField("consultationType", option);
                        setShowConsultationOptions(false);
                      }}
                      accessibilityRole="button"
                      accessibilityLabel={option}
                    >
                      <Text style={styles.heroFormDropdownOptionText}>{option}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              
              {errors.consultationType ? (
                <View style={styles.heroFormErrorContainer}>
                  <Ionicons name="alert-circle" size={14} color={Colors.error} style={styles.heroFormErrorIcon} />
                  <Text style={styles.heroFormError}>{errors.consultationType}</Text>
                </View>
              ) : null}
              
              <TouchableOpacity 
                style={[
                  styles.heroFormButton,
                  pressedStates.contactForm && styles.heroFormButtonPressed,
                  isSubmitting && styles.heroFormButtonDisabled
                ]} 
                onPress={handleContactSubmit}
                onPressIn={() => setPressedState("contactForm", true)}
                onPressOut={() => setPressedState("contactForm", false)}
                activeOpacity={0.7}
                disabled={isSubmitting}
                accessibilityRole="button"
                accessibilityLabel="Submit Contact Form"
                accessibilityState={{ disabled: isSubmitting }}
              >
                {isSubmitting ? (
                  <View style={styles.submitButtonContent}>
                    <ActivityIndicator size="small" color={Colors.white} style={{ marginRight: 8 }} />
                    <Text style={styles.heroFormButtonText}>SUBMITTING...</Text>
                  </View>
                ) : (
                  <Text style={[
                    styles.heroFormButtonText,
                    pressedStates.contactForm && styles.heroFormButtonTextPressed
                  ]}>
                    CONTACT US
                  </Text>
                                 )}
               </TouchableOpacity>
             </Pressable>
              </ImageBackground>
            </View>

            {/* Enhanced TMS Info Section */}
            <View style={styles.tmsInfoSection}>
              <OptimizedImage 
                source={require("../assets/patient-image.png")} 
                style={styles.tmsInfoImage} 
                resizeMode="cover"
                lazy={true}
                priority={false}
                accessibilityLabel="Patient receiving TMS therapy treatment"
              />
              <Text 
                style={styles.tmsInfoHeading}
                accessibilityRole="header"
                accessibilityLevel={2}
              >
                Be Part Of The 4 In 5 Patients Experiencing Relief With TMS.
              </Text>
              <Text style={styles.tmsInfoSubheading}>Embracing the healing power of magnetic fields</Text>
              <Text style={styles.tmsInfoText}>
                Transcranial Magnetic Stimulation (TMS) is a non-invasive procedure that uses magnetic fields to stimulate nerve cells in the brain. This innovative treatment has emerged as a promising solution for individuals struggling with various mental health conditions, particularly depression.
              </Text>
              <Text style={styles.tmsInfoText2}>
                <Text style={styles.tmsInfoSubheading2}>How Does it Work?</Text>{'\n'}
                TMS therapy works by using magnetic pulses to gently stimulate specific areas of the brain involved in mood regulation. These pulses help activate brain cells, which can improve symptoms of depression and other mental health conditions. The procedure is non-invasive, painless, and does not require medication.
              </Text>
              <View style={styles.tmsInfoButtonRow}>
                <TouchableOpacity 
                  style={[
                    styles.tmsInfoButton,
                    pressedStates.learnMore && styles.tmsInfoButtonPressed
                  ]}
                  onPress={handleLearnMore}
                  onPressIn={() => setPressedState("learnMore", true)}
                  onPressOut={() => setPressedState("learnMore", false)}
                  activeOpacity={1}
                  accessibilityRole="button"
                  accessibilityLabel="Learn More about TMS"
                >
                  <Text style={[
                    styles.tmsInfoButtonText,
                    pressedStates.learnMore && styles.tmsInfoButtonTextPressed
                  ]}>
                    LEARN MORE
                  </Text>
                  <Ionicons 
                    name="arrow-forward" 
                    size={18} 
                    color={pressedStates.learnMore ? Colors.white : Colors.primary} 
                    style={styles.tmsInfoButtonIcon} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Military TMS Section */}
            <View style={styles.militaryCardSection}>
              <View style={styles.militaryCard}>
                <OptimizedImage 
                  source={require("../assets/tms-treatment.jpg")} 
                  style={styles.militaryCardImage} 
                  resizeMode="cover"
                  lazy={true}
                  priority={false}
                  accessibilityLabel="TMS treatment equipment and facility"
                />
                <Text 
                  style={styles.militaryCardHeading}
                  accessibilityRole="header"
                  accessibilityLevel={2}
                >
                  Transcranial Magnetic Stimulation TMS
                </Text>
                <Text style={styles.militaryCardText}>
                  Therapy is increasingly being used to support military personnel, particularly in addressing conditions like Post-Traumatic Stress Disorder (PTSD), depression, and anxiety, which are common among veterans and active-duty members.
                </Text>
              </View>

              <Text 
                style={styles.militarySectionHeading}
                accessibilityRole="header"
                accessibilityLevel={3}
              >
                How TMS Helps Military Personnel
              </Text>
              
              <Text style={styles.militarySectionSubheading}>PTSD Treatment</Text>
              <Text style={styles.militarySectionText}>
                TMS targets areas of the brain linked to emotional regulation and fear response, helping reduce PTSD symptoms such as flashbacks, hypervigilance, and mood instability.
              </Text>
              
              <Text style={styles.militarySectionSubheading}>Depression Relief</Text>
              <Text style={styles.militarySectionText}>
                Many military members experience treatment-resistant depression. TMS is an FDA-approved, non-invasive option that has shown effectiveness when traditional therapies fail.
              </Text>
              
              <Text style={styles.militarySectionSubheading}>Traumatic Brain Injury (TBI) Support</Text>
              <Text style={styles.militarySectionText}>
                Some research suggests TMS may help with cognitive function and mood regulation in those who have suffered mild TBI.
              </Text>
              
              <Text style={styles.militarySectionSubheading}>Anxiety & Insomnia</Text>
              <Text style={styles.militarySectionText}>
                TMS can regulate brain activity associated with anxiety disorders and sleep disturbances.
              </Text>
              
              <Text style={styles.militarySectionSubheading}>Non-Medicated Solution</Text>
              <Text style={styles.militarySectionText}>
                Many military personnel prefer non-drug treatments to avoid side effects and dependency issues associated with medications.
              </Text>

              <Text 
                style={styles.militarySectionHeading2}
                accessibilityRole="header"
                accessibilityLevel={3}
              >
                Why Military Personnel Benefit From TMS
              </Text>
              <View style={styles.militarySectionList}>
                <Text style={styles.militarySectionListItem}>• Non-invasive & drug-free</Text>
                <Text style={styles.militarySectionListItem}>• Minimal side effects (usually mild headaches or scalp discomfort)</Text>
                <Text style={styles.militarySectionListItem}>• Quick sessions (typically 20-40 minutes per session, 5 days a week for 4-6 weeks)</Text>
                <Text style={styles.militarySectionListItem}>• Long-term effect: Studies suggest benefits last for months after treatment.</Text>
              </View>

              <Text 
                style={styles.militarySectionHeading2}
                accessibilityRole="header"
                accessibilityLevel={3}
              >
                Availability & Military Coverage
              </Text>
              <View style={styles.militarySectionList}>
                <Text style={styles.militarySectionListItem}>• The U.S. Department of Veterans Affairs (VA) has been integrating TMS into PTSD and depression treatment programs.</Text>
                <Text style={styles.militarySectionListItem}>• TRICARE (military health insurance) and the VA may cover TMS therapy for qualifying service members and veterans.</Text>
                <Text style={styles.militarySectionListItem}>• Some private clinics also offer TMS specifically for veterans.</Text>
              </View>
                         </View>

             {/* FAQ Section */}
             <FAQSection faqItems={faqItems} />

            {/* Take Control Section */}
            <TakeControlSection 
              imageSource={require("../assets/device.png")}
            />

                     </ScrollView>
         </Animated.View>
         
         {/* Floating Action Button */}
         <FloatingActionButton />
       </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: Fonts.sizes.medium,
    color: Colors.primary,
    fontWeight: Fonts.weights.medium,
  },

  heroOverlay: {
    backgroundColor: Colors.heroOverlay,
    position: "absolute",
    width: "100%",
    height: "100%",
    flexDirection: "row",
    padding: Layout.spacing.large,
  },
  heroContent: {
    flex: 1,
    justifyContent: "center",
    width: "50%",
    marginTop: 24,
  },
  heroTitleMargin: {
    marginBottom: 0,
  },
  heroTitle: {
    color: Colors.overlayText,
    fontSize: 44,
    fontWeight: Fonts.weights.bold,
    marginBottom: 0,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  bbbBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 0,
    paddingBottom: 0,
    marginTop: -16,
  },
  bbbImageLarge: {
    width: 160,
    height: 160,
    marginBottom: 0,
    paddingBottom: 0,
  },
  heroDescription: {
    color: Colors.white,
    fontSize: 16, // Increased from Fonts.sizes.regular (16) to 18
    lineHeight: 24, // Increased line height to match the new font size
    marginBottom: 30,
    marginTop: -32,
    paddingTop: 0,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  heroButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 16,
  },
  contactButton: {
    backgroundColor: Colors.secondary,
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: Layout.borderRadius.medium,
    alignSelf: 'flex-start',
    marginRight: 12,
  },
  contactButtonText: {
    color: Colors.white,
    fontSize: Fonts.sizes.medium,
    fontWeight: Fonts.weights.bold,
  },
  videoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.white,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: Layout.borderRadius.medium,
    backgroundColor: Colors.transparent,
  },
  videoIcon: {
    marginRight: 6,
  },
  videoButtonText: {
    color: Colors.white,
    fontSize: Fonts.sizes.medium,
    fontWeight: Fonts.weights.bold,
  },
  heroFormWrapper: {
    marginHorizontal: 0,
    marginTop: 32,
    marginBottom: 50,
    borderRadius: 0,
    overflow: 'hidden',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  heroFormBackground: {
    width: '100%',
  },
  heroFormBackgroundImage: {
    borderRadius: 0,
    resizeMode: 'cover',
  },
  heroFormSection: {
    backgroundColor: Colors.formBackground,
    paddingVertical: 20,
    paddingHorizontal: 14,
  },
  heroFormTitle: {
    color: Colors.white,
    fontSize: 15.5,
    fontWeight: Fonts.weights.bold,
    textAlign: 'left',
    marginBottom: 18,
    width: '100%',
    flexShrink: 1,
  },
  heroFormTitleSecond: {
    color: Colors.white,
    fontSize: 15.5,
    fontWeight: Fonts.weights.bold,
    textAlign: 'left',
    marginBottom: 18,
    marginTop: 0,
  },
  heroFormInput: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: Layout.borderRadius.medium,
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontSize: Fonts.sizes.medium,
    marginBottom: 16,
  },
  heroFormDatePicker: {
    marginBottom: 16,
  },
  heroFormInputError: {
    borderColor: Colors.error,
  },
  heroFormDropdown: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: Layout.borderRadius.medium,
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  heroFormDropdownText: {
    fontSize: Fonts.sizes.medium,
    color: '#222',
  },
  heroFormDropdownOptions: {
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.medium,
    marginBottom: 18,
    overflow: 'hidden',
  },
  heroFormDropdownOption: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray,
  },
  heroFormDropdownOptionText: {
    fontSize: Fonts.sizes.medium,
    color: '#222',
  },
  heroFormButton: {
    backgroundColor: Colors.secondary,
    borderRadius: Layout.borderRadius.medium,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
  },
  heroFormButtonText: {
    color: Colors.white,
    fontSize: Fonts.sizes.medium,
    fontWeight: Fonts.weights.bold,
    letterSpacing: 1,
  },
  heroFormButtonPressed: {
    backgroundColor: Colors.secondary,
  },
  heroFormButtonTextPressed: {
    color: Colors.white,
  },
  heroFormButtonDisabled: {
    backgroundColor: Colors.darkGray,
    opacity: 0.7,
  },
  heroFormErrorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  heroFormErrorIcon: {
    marginRight: 6,
  },
  heroFormError: {
    color: Colors.error,
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  submitButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tmsInfoSection: {
    backgroundColor: Colors.primary,
    borderRadius: 0,
    padding: 24,
    marginHorizontal: 0,
    marginBottom: 50,
  },
  tmsInfoHeading: {
    color: Colors.white,
    fontSize: Fonts.sizes.large,
    fontWeight: Fonts.weights.bold,
    marginBottom: 10,
    textAlign: 'left',
  },
  tmsInfoSubheading: {
    color: Colors.accent,
    fontSize: 15,
    fontWeight: Fonts.weights.bold,
    marginBottom: 10,
    textAlign: 'left',
  },
  tmsInfoSubheading2: {
    color: Colors.accent,
    fontSize: 15,
    fontWeight: Fonts.weights.bold,
    marginBottom: 10,
    textAlign: 'left',
  },
  tmsInfoText: {
    color: Colors.white,
    fontSize: Fonts.sizes.medium,
    marginBottom: 10,
    textAlign: 'left',
  },
  tmsInfoText2: {
    color: Colors.white,
    fontSize: Fonts.sizes.medium,
    marginBottom: 18,
    textAlign: 'left',
  },
  tmsInfoButtonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
    flexWrap: 'nowrap',
    justifyContent: 'flex-start',
  },
  tmsInfoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: Layout.borderRadius.medium,
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
  },
  tmsInfoButtonText: {
    color: Colors.primary,
    fontWeight: Fonts.weights.bold,
    fontSize: 15,
    marginRight: 8,
  },
  tmsInfoButtonIcon: {
    marginLeft: 0,
  },
  tmsInfoButtonPressed: {
    backgroundColor: Colors.black,
  },
  tmsInfoButtonTextPressed: {
    color: Colors.white,
  },
  tmsInfoImage: {
    width: '100%',
    height: 140,
    borderRadius: Layout.borderRadius.large,
    marginTop: 0,
    marginBottom: 18,
  },
  militaryCardSection: {
    marginHorizontal: 0,
    marginBottom: 50,
    paddingHorizontal: 0,
  },
  militaryCard: {
    backgroundColor: Colors.primary,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    padding: 24,
    marginHorizontal: 0,
    marginBottom: 18,
    alignItems: 'flex-start',
  },
  militaryCardHeading: {
    color: Colors.white,
    fontSize: Fonts.sizes.large,
    fontWeight: Fonts.weights.bold,
    marginBottom: 8,
    textAlign: 'left',
  },
  militaryCardText: {
    color: Colors.white,
    fontSize: Fonts.sizes.medium,
    marginBottom: 12,
    textAlign: 'left',
  },
  militaryCardImage: {
    width: '100%',
    height: 170,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    marginTop: 0,
    marginBottom: 18,
  },
  militarySectionHeading: {
    color: Colors.primary,
    fontSize: 17,
    fontWeight: Fonts.weights.bold,
    marginBottom: 8,
    marginTop: 8,
    paddingHorizontal: 24,
    textAlign: 'left',
  },
  militarySectionHeading2: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: Fonts.weights.bold,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 24,
    textAlign: 'left',
  },
  militarySectionSubheading: {
    color: Colors.primary,
    fontWeight: Fonts.weights.bold,
    fontSize: 15,
    marginBottom: 2,
    marginTop: 8,
    paddingHorizontal: 24,
    textAlign: 'left',
  },
  militarySectionText: {
    color: Colors.text,
    fontSize: Fonts.sizes.medium,
    marginBottom: 2,
    paddingHorizontal: 24,
    textAlign: 'left',
  },
  militarySectionList: {
    paddingHorizontal: 24,
    paddingLeft: 36,
    marginBottom: 8,
  },
  militarySectionListItem: {
    color: Colors.text,
    fontSize: Fonts.sizes.medium,
    marginBottom: 2,
    textAlign: 'left',
  },
});
