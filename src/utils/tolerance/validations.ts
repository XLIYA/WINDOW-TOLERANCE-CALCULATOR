/**
 * Validate that required project fields are not empty.
 *
 * @param buildingName The name of the building
 * @param engineerName The supervising engineer's name
 * @returns An array of error messages (empty if valid)
 */
export const validateProjectInfo = (buildingName: string, engineerName: string): string[] => {
  const errors: string[] = [];

  if (!buildingName.trim()) {
    errors.push('نام ساختمان الزامی است');
  }

  if (!engineerName.trim()) {
    errors.push('نام مهندس ناظر الزامی است');
  }

  return errors;
};

/**
 * Ensure a window code is provided and unique within the existing codes list.
 *
 * @param code The new window code to validate
 * @param existingCodes Array of codes already in use
 * @returns A string describing the error or null if the code is valid
 */
export const validateWindowCode = (code: string, existingCodes: string[]): string | null => {
  if (!code.trim()) {
    return 'کد پنجره الزامی است';
  }

  if (existingCodes.includes(code)) {
    return 'این کد پنجره قبلاً استفاده شده است';
  }

  return null;
};

/**
 * Validate numeric dimensions to ensure they are within a reasonable range.
 *
 * @param value The numeric value to validate
 * @param fieldName A friendly name for the field being validated
 * @returns A string describing the error or null if the value is valid
 */
export const validateDimension = (value: number, fieldName: string): string | null => {
  if (value <= 0) {
    return `${fieldName} باید بزرگتر از صفر باشد`;
  }

  if (value > 10000) {
    return `${fieldName} نمی‌تواند بیشتر از 10 متر باشد`;
  }

  return null;
};