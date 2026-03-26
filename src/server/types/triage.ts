export type TriageLlmResult = {
  icd10Code: string;
  icd10Description: string;
  recommendedTier: "PRIMARY" | "SECONDARY" | "TERTIARY";
  urgency: "routine" | "urgent" | "emergency";
  confidence: number;
};

export type HmoValidation = {
  covered: boolean;
  copayPercentage: number;
  annualLimit: number;
  reason?: string;
};

export type NearestFacility = {
  id: string;
  name: string;
  tier: string;
  distanceKm: number;
  address: string;
  city: string;
};

export type TriageResult = {
  sessionId: string;
  icd10Code: string;
  icd10Description: string;
  recommendedTier: "PRIMARY" | "SECONDARY" | "TERTIARY";
  urgency: "routine" | "urgent" | "emergency";
  confidence: number;
  llmProvider: string;
  hmoValidation: HmoValidation;
  nearestFacility: NearestFacility | null;
};
