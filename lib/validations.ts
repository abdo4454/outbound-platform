import { z } from "zod";

// ---- Lead Capture ----

export const leadFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  company: z.string().optional(),
  phone: z.string().optional(),
  companySize: z.string().optional(),
  interest: z.string().optional(),
  message: z.string().optional(),
  // Hidden attribution fields
  source: z.string().optional(),
  medium: z.string().optional(),
  campaign: z.string().optional(),
  content: z.string().optional(),
  term: z.string().optional(),
  landingPage: z.string().optional(),
  referrer: z.string().optional(),
  gclid: z.string().optional(),
  fbclid: z.string().optional(),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;

// ---- Contact Form (Simple) ----

export const contactFormSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  name: z.string().min(2, "Name is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// ---- Lead Magnet Download ----

export const leadMagnetSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  resourceId: z.string(),
});

// ---- Onboarding Steps ----

export const icpSchema = z.object({
  targetIndustries: z.array(z.string()).min(1, "Select at least one industry"),
  targetCompanySizes: z.array(z.string()).min(1, "Select at least one company size"),
  targetGeographies: z.array(z.string()).min(1, "Select at least one geography"),
  targetTitles: z.array(z.string()).min(1, "Add at least one target title"),
  exclusions: z.array(z.string()).optional(),
});

export const messagingSchema = z.object({
  valueProps: z.array(z.string()).min(1, "Add at least one value proposition"),
  tonePreference: z.enum(["professional", "casual", "bold", "consultative"]),
  painPoints: z.array(z.string()).min(1, "Add at least one pain point"),
  differentiators: z.array(z.string()).optional(),
  avoidPhrases: z.array(z.string()).optional(),
});

export const domainSchema = z.object({
  sendingDomains: z.array(z.string().url()).min(1, "Add at least one domain"),
  emailAccounts: z.array(z.object({
    email: z.string().email(),
    provider: z.enum(["google", "microsoft", "other"]),
  })),
});

// ---- Deal ----

export const dealSchema = z.object({
  title: z.string().min(2),
  value: z.number().min(0),
  stage: z.enum([
    "DISCOVERY_BOOKED",
    "DISCOVERY_COMPLETE",
    "PROPOSAL_SENT",
    "NEGOTIATION",
    "CLOSED_WON",
    "CLOSED_LOST",
  ]),
  services: z.array(z.string()),
  contractLength: z.number().optional(),
  setupFee: z.number().optional(),
  assignedToId: z.string().optional(),
});

export type DealFormData = z.infer<typeof dealSchema>;
