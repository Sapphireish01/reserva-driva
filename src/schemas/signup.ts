import { z } from "zod";

export const signupSchema = z
  .object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Enter a valid email address"),
    phone: z.string().min(10, "Enter a valid phone number"),
    gender: z.enum(["Male", "Female", "Other", "Prefer not to say"], {
      message: "Select a gender",
    }),
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[a-z]/, "Must include a lowercase letter")
      .regex(/[A-Z]/, "Must include an uppercase letter")
      .regex(/[0-9]/, "Must include a number")
      .regex(/[^A-Za-z0-9]/, "Must include a special character"),
    confirmPassword: z.string(),
    referralCode: z.string().optional(),
    agreedToTerms: z.literal(true, {
      message: "You must accept the Terms and Privacy Policy",
    }),

  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;

export const ssnSchema = z.object({
  ssn: z
    .string()
    .regex(/^\d{9}$/, "Enter a valid 9-digit SSN"),
});

export type SsnFormValues = z.infer<typeof ssnSchema>;
