import { z } from "zod";

export const leadSchema = z.object({
  product_id: z.string().uuid().nullable().optional(),
  customer_name: z.string().trim().nullable().optional(),
  phone: z.string().trim().nullable().optional(),
  message: z.string().trim().nullable().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
