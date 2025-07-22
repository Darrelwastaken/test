export function formatMYR(value) {
  if (typeof value === 'string') value = value.replace(/[^\d.-]/g, '');
  const num = Number(value);
  if (isNaN(num)) return 'RM 0.00';
  return new Intl.NumberFormat('ms-MY', { style: 'currency', currency: 'MYR', minimumFractionDigits: 2 }).format(num);
}

// Extract birthday from Malaysian NRIC
export function extractBirthdayFromNRIC(nric) {
  if (!nric || typeof nric !== 'string') return null;
  
  // Remove any non-digit characters
  const cleanNRIC = nric.replace(/\D/g, '');
  
  if (cleanNRIC.length !== 12) return null;
  
  // Extract date components
  const year = cleanNRIC.substring(0, 2);
  const month = cleanNRIC.substring(2, 4);
  const day = cleanNRIC.substring(4, 6);
  
  // Determine full year (assuming 1900s for years 00-29, 2000s for years 30-99)
  let fullYear;
  const yearNum = parseInt(year);
  if (yearNum >= 0 && yearNum <= 29) {
    fullYear = 2000 + yearNum;
  } else {
    fullYear = 1900 + yearNum;
  }
  
  // Create date object
  const birthday = new Date(fullYear, parseInt(month) - 1, parseInt(day));
  
  // Validate date
  if (isNaN(birthday.getTime())) return null;
  
  return birthday;
}

// Format birthday for display
export function formatBirthday(birthday) {
  if (!birthday) return 'N/A';
  
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  return birthday.toLocaleDateString('en-MY', options);
}

// Calculate age from birthday
export function calculateAge(birthday) {
  if (!birthday) return null;
  
  const today = new Date();
  const birthDate = new Date(birthday);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
} 