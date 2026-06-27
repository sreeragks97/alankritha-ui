import { z } from "zod";

export const profileSchema = z.object({
  name: z.string().trim().min(2, "Name is required"),
  phone: z.string().trim().max(20, "Phone number is too long").optional().or(z.literal("")),
});

export const emailSchema = z.object({
  email: z.string().trim().email("Valid email is required"),
});

export const passwordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ProfileInput = z.infer<typeof profileSchema>;
export type EmailInput = z.infer<typeof emailSchema>;
export type PasswordInput = z.infer<typeof passwordSchema>;
