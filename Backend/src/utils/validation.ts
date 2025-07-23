import { z } from 'zod';

// Reusable phone number validator
const phoneField = z.string().regex(
  /^\+91[6-9]\d{9}$/,
  "Invalid phone number format. Must include country code (+91)"
);

// Phone number validation
export const phoneNumberSchema = z.object({
  phoneNumber: phoneField,
}).strict();

// OTP verification validation
export const otpVerificationSchema = z.object({
  phoneNumber: phoneField,
  otp: z.string().regex(/^\d{4}$/, "OTP must be 4 digits long"),
});

// User registration validation
export const userRegistrationSchema = z.object({
  phoneNumber: phoneField,
  email: z.string().email("Invalid email format"),
  firstName: z.string().min(2, "Name is required"),
  lastName: z.string().min(2, "Name is required"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  role: z.enum(["PATIENT", "ADMIN"], {
    message: "Role must be either PATIENT or ADMIN",
  }).optional().default("PATIENT"),
  dateOfBirth: z.string().refine(
    (date) => {
      const parsedDate = new Date(date);
      return !isNaN(parsedDate.getTime()) && parsedDate < new Date();
    },
    { message: "Date of birth must be a valid past date" }
  ).optional(),
}).strict();
