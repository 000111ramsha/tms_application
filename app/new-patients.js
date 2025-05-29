import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView, Image, Linking, Alert, AppState, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";

// Import components
import AppBar from "../src/components/AppBar";
import TakeControlSection from "../src/components/TakeControlSection";
import FloatingActionButton from "../src/components/FloatingActionButton";

// Import context
import { useScrollViewPadding } from "../src/context/BottomNavContext";

// Import hooks
import { useResponsiveDimensions } from "../src/hooks/useResponsiveDimensions";
import { useScreenAnimation } from "../src/hooks/useScreenAnimation";

// Import constants
import Colors from "../src/constants/Colors";
import Fonts from "../src/constants/Fonts";
import Layout from "../src/constants/Layout";

/**
 * New Patients Screen Component
 */
export default function NewPatientsScreen() {
  const router = useRouter();
  const scrollViewPadding = useScrollViewPadding();
  const { window: { width: screenWidth } } = useResponsiveDimensions();
  const [activeLogoIndex, setActiveLogoIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const logoScrollRef = useRef(null);
  const autoScrollIntervalRef = useRef(null);
  
  // Use screen animation hook
  const { animatedStyle } = useScreenAnimation();
  
  // Press state for buttons
  const [isCoveragePressed, setIsCoveragePressed] = useState(false);
  const [isFormCardPressed, setIsFormCardPressed] = useState({});
  const [isExpectPressed, setIsExpectPressed] = useState(false);
  const [isAssessmentPressed, setIsAssessmentPressed] = useState(false);
  const [isAppointmentPressed, setIsAppointmentPressed] = useState(false);
  const logos = [
    require("../assets/cigna.png"),
    require("../assets/tricare.png"),
    require("../assets/aetna.png"),
    require("../assets/humana.png"),

    // Add more logos as needed
  ];

  // Function to scroll to the next logo - memoized to prevent unnecessary re-renders
  const scrollToNextLogo = useCallback(() => {
    if (logoScrollRef.current && logos.length > 0) {
      setActiveLogoIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % logos.length;
        logoScrollRef.current.scrollTo({
          x: nextIndex * screenWidth,
          animated: true
        });
        return nextIndex;
      });
    }
  }, [screenWidth, logos.length]);

  // Set up auto-scrolling with proper cleanup
  useEffect(() => {
    if (isAutoScrolling) {
      autoScrollIntervalRef.current = setInterval(() => {
        scrollToNextLogo();
      }, 3000); // Change slide every 3 seconds
    } else {
      // Clear interval when auto-scrolling is disabled
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
        autoScrollIntervalRef.current = null;
      }
    }

    // Cleanup function to prevent memory leaks
    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
        autoScrollIntervalRef.current = null;
      }
    };
  }, [isAutoScrolling]); // Removed activeLogoIndex dependency to prevent unnecessary re-renders

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
        autoScrollIntervalRef.current = null;
      }
    };
  }, []);

  // Handle app state changes to pause/resume auto-scroll
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        // Pause auto-scrolling when app goes to background
        setIsAutoScrolling(false);
      } else if (nextAppState === 'active') {
        // Resume auto-scrolling when app becomes active
        setIsAutoScrolling(true);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription?.remove();
    };
  }, []);

  // Handle user interaction with the carousel - memoized for performance
  const handleCarouselTouchStart = useCallback(() => {
    setIsAutoScrolling(false);
  }, []);

  const handleCarouselTouchEnd = useCallback(() => {
    // Add a small delay before resuming auto-scroll to prevent immediate scrolling
    setTimeout(() => {
      setIsAutoScrolling(true);
    }, 1000);
  }, []);

  const handleOpenDocument = async (documentName) => {
    try {
      let url;
      if (documentName === 'pre-cert-med-list.pdf') {
        url = 'https://tmsofemeraldcoast.com/wp-content/uploads/2025/04/medlist-2025_Fillable.pdf';
      } else if (documentName === 'phq-9.pdf') {
        url = 'https://tmsofemeraldcoast.com/wp-content/uploads/2025/04/PHQ9_Fillable-1.pdf';
      } else if (documentName === 'patient-intake.pdf') {
        url = 'https://tmsofemeraldcoast.com/wp-content/uploads/2025/04/Patient-Demographic-Sheet_Fillable.pdf';
      } else {
        url = `https://tmsofemeraldcoast.com/documents/${documentName}`;
      }

      const supported = await Linking.canOpenURL(url);

      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "Cannot open the document. Please try again later.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to open the document. Please try again later.");
    }
  };

  return (
    <AppBar>
      <SafeAreaView style={styles.container}>
        <Animated.View style={[styles.animatedContainer, animatedStyle]}>
          <ScrollView contentContainerStyle={scrollViewPadding}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <Image source={require("../assets/new-patient-hero.jpg")} style={styles.heroImage} />
            <View style={styles.heroOverlay}>
              <Text style={styles.heroTitle}>Start Your Journey With Us</Text>
            </View>
          </View>
          {/* Coverage Section */}
          <View style={styles.coverageSection}>
            <View style={styles.coverageHeaderRow}>
              <View style={styles.coverageHeaderLine} />
              <Text style={styles.coverageHeading}>COVERAGE</Text>
            </View>
            <Text style={styles.coverageTitle}><Text style={styles.coverageTitleBlue}>We Accept A Variety Of </Text><Text style={styles.coverageTitleBlack}>Insurance Plans</Text></Text>
            <Text style={styles.coverageDesc}>
              At TMS of Emerald Coast, we believe that everyone deserves access to high-quality mental health care. We accept a wide range of insurance plans to make sure that TMS therapy is affordable and accessible for you. Our team will assist in verifying your coverage to ensure a seamless experience throughout your treatment journey.
            </Text>
            <TouchableOpacity 
              style={[
                styles.coverageButton,
                isCoveragePressed && styles.coverageButtonPressed
              ]}
              onPressIn={() => setIsCoveragePressed(true)}
              onPressOut={() => setIsCoveragePressed(false)}
              activeOpacity={1}
            >
              <Text style={[
                styles.coverageButtonText,
                isCoveragePressed && styles.coverageButtonTextPressed
              ]}>
                CONTACT US
              </Text>
            </TouchableOpacity>
            <Image source={require("../assets/insurance.png")} style={styles.coverageImage} resizeMode="cover" />
          </View>
          {/* Logo Carousel Section */}
          <View style={styles.logoCarouselSection}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.logoCarouselContent}
              onScroll={useCallback((e) => {
                const index = Math.round(e.nativeEvent.contentOffset.x / screenWidth);
                setActiveLogoIndex(index);
              }, [screenWidth])}
              scrollEventThrottle={32} // Reduced frequency for better performance
              ref={logoScrollRef}
              onTouchStart={handleCarouselTouchStart}
              onTouchEnd={handleCarouselTouchEnd}
              onMomentumScrollEnd={handleCarouselTouchEnd}
              // Performance optimizations
              removeClippedSubviews={true}
              decelerationRate="fast"
              bounces={false}
              overScrollMode="never"
              nestedScrollEnabled={false}
            >
              {useMemo(() => 
                logos.map((logo, idx) => (
                  <View style={[styles.logoSlide, { width: screenWidth }]} key={idx}>
                    <Image source={logo} style={styles.logoImage} resizeMode="contain" />
                  </View>
                )), [logos, screenWidth]
              )}
            </ScrollView>
            <View style={styles.logoDotsRow}>
              {useMemo(() => 
                logos.map((_, idx) => (
                  <View
                    key={idx}
                    style={[styles.logoDot, activeLogoIndex === idx && styles.logoDotActive]}
                  />
                )), [logos.length, activeLogoIndex]
              )}
            </View>
          </View>
          {/* Forms Section */}
          <View style={styles.formsSection}>
            {[
              { title: 'Pre Cert Med List', onPress: () => handleOpenDocument('pre-cert-med-list.pdf') },
              { title: 'BDI', onPress: () => {} },
              { title: 'PHQ – 9', onPress: () => handleOpenDocument('phq-9.pdf') },
              { title: 'Patient Intake Form', onPress: () => handleOpenDocument('patient-intake.pdf') },
            ].map((item, idx) => (
              <View style={styles.formCard} key={item.title}>
                <Text style={styles.formCardTitle}>{item.title}</Text>
                <TouchableOpacity 
                  style={[
                    styles.formCardButton,
                    isFormCardPressed[idx] && styles.formCardButtonPressed
                  ]} 
                  onPress={item.onPress}
                  onPressIn={() => setIsFormCardPressed(prev => ({ ...prev, [idx]: true }))}
                  onPressOut={() => setIsFormCardPressed(prev => ({ ...prev, [idx]: false }))}
                  activeOpacity={1}
                >
                  <Text style={[
                    styles.formCardButtonText,
                    isFormCardPressed[idx] && styles.formCardButtonTextPressed
                  ]}>
                    CLICK HERE
                  </Text>
                  <Ionicons 
                    name="arrow-forward" 
                    size={18} 
                    color={isFormCardPressed[idx] ? Colors.white : Colors.white} 
                    style={styles.formCardButtonIcon} 
                  />
                </TouchableOpacity>
              </View>
            ))}
          </View>
          {/* What to Expect Section */}
          <View style={styles.expectSection}>
            <Text style={styles.expectHeading}>What You Can Expect From</Text>
            <Text style={styles.expectSubheading}>TMS Therapy</Text>
            <Image source={require("../assets/treatment.png")} style={styles.expectImage} resizeMode="cover" />
            <View style={styles.expectDividerRow}>
              <View style={styles.expectDividerLine} />
              <Text style={styles.expectDividerText}>FORM</Text>
            </View>
            <Text style={styles.expectStepTitle}><Text style={styles.expectStepTitleBlue}>1. Pre-Screen Consultation & </Text>Patient Intake Forms</Text>
            <Text style={styles.expectDesc}>
              Easily book and complete the necessary forms to start your treatment journey. Our Pre-Screen Consultation, BDI, PHQ-9, and Patient Intake forms are designed to gather essential information, ensuring personalized and effective care. Fill them out at your convenience, and we'll guide you through the next steps toward healing.
            </Text>
            <TouchableOpacity 
              style={[
                styles.expectButton,
                isExpectPressed && styles.expectButtonPressed
              ]}
              onPressIn={() => setIsExpectPressed(true)}
              onPressOut={() => setIsExpectPressed(false)}
              activeOpacity={1}
            >
              <Text style={[
                styles.expectButtonText,
                isExpectPressed && styles.expectButtonTextPressed
              ]}>
                CONTACT
              </Text>
              <Ionicons 
                name="arrow-forward" 
                size={18} 
                color={isExpectPressed ? Colors.white : Colors.primary} 
                style={styles.expectButtonIcon} 
              />
            </TouchableOpacity>
          </View>
          {/* Pre-Assessment Section */}
          <View style={styles.assessmentSection}>
            <Image source={require("../assets/body.png")} style={styles.assessmentImage} resizeMode="contain" />
            <Text style={styles.assessmentStepTitle}>2. Pre-Assessment</Text>
            <Text style={styles.assessmentSubheading}>Find Out If TMS Is Right For You</Text>
            <Text style={styles.assessmentDesc}>
              Your Intake Coordinator will be the first person you speak with (whether in person or over the phone), and he or she will examine your history and explain various steps in the process.
            </Text>
            <Text style={styles.assessmentSubheading2}>We Focus On Insurance So You Don't Have To.</Text>
            <Text style={styles.assessmentDesc}>
              The majority of major insurance plans cover our procedures. Your Intake Coordinator will also clarify treatment cost choices, including reviewing typical insurance plan requirements with you.
              {'\n'}
              We will work with your health insurance provider to assess benefits.
            </Text>
            <TouchableOpacity 
              style={[
                styles.assessmentButton,
                isAssessmentPressed && styles.assessmentButtonPressed
              ]}
              onPressIn={() => setIsAssessmentPressed(true)}
              onPressOut={() => setIsAssessmentPressed(false)}
              activeOpacity={1}
            >
              <Text style={[
                styles.assessmentButtonText,
                isAssessmentPressed && styles.assessmentButtonTextPressed
              ]}>
                CONSULT NOW
              </Text>
              <Ionicons 
                name="arrow-forward" 
                size={18} 
                color={isAssessmentPressed ? Colors.white : Colors.primary} 
                style={styles.assessmentButtonIcon} 
              />
            </TouchableOpacity>
          </View>
          {/* First Appointment Section */}
          <View style={styles.appointmentSection}>
            <Text style={styles.appointmentStepTitle}><Text style={styles.appointmentStepTitleBlue}>3. </Text>First Appointment</Text>
            <Text style={styles.appointmentSubheading}>A Treatment Specialized For You</Text>
            <Text style={styles.appointmentDesc}>
              This appointment may require a little extra time, as the focus will be determining the appropriate magnet strength and coil position to ensure your treatment works effectively.
            </Text>
            <Image source={require("../assets/treatment-centre.png")} style={styles.appointmentImage} resizeMode="cover" />
            <TouchableOpacity 
              style={[
                styles.appointmentButton,
                isAppointmentPressed && styles.appointmentButtonPressed
              ]}
              onPressIn={() => setIsAppointmentPressed(true)}
              onPressOut={() => setIsAppointmentPressed(false)}
              activeOpacity={1}
            >
              <Text style={[
                styles.appointmentButtonText,
                isAppointmentPressed && styles.appointmentButtonTextPressed
              ]}>
                CONSULT NOW
              </Text>
              <Ionicons 
                name="arrow-forward" 
                size={18} 
                color={isAppointmentPressed ? Colors.white : Colors.primary} 
                style={styles.appointmentButtonIcon} 
              />
            </TouchableOpacity>
          </View>
          {/* Take Control Section */}
          <TakeControlSection />

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
    padding: Layout.spacing.large,
  },
  title: {
    fontSize: Fonts.sizes.xlarge,
    fontWeight: Fonts.weights.bold,
    color: Colors.primary,
    marginBottom: Layout.spacing.large,
  },
  card: {
    backgroundColor: Colors.lightGray,
    borderRadius: Layout.borderRadius.large,
    padding: Layout.spacing.medium,
    marginBottom: Layout.spacing.large,
  },
  cardTitle: {
    fontSize: Fonts.sizes.large,
    fontWeight: Fonts.weights.bold,
    color: Colors.primary,
    marginBottom: Layout.spacing.medium,
  },
  paragraph: {
    fontSize: Fonts.sizes.regular,
    lineHeight: 24,
    color: Colors.text,
  },
  bulletPoints: {
    marginTop: Layout.spacing.medium,
  },
  bulletPoint: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginRight: Layout.spacing.medium,
  },
  bulletText: {
    fontSize: Fonts.sizes.regular,
    color: Colors.text,
  },
  button: {
    backgroundColor: Colors.primary,
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: Layout.borderRadius.medium,
    alignSelf: "center",
    marginTop: Layout.spacing.medium,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: Fonts.weights.bold,
    fontSize: Fonts.sizes.regular,
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
  coverageSection: {
    backgroundColor: Colors.background,
    borderRadius: 18,
    marginHorizontal: 10,
    marginTop: 12,
    marginBottom: 24,
    padding: 12,
    alignItems: 'flex-start',
    shadowColor: Colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  coverageHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  coverageHeaderLine: {
    width: 36,
    height: 2,
    backgroundColor: Colors.primary,
    opacity: 0.4,
    marginRight: 6,
    borderRadius: 1,
  },
  coverageHeading: {
    color: Colors.primary,
    fontWeight: Fonts.weights.regular,
    fontSize: Fonts.sizes.large,
    letterSpacing: 1,
    textAlign: 'left',
  },
  coverageTitle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'left',
    marginBottom: 10,
    marginTop: 0,
  },
  coverageTitleBlue: {
    color: Colors.primary,
    fontWeight: '700',
  },
  coverageTitleBlack: {
    color: Colors.text,
    fontWeight: '700',
  },
  coverageDesc: {
    color: Colors.text,
    fontSize: Fonts.sizes.regular,
    textAlign: 'left',
    marginBottom: 18,
    marginTop: 0,
    lineHeight: 20,
  },
  coverageButton: {
    backgroundColor: Colors.primary,
    borderRadius: Layout.borderRadius.medium,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignSelf: 'flex-start',
    marginBottom: 18,
  },
  coverageButtonText: {
    color: Colors.white,
    fontWeight: Fonts.weights.bold,
    fontSize: Fonts.sizes.regular,
    letterSpacing: 1,
  },
  coverageButtonPressed: {
    backgroundColor: Colors.secondary,
  },
  coverageButtonTextPressed: {
    color: Colors.white,
  },
  coverageImage: {
    width: '100%',
    height: 140,
    borderRadius: 18,
    marginTop: 8,
  },
  logoCarouselSection: {
    backgroundColor: Colors.primary,
    borderRadius: 0,
    marginHorizontal: 0,
    marginTop: 0,
    marginBottom: 24,
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoCarouselContent: {
    alignItems: 'center',
  },
  logoSlide: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 260,
    height: 80,
    marginHorizontal: 16,
  },
  logoDotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 18,
  },
  logoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6b8792',
    marginHorizontal: 4,
  },
  logoDotActive: {
    backgroundColor: Colors.white,
  },
  formsSection: {
    marginTop: 8,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  formCard: {
    backgroundColor: '#dbe5e7',
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 8,
    marginBottom: 20,
    shadowColor: Colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  formCardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 24,
    textAlign: 'center',
  },
  formCardButton: {
    backgroundColor: Colors.primary,
    borderRadius: 32,
    paddingVertical: 12,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  formCardButtonText: {
    color: Colors.white,
    fontWeight: Fonts.weights.bold,
    fontSize: 15,
    marginRight: 8,
    letterSpacing: 1,
  },
  formCardButtonIcon: {
    marginLeft: 0,
  },
  formCardButtonPressed: {
    backgroundColor: Colors.secondary,
  },
  formCardButtonTextPressed: {
    color: Colors.white,
  },
  expectSection: {
    backgroundColor: Colors.background,
    borderRadius: 18,
    marginHorizontal: 10,
    marginTop: 8,
    marginBottom: 24,
    padding: 12,
    alignItems: 'flex-start',
    shadowColor: Colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  expectHeading: {
    color: Colors.primary,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    alignSelf: 'center',
    marginBottom: 8,
  },
  expectSubheading: {
    color: Colors.text,
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    alignSelf: 'center',
    marginBottom: 24,
    marginTop: 0,
  },
  expectImage: {
    width: '100%',
    height: 160,
    borderRadius: 18,
    marginBottom: 18,
    marginTop: 0,
  },
  expectDividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 0,
  },
  expectDividerLine: {
    width: '33%',
    height: 2,
    backgroundColor: Colors.primary,
    opacity: 0.6,
    marginRight: 8,
    borderRadius: 1,
  },
  expectDividerText: {
    color: Colors.primary,
    fontWeight: Fonts.weights.regular,
    fontSize: Fonts.sizes.large,
    letterSpacing: 1,
    textAlign: 'left',
  },
  expectStepTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 10,
    marginTop: 0,
    textAlign: 'left',
  },
  expectStepTitleBlue: {
    color: Colors.primary,
    fontWeight: '700',
  },
  expectDesc: {
    color: Colors.text,
    fontSize: Fonts.sizes.regular,
    textAlign: 'left',
    marginBottom: 18,
    marginTop: 0,
    lineHeight: 20,
  },
  expectButton: {
    backgroundColor: Colors.primary,
    borderRadius: Layout.borderRadius.medium,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
  },
  expectButtonText: {
    color: Colors.white,
    fontWeight: Fonts.weights.bold,
    fontSize: Fonts.sizes.regular,
    letterSpacing: 1,
    marginRight: 8,
  },
  expectButtonIcon: {
    marginLeft: 0,
  },
  expectButtonPressed: {
    backgroundColor: Colors.secondary,
  },
  expectButtonTextPressed: {
    color: Colors.white,
  },
  assessmentSection: {
    backgroundColor: '#eaf4f3',
    borderRadius: 18,
    marginHorizontal: 10,
    marginTop: 8,
    marginBottom: 24,
    padding: 12,
    alignItems: 'flex-start',
    shadowColor: Colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  assessmentImage: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: 18,
    marginTop: 0,
    alignSelf: 'center',
  },
  assessmentStepTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 10,
    marginTop: 0,
    textAlign: 'left',
  },
  assessmentSubheading: {
    color: Colors.primary,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 0,
    textAlign: 'left',
  },
  assessmentSubheading2: {
    color: Colors.primary,
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 8,
    marginTop: 16,
    textAlign: 'left',
  },
  assessmentDesc: {
    color: Colors.text,
    fontSize: Fonts.sizes.regular,
    textAlign: 'left',
    marginBottom: 8,
    marginTop: 0,
    lineHeight: 20,
  },
  assessmentButton: {
    backgroundColor: Colors.primary,
    borderRadius: Layout.borderRadius.medium,
    paddingVertical: 10,
    paddingHorizontal: 24,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  assessmentButtonText: {
    color: Colors.white,
    fontWeight: Fonts.weights.bold,
    fontSize: Fonts.sizes.regular,
    letterSpacing: 1,
    marginRight: 8,
  },
  assessmentButtonIcon: {
    marginLeft: 0,
  },
  assessmentButtonPressed: {
    backgroundColor: Colors.secondary,
  },
  assessmentButtonTextPressed: {
    color: Colors.white,
  },
  appointmentSection: {
    backgroundColor: Colors.background,
    borderRadius: 18,
    marginHorizontal: 10,
    marginTop: 8,
    marginBottom: 24,
    padding: 12,
    alignItems: 'flex-start',
    shadowColor: Colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  appointmentStepTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
    marginTop: 0,
    textAlign: 'center',
    alignSelf: 'center',
  },
  appointmentStepTitleBlue: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
  appointmentSubheading: {
    color: Colors.primary,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
    marginTop: 0,
    textAlign: 'center',
    alignSelf: 'center',
  },
  appointmentDesc: {
    color: Colors.text,
    fontSize: Fonts.sizes.regular,
    textAlign: 'center',
    marginBottom: 18,
    marginTop: 0,
    lineHeight: 20,
    alignSelf: 'center',
  },
  appointmentImage: {
    width: '100%',
    height: 220,
    borderRadius: 18,
    marginBottom: 18,
    marginTop: 0,
    alignSelf: 'center',
  },
  appointmentButton: {
    backgroundColor: Colors.primary,
    borderRadius: Layout.borderRadius.medium,
    paddingVertical: 12,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 0,
  },
  appointmentButtonText: {
    color: Colors.white,
    fontWeight: Fonts.weights.bold,
    fontSize: Fonts.sizes.regular,
    letterSpacing: 1,
    marginRight: 8,
  },
  appointmentButtonIcon: {
    marginLeft: 0,
  },
  appointmentButtonPressed: {
    backgroundColor: Colors.secondary,
  },
  appointmentButtonTextPressed: {
    color: Colors.white,
  },


});
