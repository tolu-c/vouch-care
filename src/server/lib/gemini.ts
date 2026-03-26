import { GoogleGenerativeAI } from "@google/generative-ai";

import type { TriageLlmResult } from "@/server/types/triage";

const ICD10_PATTERN = /^[A-Z]\d{2}(\.\d{1,4}[A-Z]?)?$/;
const VALID_TIERS = ["PRIMARY", "SECONDARY", "TERTIARY"] as const;
const VALID_URGENCIES = ["routine", "urgent", "emergency"] as const;

function getClient(): GoogleGenerativeAI {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY environment variable is not set");
  return new GoogleGenerativeAI(key);
}

function buildPrompt(symptoms: string[]): string {
  return `You are a medical triage assistant. Given these symptoms: ${symptoms.join(", ")}

Respond ONLY with a JSON object (no markdown, no code fences) with these exact fields:
- icd10Code: the most likely ICD-10 code (e.g. "J06.9")
- icd10Description: description of the ICD-10 code
- recommendedTier: one of "PRIMARY", "SECONDARY", "TERTIARY"
- urgency: one of "routine", "urgent", "emergency"
- confidence: a number between 0 and 1`;
}

function parseResponse(text: string): TriageLlmResult {
  // Strip markdown code fences if present
  const cleaned = text
    .replace(/```(?:json)?\s*/g, "")
    .replace(/```\s*/g, "")
    .trim();

  const parsed: unknown = JSON.parse(cleaned);
  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("Response is not a JSON object");
  }

  const obj = parsed as Record<string, unknown>;

  const icd10Code = String(obj.icd10Code ?? "");
  if (!ICD10_PATTERN.test(icd10Code)) {
    throw new Error(`Invalid ICD-10 code: ${icd10Code}`);
  }

  const recommendedTier = String(obj.recommendedTier ?? "");
  if (!VALID_TIERS.includes(recommendedTier as (typeof VALID_TIERS)[number])) {
    throw new Error(`Invalid tier: ${recommendedTier}`);
  }

  const urgency = String(obj.urgency ?? "");
  if (!VALID_URGENCIES.includes(urgency as (typeof VALID_URGENCIES)[number])) {
    throw new Error(`Invalid urgency: ${urgency}`);
  }

  const confidence = Number(obj.confidence);
  if (Number.isNaN(confidence) || confidence < 0 || confidence > 1) {
    throw new Error(`Invalid confidence: ${obj.confidence}`);
  }

  return {
    icd10Code,
    icd10Description: String(obj.icd10Description ?? ""),
    recommendedTier: recommendedTier as TriageLlmResult["recommendedTier"],
    urgency: urgency as TriageLlmResult["urgency"],
    confidence,
  };
}

export async function triageWithGemini(symptoms: string[]): Promise<TriageLlmResult> {
  const client = getClient();
  const model = client.getGenerativeModel({ model: "gemini-2.0-flash" });

  let timerId: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timerId = setTimeout(() => reject(new Error("Gemini timed out after 2000ms")), 2000);
  });

  try {
    const response = await Promise.race([
      model.generateContent(buildPrompt(symptoms)),
      timeoutPromise,
    ]);
    clearTimeout(timerId);
    return parseResponse(response.response.text());
  } catch (err) {
    clearTimeout(timerId);
    throw err;
  }
}
