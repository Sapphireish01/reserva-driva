export interface PasswordRule {
  label: string;
  passed: boolean;
}

export const usePasswordRules = (password: string): PasswordRule[] => [
  { label: "8+ characters", passed: password.length >= 8 },
  { label: "Lowercase letter", passed: /[a-z]/.test(password) },
  { label: "Uppercase letter", passed: /[A-Z]/.test(password) },
  { label: "Number", passed: /[0-9]/.test(password) },
  { label: "Special character", passed: /[^A-Za-z0-9]/.test(password) },
];
