import { z } from "zod";

/**
 * Registration form validation schema
 */
export const registrationSchema = z.object({
  webinarId: z.string().uuid("Invalid webinar reference"),
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .trim(),
  email: z.string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .toLowerCase()
    .trim(),
  phone: z.string()
    .min(8, "Phone number must be at least 8 digits")
    .max(20, "Phone number must be less than 20 digits")
    .regex(/^[+]?[0-9\s\-()]{8,20}$/, "Please enter a valid phone number")
    .trim(),
  profession: z.string().max(100, "Profession must be less than 100 characters").optional().or(z.literal("")),
  experience: z.string().max(100, "Experience must be less than 100 characters").optional().or(z.literal("")),
  mainChallenge: z.string().max(500, "Challenge description is too long").optional().or(z.literal("")),
  
  // Pricing / payment tier
  ticketTier: z.enum(["GENERAL", "VIP"]),
  paymentId: z.string().max(255).optional().or(z.literal("")),
  
  // UTM tracking fields
  utmSource: z.string().optional().nullable(),
  utmMedium: z.string().optional().nullable(),
  utmCampaign: z.string().optional().nullable(),
  utmTerm: z.string().optional().nullable(),
  utmContent: z.string().optional().nullable(),
  
  // Honeypot field (should be empty for human submissions)
  website: z.string().max(100).optional().or(z.literal("")),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
