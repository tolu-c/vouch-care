import type { TriageLlmResult } from '@/server/types/triage'

type RuleEntry = {
  keywords: string[]
  icd10Code: string
  icd10Description: string
  recommendedTier: 'PRIMARY' | 'SECONDARY' | 'TERTIARY'
  urgency: 'routine' | 'urgent' | 'emergency'
  confidence: number
}

const rules: RuleEntry[] = [
  {
    keywords: ['chest pain', 'heart attack'],
    icd10Code: 'I21.9',
    icd10Description: 'Acute myocardial infarction, unspecified',
    recommendedTier: 'TERTIARY',
    urgency: 'emergency',
    confidence: 0.9,
  },
  {
    keywords: ['difficulty breathing', 'shortness of breath'],
    icd10Code: 'R06.0',
    icd10Description: 'Dyspnea',
    recommendedTier: 'TERTIARY',
    urgency: 'emergency',
    confidence: 0.9,
  },
  {
    keywords: ['seizure'],
    icd10Code: 'G40.9',
    icd10Description: 'Epilepsy, unspecified',
    recommendedTier: 'TERTIARY',
    urgency: 'emergency',
    confidence: 0.9,
  },
  {
    keywords: ['stroke'],
    icd10Code: 'I64',
    icd10Description: 'Stroke, not specified as haemorrhage or infarction',
    recommendedTier: 'TERTIARY',
    urgency: 'emergency',
    confidence: 0.9,
  },
  {
    keywords: ['unconscious', 'unresponsive'],
    icd10Code: 'R55',
    icd10Description: 'Syncope and collapse',
    recommendedTier: 'TERTIARY',
    urgency: 'emergency',
    confidence: 0.9,
  },
  {
    keywords: ['fracture', 'broken bone', 'injury'],
    icd10Code: 'S09.9',
    icd10Description: 'Unspecified injury of head',
    recommendedTier: 'SECONDARY',
    urgency: 'urgent',
    confidence: 0.7,
  },
  {
    keywords: ['malaria', 'typhoid'],
    icd10Code: 'B54',
    icd10Description: 'Unspecified malaria',
    recommendedTier: 'PRIMARY',
    urgency: 'urgent',
    confidence: 0.7,
  },
  {
    keywords: ['fever', 'cold', 'cough', 'headache', 'flu'],
    icd10Code: 'J06.9',
    icd10Description: 'Acute upper respiratory infection, unspecified',
    recommendedTier: 'PRIMARY',
    urgency: 'routine',
    confidence: 0.6,
  },
]

const defaultResult: TriageLlmResult = {
  icd10Code: 'Z76.9',
  icd10Description: 'Person encountering health services in unspecified circumstances',
  recommendedTier: 'PRIMARY',
  urgency: 'routine',
  confidence: 0.5,
}

export function triageWithRules(symptoms: string[]): TriageLlmResult {
  const joined = symptoms.map((s) => s.toLowerCase()).join(' ')

  for (const rule of rules) {
    const matched = rule.keywords.some((kw) => joined.includes(kw))
    if (matched) {
      return {
        icd10Code: rule.icd10Code,
        icd10Description: rule.icd10Description,
        recommendedTier: rule.recommendedTier,
        urgency: rule.urgency,
        confidence: rule.confidence,
      }
    }
  }

  return { ...defaultResult }
}
