export const validateName = (name: string): { isValid: boolean; error?: string } => {
  const trimmed = name.trim();
  if (trimmed.length === 0) {
    return { isValid: false, error: "Name cannot be empty" };
  }
  if (trimmed.length < 2) {
    return { isValid: false, error: "Name is too short (min 2 chars)" };
  }
  if (trimmed.length > 30) {
    return { isValid: false, error: "Name is too long (max 30 chars)" };
  }
  // Allow letters, spaces, and some common characters like hyphens
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(trimmed)) {
    return { isValid: false, error: "Name contains invalid characters" };
  }
  return { isValid: true };
};

export const validateMathInput = (input: string): { isValid: boolean; error?: string } => {
  const trimmed = input.trim();
  if (trimmed.length === 0) {
    return { isValid: false, error: "Input cannot be empty" };
  }
  if (trimmed.length > 10) {
    return { isValid: false, error: "Input is too long" };
  }
  // Allow only numbers and optional negative sign
  const mathRegex = /^-?\d+$/;
  if (!mathRegex.test(trimmed)) {
    return { isValid: false, error: "Please enter a valid number" };
  }
  return { isValid: true };
};

export const validateWhiteboardText = (text: string): { isValid: boolean; error?: string } => {
  const trimmed = text.trim();
  if (trimmed.length === 0) {
    return { isValid: false, error: "Text cannot be empty" };
  }
  if (trimmed.length > 50) {
    return { isValid: false, error: "Text is too long (max 50 chars)" };
  }
  // Allow most printable characters but restrict potentially dangerous ones if needed
  // For a whiteboard, we can be more permissive
  return { isValid: true };
};

export const formatInput = (input: string): string => {
  // Remove leading/trailing whitespace and collapse multiple internal spaces
  return input.trim().replace(/\s+/g, ' ');
};

export const cleanNumericInput = (input: string): string => {
  // Keep only digits and a single leading negative sign
  let cleaned = input.replace(/[^-0-9]/g, '');
  if (cleaned.indexOf('-') > 0) {
    cleaned = cleaned.replace(/-/g, '');
  }
  return cleaned;
};
