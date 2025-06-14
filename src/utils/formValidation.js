// Form Validation Utilities for TMS Application

export class FormValidator {
  
  // Email validation
  static validateEmail(email) {
    if (!email) return { isValid: false, error: 'Email is required' };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: 'Please enter a valid email address' };
    }
    return { isValid: true, error: '' };
  }

  // Phone validation
  static validatePhone(phone) {
    if (!phone) return { isValid: false, error: 'Phone number is required' };
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)\.]/g, '');
    if (cleanPhone.length < 10) {
      return { isValid: false, error: 'Phone number must be at least 10 digits' };
    }
    if (!phoneRegex.test(cleanPhone)) {
      return { isValid: false, error: 'Please enter a valid phone number' };
    }
    return { isValid: true, error: '' };
  }

  // Name validation
  static validateName(name, fieldName = 'Name') {
    if (!name || name.trim() === '') {
      return { isValid: false, error: `${fieldName} is required` };
    }
    if (name.trim().length < 2) {
      return { isValid: false, error: `${fieldName} must be at least 2 characters` };
    }
    if (name.trim().length > 50) {
      return { isValid: false, error: `${fieldName} must be less than 50 characters` };
    }
    const nameRegex = /^[a-zA-Z\s\-\'\.]+$/;
    if (!nameRegex.test(name.trim())) {
      return { isValid: false, error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` };
    }
    return { isValid: true, error: '' };
  }

  // Age validation
  static validateAge(age) {
    if (!age) return { isValid: false, error: 'Age is required' };
    const ageNum = parseInt(age);
    if (isNaN(ageNum)) {
      return { isValid: false, error: 'Age must be a number' };
    }
    if (ageNum < 1 || ageNum > 120) {
      return { isValid: false, error: 'Age must be between 1 and 120' };
    }
    return { isValid: true, error: '' };
  }

  // Date validation
  static validateDate(date, fieldName = 'Date') {
    if (!date) return { isValid: false, error: `${fieldName} is required` };
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return { isValid: false, error: `Please enter a valid ${fieldName.toLowerCase()}` };
    }
    return { isValid: true, error: '' };
  }

  // Date of birth validation
  static validateDateOfBirth(dob) {
    if (!dob) return { isValid: false, error: 'Date of birth is required' };
    const dobDate = new Date(dob);
    const today = new Date();
    
    if (isNaN(dobDate.getTime())) {
      return { isValid: false, error: 'Please enter a valid date of birth' };
    }
    
    if (dobDate > today) {
      return { isValid: false, error: 'Date of birth cannot be in the future' };
    }
    
    const age = today.getFullYear() - dobDate.getFullYear();
    if (age > 120) {
      return { isValid: false, error: 'Please enter a valid date of birth' };
    }
    
    return { isValid: true, error: '' };
  }

  // Address validation
  static validateAddress(address) {
    if (!address || address.trim() === '') {
      return { isValid: false, error: 'Address is required' };
    }
    if (address.trim().length < 5) {
      return { isValid: false, error: 'Address must be at least 5 characters' };
    }
    if (address.trim().length > 200) {
      return { isValid: false, error: 'Address must be less than 200 characters' };
    }
    return { isValid: true, error: '' };
  }

  // City, State, Zip validation
  static validateCityStateZip(cityStateZip) {
    if (!cityStateZip || cityStateZip.trim() === '') {
      return { isValid: false, error: 'City, State, Zip is required' };
    }
    
    // Expected format: "City, State, Zip" or "City, State Zip"
    const parts = cityStateZip.split(',');
    if (parts.length < 2) {
      return { isValid: false, error: 'Please use format: City, State, Zip' };
    }
    
    const city = parts[0].trim();
    const stateZip = parts[1].trim();
    
    if (city.length < 2) {
      return { isValid: false, error: 'City name must be at least 2 characters' };
    }
    
    if (stateZip.length < 4) {
      return { isValid: false, error: 'State and Zip must be provided' };
    }
    
    return { isValid: true, error: '' };
  }

  // Gender validation
  static validateGender(gender) {
    if (!gender || gender.trim() === '') {
      return { isValid: false, error: 'Gender is required' };
    }
    const validGenders = ['Male', 'Female', 'Other', 'Prefer not to say'];
    if (!validGenders.includes(gender)) {
      return { isValid: false, error: 'Please select a valid gender option' };
    }
    return { isValid: true, error: '' };
  }

  // Required field validation
  static validateRequired(value, fieldName) {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return { isValid: false, error: `${fieldName} is required` };
    }
    return { isValid: true, error: '' };
  }

  // Dropdown selection validation
  static validateDropdownSelection(value, fieldName, validOptions = []) {
    if (!value || value === 'Select' || value.trim() === '') {
      return { isValid: false, error: `Please select ${fieldName}` };
    }
    if (validOptions.length > 0 && !validOptions.includes(value)) {
      return { isValid: false, error: `Please select a valid ${fieldName}` };
    }
    return { isValid: true, error: '' };
  }

  // Text area validation
  static validateTextArea(value, fieldName, minLength = 0, maxLength = 1000) {
    if (minLength > 0 && (!value || value.trim() === '')) {
      return { isValid: false, error: `${fieldName} is required` };
    }
    if (value && value.length > maxLength) {
      return { isValid: false, error: `${fieldName} must be less than ${maxLength} characters` };
    }
    if (value && value.trim().length < minLength) {
      return { isValid: false, error: `${fieldName} must be at least ${minLength} characters` };
    }
    return { isValid: true, error: '' };
  }

  // Checkbox group validation (at least one selected)
  static validateCheckboxGroup(selections, fieldName) {
    if (!selections || typeof selections !== 'object') {
      return { isValid: false, error: `Please select at least one ${fieldName}` };
    }
    
    const hasSelection = Object.values(selections).some(value => value === true);
    if (!hasSelection) {
      return { isValid: false, error: `Please select at least one ${fieldName}` };
    }
    
    return { isValid: true, error: '' };
  }

  // Score validation for assessments
  static validateScore(score, minScore = 0, maxScore = 100) {
    if (score === null || score === undefined || score === '') {
      return { isValid: false, error: 'Score is required' };
    }
    
    const scoreNum = parseInt(score);
    if (isNaN(scoreNum)) {
      return { isValid: false, error: 'Score must be a number' };
    }
    
    if (scoreNum < minScore || scoreNum > maxScore) {
      return { isValid: false, error: `Score must be between ${minScore} and ${maxScore}` };
    }
    
    return { isValid: true, error: '' };
  }

  // Assessment responses validation
  static validateAssessmentResponses(responses, totalQuestions) {
    const unansweredQuestions = [];
    
    // Check each question
      for (let i = 0; i < totalQuestions; i++) {
      if (!responses[i]) {
        unansweredQuestions.push(i + 1);
        }
      }

    if (unansweredQuestions.length > 0) {
      const questionList = unansweredQuestions.join(', ');
      const errorMessage = unansweredQuestions.length === 1
        ? `Please answer question ${questionList}`
        : `Please answer questions ${questionList}`;
      
      return { 
        isValid: false, 
        error: errorMessage,
        unansweredQuestions
      };
    }
    
    return { isValid: true, error: '', unansweredQuestions: [] };
  }

  // Medication selection validation
  static validateMedicationSelection(medications) {
    if (!medications || typeof medications !== 'object') {
      return { isValid: false, error: 'Please select at least one medication' };
    }
    
    const hasSelection = Object.values(medications).some(category => 
      Object.values(category).some(med => med === true)
    );
    
    if (!hasSelection) {
      return { isValid: false, error: 'Please select at least one medication' };
    }
    
    return { isValid: true, error: '' };
  }
}

// Form-specific validation functions
export const PatientIntakeValidation = {
  validateForm(formData) {
    const errors = {};
    
    // Full Legal Name (required, 2-50 characters, letters and spaces only)
    if (!formData.fullLegalName?.trim()) {
      errors.fullLegalName = 'Full Legal Name is required';
    } else if (!/^[a-zA-Z\s]{2,50}$/.test(formData.fullLegalName)) {
      errors.fullLegalName = 'Full Legal Name must be 2-50 characters and contain only letters and spaces';
    }
    
    // Consultation Date (required only)
    if (!formData.date) {
      errors.date = 'Consultation Date is required';
    }
    
    // Phone (required, valid format)
    if (!formData.phone?.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number (e.g., (123) 456-7890)';
    }
    
    // Email (required, valid format)
    if (!formData.email?.trim()) {
      errors.email = 'Email is required';
    } else {
      const trimmedEmail = formData.email.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
        errors.email = 'Please enter a valid email address';
      }
    }
    
    // Address (required, 5-200 characters)
    if (!formData.address?.trim()) {
      errors.address = 'Address is required';
    } else if (formData.address.length < 5 || formData.address.length > 200) {
      errors.address = 'Address must be between 5 and 200 characters';
    }
    
    // City, State, ZIP (required, valid format)
    if (!formData.cityStateZip?.trim()) {
      errors.cityStateZip = 'City, State, ZIP is required';
    } else if (!/^[A-Za-z\s]+,\s*[A-Za-z]{2}\s*\d{5}(-\d{4})?$/.test(formData.cityStateZip)) {
      errors.cityStateZip = 'Please enter in format: City, State ZIP (e.g., New York, NY 10001)';
    }
    
    // Age (required, 0-120)
    if (!formData.age?.trim()) {
      errors.age = 'Age is required';
    } else {
      const age = parseInt(formData.age);
      if (isNaN(age) || age < 0 || age > 120) {
        errors.age = 'Age must be between 0 and 120';
      }
    }
    
    // Date of Birth (required, not future, valid age)
    if (!formData.dob) {
      errors.dob = 'Date of Birth is required';
    } else {
      const dob = new Date(formData.dob);
      const today = new Date();
      if (dob > today) {
        errors.dob = 'Date of Birth cannot be in the future';
      } else {
        const age = today.getFullYear() - dob.getFullYear();
        if (age < 0 || age > 120) {
          errors.dob = 'Invalid Date of Birth';
        }
      }
    }
    
    // SSN (optional, valid format if provided)
    if (formData.ssn?.trim() && !/^\d{3}-?\d{2}-?\d{4}$/.test(formData.ssn)) {
      errors.ssn = 'Please enter a valid SSN (e.g., 123-45-6789)';
    }
    
    // Gender (required)
    if (!formData.gender) {
      errors.gender = 'Gender is required';
    }
    
    // Active Duty Service Member (required)
    if (!formData.activeDutyServiceMember) {
      errors.activeDutyServiceMember = 'Active Duty Service Member status is required';
    }
    
    // Spouse Age (optional, valid if provided)
    if (formData.spouseAge?.trim()) {
      const spouseAge = parseInt(formData.spouseAge);
      if (isNaN(spouseAge) || spouseAge < 0 || spouseAge > 120) {
        errors.spouseAge = 'Spouse Age must be between 0 and 120';
      }
    }
    
    // Spouse DOB (optional, not future if provided)
    if (formData.spouseDob && new Date(formData.spouseDob) > new Date()) {
      errors.spouseDob = 'Spouse Date of Birth cannot be in the future';
    }
    
    // Emergency Contact Phone (optional, valid format if provided)
    if (formData.emergencyContactPhone?.trim() && 
        !/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(formData.emergencyContactPhone)) {
      errors.emergencyContactPhone = 'Please enter a valid emergency contact phone number';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  validatePatientIntakeForm(formData) {
    const errors = {};
    let isValid = true;

    // Validate required fields
    const requiredFields = {
      fullLegalName: 'Full Legal Name',
      age: 'Age',
      dob: 'Date of Birth',
      gender: 'Gender',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      cityStateZip: 'City, State, Zip'
    };

    // Check required fields
    Object.entries(requiredFields).forEach(([field, label]) => {
      const validation = FormValidator.validateRequired(formData[field], label);
      if (!validation.isValid) {
        errors[field] = validation.error;
        isValid = false;
      }
    });

    // Validate email if provided
    if (formData.email) {
      const emailValidation = FormValidator.validateEmail(formData.email);
      if (!emailValidation.isValid) {
        errors.email = emailValidation.error;
        isValid = false;
      }
    }

    // Validate phone if provided
    if (formData.phone) {
      const phoneValidation = FormValidator.validatePhone(formData.phone);
      if (!phoneValidation.isValid) {
        errors.phone = phoneValidation.error;
        isValid = false;
      }
    }

    // Validate age if provided
    if (formData.age) {
      const ageValidation = FormValidator.validateAge(formData.age);
      if (!ageValidation.isValid) {
        errors.age = ageValidation.error;
        isValid = false;
      }
    }

    // Validate date of birth if provided
    if (formData.dob) {
      const dobValidation = FormValidator.validateDateOfBirth(formData.dob);
      if (!dobValidation.isValid) {
        errors.dob = dobValidation.error;
        isValid = false;
      }
    }

    // Validate address if provided
    if (formData.address) {
      const addressValidation = FormValidator.validateAddress(formData.address);
      if (!addressValidation.isValid) {
        errors.address = addressValidation.error;
        isValid = false;
      }
    }

    // Validate city, state, zip if provided
    if (formData.cityStateZip) {
      const cityStateZipValidation = FormValidator.validateCityStateZip(formData.cityStateZip);
      if (!cityStateZipValidation.isValid) {
        errors.cityStateZip = cityStateZipValidation.error;
        isValid = false;
      }
    }

    // Validate gender if provided
    if (formData.gender) {
      const genderValidation = FormValidator.validateGender(formData.gender);
      if (!genderValidation.isValid) {
        errors.gender = genderValidation.error;
        isValid = false;
      }
    }

    return { isValid, errors };
  },

  validateMedicalHistoryForm(formData) {
    const errors = {};
    const sections = {
      conditions: 'Medical Conditions',
      allergies: 'Allergies',
      medications: 'Current Medications',
      family: 'Family History',
      signature: 'Signature'
    };

    // Validate at least one condition is selected or other condition is provided
    if (!formData.conditions?.length && !formData.otherConditions?.trim()) {
      errors.conditions = `${sections.conditions}: Please select at least one condition or specify other conditions`;
    }

    // Validate at least one allergy is selected or other allergy is provided
    if (!formData.allergies?.length && !formData.otherAllergies?.trim()) {
      errors.allergies = `${sections.allergies}: Please select at least one allergy or specify other allergies`;
    }

    // Validate at least one medication is selected or other medication is provided
    if (!formData.medications?.length && !formData.otherMedications?.trim()) {
      errors.medications = `${sections.medications}: Please select at least one medication or specify other medications`;
    }

    // Validate at least one family history item is selected or other family history is provided
    if (!formData.familyHistory?.length && !formData.otherFamilyHistory?.trim()) {
      errors.familyHistory = `${sections.family}: Please select at least one family history item or specify other family history`;
    }

    // Validate signature
    if (!formData.signature?.trim()) {
      errors.signature = `${sections.signature}: Please provide your signature to authorize this form`;
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  validatePreCertMedListForm(formData) {
    const errors = {};
    const sections = {
      medications: 'Medications',
      details: 'Medication Details'
    };

    // Validate at least one medication is selected
    if (!formData.medications?.length) {
      errors.medications = `${sections.medications}: Please select at least one medication`;
    }

    // Validate medication details for each selected medication
    if (formData.medications?.length) {
      formData.medications.forEach(medication => {
        if (!formData.medicationDetails?.[medication]?.dosage?.trim()) {
          errors[`${medication}_dosage`] = `${sections.details}: Dosage is required for ${medication}`;
        }
        if (!formData.medicationDetails?.[medication]?.frequency?.trim()) {
          errors[`${medication}_frequency`] = `${sections.details}: Frequency is required for ${medication}`;
        }
      });
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }
};
