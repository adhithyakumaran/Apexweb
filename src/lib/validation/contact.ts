import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  company: z.string().optional(),
  message: z.string().min(10, "Tell us a bit more (min 10 characters)"),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;