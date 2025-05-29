/**
 * Email validation function
 * @param {string} email - Email to validate
 * @returns {boolean} - True if email is valid
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Date validation function (DD-MM-YYYY or DD/MM/YYYY)
 * @param {string} date - Date to validate
 * @returns {boolean} - True if date is valid
 */
export const validateDate = (date) => {
  const dateRegex = /^(0[1-9]|[12][0-9]|3[01])[\/-](0[1-9]|1[0-2])[\/-](\d{4})$/;
  return dateRegex.test(date);
};
