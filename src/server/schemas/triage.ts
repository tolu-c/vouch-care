import { z } from "zod";

export const triageSchema = z.object({
  symptoms: z.string().min(1).max(200).array().min(1, "At least one symptom required").max(20),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export const generateTokenSchema = z.object({
  sessionId: z.string().min(1),
});
