import React, { useState, useCallback, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  Platform,
  Modal,
  Pressable,
  Animated,
  ScrollView
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';

// Import constants
import Colors from '../constants/Colors';
import Fonts from '../constants/Fonts';
import Layout from '../constants/Layout';

// Generate months array
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

// Generate short month names
const SHORT_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

// Day names
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Generate years array (from 1900 to current year only)
const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = 1900; year <= currentYear; year++) {
    years.push(year);
  }
  return years.reverse(); // Most recent years first
};

const YEARS = generateYears();

/**
 * Modern Date Picker Component
 * 
 * Features:
 * - Sleek modern design
 * - Prevents selection of current date and past dates (unless isDateOfBirth is true)
 * - Cross-platform compatibility (iOS/Android)
 * - Smooth animations
 * - Error state handling
 * - Accessibility support
 * - Special date of birth mode with easy month/year selection
 */
const ModernDatePicker = ({
  value,
  onDateChange,
  placeholder = "Select Date",
  error = "",
  style = {},
  disabled = false,
  minimumDate = null, // Will be set to tomorrow by default (or 1900 for DOB)
  maximumDate = null,
  isDateOfBirth = false, // New prop for date of birth mode
  onFocus = () => {},
  onBlur = () => {},
  placeholderTextColor = "#bdbdbd", // Default to HomeScreen color
  textColor = "#222", // Default text color
  borderStyle = "primary", // "primary" for colored border, "transparent" for transparent border
  ...props
}) => {
  const [showPicker, setShowPicker] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  // State for custom date picker
  const [useCustomPicker, setUseCustomPicker] = useState(isDateOfBirth);
  const [selectedMonth, setSelectedMonth] = useState(value ? value.getMonth() : new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(value ? value.getFullYear() : new Date().getFullYear());
  const [selectedDay, setSelectedDay] = useState(value ? value.getDate() : new Date().getDate());
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  // Sync state with value prop changes
  useEffect(() => {
    if (value) {
      setSelectedMonth(value.getMonth());
      setSelectedYear(value.getFullYear());
      setSelectedDay(value.getDate());
    } else {
      const today = new Date();
      setSelectedMonth(today.getMonth());
      setSelectedYear(today.getFullYear());
      setSelectedDay(today.getDate());
    }
  }, [value]);

  // Set minimum date to tomorrow (users cannot select today or past dates)
  const getMinimumDate = useCallback(() => {
    return minimumDate; // Use provided minimumDate or undefined for no restriction
  }, [minimumDate]);

  // Set maximum date to 1 year from now if not specified
  const getMaximumDate = useCallback(() => {
    return maximumDate; // Use provided maximumDate or undefined for no restriction
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
      onDateChange(selectedDate);
      onBlur();
    }
    
    if (Platform.OS === 'ios' && event.type === 'dismissed') {
      setShowPicker(false);
      onBlur();
    }
  }, [onDateChange, onBlur]);

  // Get default value for picker (current date, not minimum date)
  const getDefaultPickerValue = useCallback(() => {
    if (value) return value;
    
    // Always return current date as default, regardless of restrictions
    return new Date();
  }, [value]);

  // Get number of days in a month
  const getDaysInMonth = useCallback((month, year) => {
    return new Date(year, month + 1, 0).getDate();
  }, []);

  // Generate days array for current month/year
  const getDaysArray = useCallback(() => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  }, [selectedMonth, selectedYear, getDaysInMonth]);

  // Get first day of the month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = useCallback(() => {
    return new Date(selectedYear, selectedMonth, 1).getDay();
  }, [selectedMonth, selectedYear]);

  // Check if a day is today
  const isToday = useCallback((day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      selectedMonth === today.getMonth() &&
      selectedYear === today.getFullYear()
    );
  }, [selectedMonth, selectedYear]);

  // Quick jump to today
  const jumpToToday = useCallback(() => {
    const today = new Date();
    setSelectedMonth(today.getMonth());
    setSelectedYear(today.getFullYear());
    setSelectedDay(today.getDate());
  }, []);

  // Navigate months
  const navigateMonth = useCallback((direction) => {
    if (direction === 'prev') {
      if (selectedMonth === 0) {
        setSelectedMonth(11);
        setSelectedYear(prev => prev - 1);
      } else {
        setSelectedMonth(prev => prev - 1);
      }
    } else {
      if (selectedMonth === 11) {
        setSelectedMonth(0);
        setSelectedYear(prev => prev + 1);
      } else {
        setSelectedMonth(prev => prev + 1);
      }
    }
    
    // Adjust day if it doesn't exist in new month
    const newDaysInMonth = getDaysInMonth(
      direction === 'prev' 
        ? (selectedMonth === 0 ? 11 : selectedMonth - 1)
        : (selectedMonth === 11 ? 0 : selectedMonth + 1),
      direction === 'prev' 
        ? (selectedMonth === 0 ? selectedYear - 1 : selectedYear)
        : (selectedMonth === 11 ? selectedYear + 1 : selectedYear)
    );
    
    if (selectedDay > newDaysInMonth) {
      setSelectedDay(newDaysInMonth);
    }
  }, [selectedMonth, selectedYear, selectedDay, getDaysInMonth]);

  // Handle month selection
  const handleMonthSelect = useCallback((monthIndex) => {
    setSelectedMonth(monthIndex);
    setShowMonthDropdown(false);
    
    // Adjust day if current day doesn't exist in new month
    const daysInNewMonth = getDaysInMonth(monthIndex, selectedYear);
    if (selectedDay > daysInNewMonth) {
      setSelectedDay(daysInNewMonth);
    }
  }, [selectedYear, selectedDay, getDaysInMonth]);

  // Handle year selection
  const handleYearSelect = useCallback((year) => {
    setSelectedYear(year);
    setShowYearDropdown(false);
    
    // Adjust day if current day doesn't exist in new month/year (Feb 29 in non-leap year)
    const daysInNewMonth = getDaysInMonth(selectedMonth, year);
    if (selectedDay > daysInNewMonth) {
      setSelectedDay(daysInNewMonth);
    }
  }, [selectedMonth, selectedDay, getDaysInMonth]);

  // Handle day selection
  const handleDaySelect = useCallback((day) => {
    setSelectedDay(day);
  }, []);

  // Confirm custom date selection
  const confirmCustomDate = useCallback(() => {
    const newDate = new Date(selectedYear, selectedMonth, selectedDay);
    onDateChange(newDate);
    handleIOSModalClose();
  }, [selectedYear, selectedMonth, selectedDay, onDateChange]);

  // Handle picker open
  const handlePress = useCallback(() => {
    if (disabled) return;
    
    setIsPressed(true);
    onFocus();
    
    setShowPicker(true);
    
    // Reset pressed state after a brief moment
    setTimeout(() => setIsPressed(false), 150);
  }, [disabled, onFocus]);

  // Handle iOS modal close
  const handleIOSModalClose = useCallback(() => {
    setShowPicker(false);
    setShowMonthDropdown(false);
    setShowYearDropdown(false);
    onBlur();
  }, [onBlur]);

  // Render custom date picker with dropdowns
  const renderCustomDatePicker = () => (
    <View style={styles.customDatePicker}>
      {/* Header with Month/Year Controls */}
      <View style={styles.calendarHeader}>
        <View style={styles.monthYearContainer}>
          {/* Month Dropdown */}
          <View style={styles.headerDropdownContainer}>
            <TouchableOpacity
              style={styles.headerDropdown}
              onPress={() => {
                setShowMonthDropdown(!showMonthDropdown);
                setShowYearDropdown(false);
              }}
            >
              <Text style={styles.headerDropdownText}>{SHORT_MONTHS[selectedMonth]}</Text>
              <Ionicons name="chevron-down" size={16} color={Colors.primary} />
            </TouchableOpacity>
            
            {showMonthDropdown && (
              <ScrollView style={styles.headerDropdownOptions} nestedScrollEnabled>
                {MONTHS.map((month, index) => (
                  <TouchableOpacity
                    key={month}
                    style={[
                      styles.headerDropdownOption,
                      selectedMonth === index && styles.selectedHeaderOption
                    ]}
                    onPress={() => handleMonthSelect(index)}
                  >
                    <Text style={[
                      styles.headerDropdownOptionText,
                      selectedMonth === index && styles.selectedHeaderOptionText
                    ]}>
                      {month}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          {/* Year Dropdown */}
          <View style={styles.headerDropdownContainer}>
            <TouchableOpacity
              style={styles.headerDropdown}
              onPress={() => {
                setShowYearDropdown(!showYearDropdown);
                setShowMonthDropdown(false);
              }}
            >
              <Text style={styles.headerDropdownText}>{selectedYear}</Text>
              <Ionicons name="chevron-down" size={16} color={Colors.primary} />
            </TouchableOpacity>
            
            {showYearDropdown && (
              <ScrollView style={styles.headerDropdownOptions} nestedScrollEnabled>
                {YEARS.map((year) => (
                  <TouchableOpacity
                    key={year}
                    style={[
                      styles.headerDropdownOption,
                      selectedYear === year && styles.selectedHeaderOption
                    ]}
                    onPress={() => handleYearSelect(year)}
                  >
                    <Text style={[
                      styles.headerDropdownOptionText,
                      selectedYear === year && styles.selectedHeaderOptionText
                    ]}>
                      {year}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      </View>

      {/* Day Names Header */}
      <View style={styles.dayNamesHeader}>
        {DAY_NAMES.map((dayName) => (
          <View key={dayName} style={styles.dayNameCell}>
            <Text style={styles.dayNameText}>{dayName}</Text>
          </View>
        ))}
      </View>

      {/* Calendar Grid */}
      <View style={styles.calendarGrid}>
        {/* Empty cells for days before month starts */}
        {Array.from({ length: getFirstDayOfMonth() }, (_, index) => (
          <View key={`empty-${index}`} style={styles.emptyDayCell} />
        ))}
        
        {/* Days of the month */}
        {getDaysArray().map((day) => {
          const dayIsToday = isToday(day);
          const isSelected = selectedDay === day;
          
          return (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayCell,
                isSelected && styles.selectedDayCell,
                dayIsToday && !isSelected && styles.todayDayCell
              ]}
              onPress={() => handleDaySelect(day)}
            >
              <Text style={[
                styles.dayCellText,
                isSelected && styles.selectedDayCellText,
                dayIsToday && !isSelected && styles.todayDayCellText
              ]}>
                {day}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  // Render iOS Modal with Custom Date Picker
  const renderIOSModal = () => (
    <Modal
      transparent
      visible={showPicker}
      animationType="none"
      onRequestClose={handleIOSModalClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable 
          style={styles.modalBackdrop} 
          onPress={handleIOSModalClose}
        />
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <TouchableOpacity 
              onPress={handleIOSModalClose}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseText}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Select Date</Text>
            <TouchableOpacity 
              onPress={useCustomPicker ? confirmCustomDate : handleIOSModalClose}
              style={styles.modalDoneButton}
            >
              <Text style={styles.modalDoneText}>Done</Text>
            </TouchableOpacity>
          </View>
          
          {useCustomPicker ? renderCustomDatePicker() : (
            <DateTimePicker
              value={getDefaultPickerValue()}
              mode="date"
              display="spinner"
              onChange={handleDateChange}
              minimumDate={getMinimumDate()}
              maximumDate={getMaximumDate()}
              style={styles.iosDatePicker}
              accentColor={Colors.primary}
              themeVariant="light"
            />
          )}
        </View>
      </View>
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
          borderStyle === "transparent" ? { 
            borderWidth: 2, 
            borderColor: "transparent" 
          } : { 
            borderWidth: 1, 
            borderColor: Colors.primary 
          },
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
      {Platform.OS === 'android' && showPicker && !useCustomPicker && (
        <DateTimePicker
          value={getDefaultPickerValue()}
          mode="date"
          display="calendar"
          onChange={handleDateChange}
          minimumDate={getMinimumDate()}
          maximumDate={getMaximumDate()}
          accentColor={Colors.primary}
        />
      )}

      {/* Custom Date Picker Modal for Android DOB */}
      {Platform.OS === 'android' && showPicker && useCustomPicker && renderIOSModal()}

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
    borderRadius: Layout.borderRadius.medium,
    padding: 14,
    fontSize: Fonts.sizes.regular,
    color: '#000000',
    marginBottom: 0,
    minHeight: 48,
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
    fontSize: Fonts.sizes.regular,
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
    backgroundColor: 'rgba(44, 82, 100, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    shadowColor: Colors.black,
    shadowOpacity: 0.25,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    backgroundColor: '#f8f9fa',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: Fonts.sizes.large,
    fontWeight: Fonts.weights.bold,
    color: Colors.primary,
  },
  modalCloseButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: Layout.borderRadius.medium,
    backgroundColor: '#e0e0e0',
    borderWidth: 1,
    borderColor: '#d0d0d0',
  },
  modalCloseText: {
    fontSize: Fonts.sizes.medium,
    color: Colors.text,
    fontWeight: Fonts.weights.bold,
  },
  modalDoneButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: Layout.borderRadius.medium,
    backgroundColor: Colors.primary,
  },
  modalDoneText: {
    fontSize: Fonts.sizes.medium,
    color: Colors.white,
    fontWeight: Fonts.weights.bold,
  },
  iosDatePicker: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
  },
  customDatePicker: {
    padding: 20,
    maxHeight: 450,
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
    backgroundColor: '#f8f9fa',
  },
  navButton: {
    padding: 10,
    borderRadius: Layout.borderRadius.small,
    backgroundColor: Colors.primary,
  },
  monthYearContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerDropdownContainer: {
    flex: 1,
    position: 'relative',
    marginHorizontal: 5,
  },
  headerDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: Layout.borderRadius.small,
    backgroundColor: Colors.white,
    minWidth: 80,
  },
  headerDropdownText: {
    fontSize: Fonts.sizes.medium,
    color: Colors.primary,
    fontWeight: Fonts.weights.bold,
  },
  headerDropdownOptions: {
    position: 'absolute',
    top: 45,
    left: 0,
    right: 0,
    maxHeight: 180,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: Layout.borderRadius.medium,
    zIndex: 1000,
    elevation: 8,
    shadowColor: Colors.primary,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  headerDropdownOption: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  headerDropdownOptionText: {
    fontSize: Fonts.sizes.medium,
    color: Colors.text,
    textAlign: 'center',
  },
  selectedHeaderOption: {
    backgroundColor: Colors.primary,
  },
  selectedHeaderOptionText: {
    color: Colors.white,
    fontWeight: Fonts.weights.bold,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  todayButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: Layout.borderRadius.medium,
    backgroundColor: 'rgba(44, 82, 100, 0.1)',
  },
  todayButtonText: {
    fontSize: Fonts.sizes.medium,
    color: Colors.primary,
    fontWeight: Fonts.weights.bold,
  },
  dayNamesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  dayNameCell: {
    width: '14.28%', // 7 days = 100% / 7
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  dayNameText: {
    fontSize: Fonts.sizes.small,
    color: Colors.primary,
    fontWeight: Fonts.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%', // 7 days = 100% / 7
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
    borderRadius: Layout.borderRadius.small,
    backgroundColor: 'transparent',
  },
  selectedDayCell: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  dayCellText: {
    fontSize: Fonts.sizes.medium,
    color: Colors.text,
    fontWeight: Fonts.weights.medium,
  },
  selectedDayCellText: {
    color: Colors.white,
    fontWeight: Fonts.weights.bold,
  },
  todayDayCell: {
    backgroundColor: 'rgba(44, 82, 100, 0.1)',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  todayDayCellText: {
    color: Colors.primary,
    fontWeight: Fonts.weights.bold,
  },
  emptyDayCell: {
    width: '14.28%', // 7 days = 100% / 7
    aspectRatio: 1,
  },
});

export default ModernDatePicker; 