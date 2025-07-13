import { email, z } from 'zod';

//phone number vaildition
export const phoneNumberSchema = z.object({
    phoneNumber: z.string().regex(
        /^\+91[6-9]\d{9}$/,
        "Invalid phone number format, use only India country code (+91)"
    )
}).strict();

//otp validation
export const otpVerificationSchema = z.object({
    phoneNumber: z.string(),
    otp: z.string().regex(/^\d{4}$/, "OTP must be 4 digits long")
})

//user registration validation

export const userRegistrationSchema = z.object({
    phoneNumber: z.string().regex(
    /^\+91[6-9]\d{9}$/,
    'Invalid phone number format. Must include country code (e.g., +91)'
    ),
    email: z.string().email("Invalid email format"),
    name: z.string().min(2, "Name is required"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    role: z.enum(["PATIENT", "ADMIN"], {
        message: "Role must be either PATIENT or ADMIN",
      })
      .optional().default("PATIENT"),

    dateOfBirth: z.string().refine(
        (date) => {
          const parsedDate = new Date(date);
          return !isNaN(parsedDate.getTime()) && parsedDate < new Date();
        },
        { message: "Date of birth must be a valid past date" }
      ).optional(),
}).strict();