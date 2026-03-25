import crypto from 'node:crypto'

import { createServerFn } from '@tanstack/react-start'

import { db } from '@/server/lib/db'
import { triageWithGemini } from '@/server/lib/gemini'

import { getRedis } from '@/server/lib/redis'
import { triageWithRules } from '@/server/lib/triage-rules'
import { requireAuth } from '@/server/middleware/auth'
import { generateTokenSchema, triageSchema } from '@/server/schemas/triage'
import type { ApiResponse } from '@/server/types/auth'
import type {
  HmoValidation,
  NearestFacility,
  TriageLlmResult,
  TriageResult,
} from '@/server/types/triage'

// ─── Constants ──────────────────────────────────────────────────────────────

const EMERGENCY_KEYWORDS = [
  'chest pain',
  'difficulty breathing',
  'unconscious',
  'stroke',
  'seizure',
  'severe bleeding',
  'heart attack',
]

// ─── HMO Policy Validation ─────────────────────────────────────────────────

type HmoPolicyCache = {
  coveredTiers: string[]
  coveredIcd10Ranges: string[]
  copayPercentage: number
  annualLimit: number
}

function isIcd10InRanges(icd10Code: string, ranges: string[]): boolean {
  const code = icd10Code.replace('.', '').toUpperCase()
  const codeLetter = code.charCodeAt(0)
  const codeNum = parseInt(code.slice(1), 10)

  for (const range of ranges) {
    // Ranges look like "A00-B99"
    const parts = range.split('-')
    if (parts.length !== 2) continue

    const [start, end] = parts as [string, string]
    const startLetter = start.charCodeAt(0)
    const startNum = parseInt(start.slice(1), 10)
    const endLetter = end.charCodeAt(0)
    const endNum = parseInt(end.slice(1), 10)

    if (isNaN(startNum) || isNaN(endNum)) continue

    // Fast path: single-letter range (e.g. "G40-G43")
    if (startLetter === endLetter) {
      if (codeLetter === startLetter && codeNum >= startNum && codeNum <= endNum) return true
      continue
    }

    // Cross-letter range (e.g. "A00-B99")
    if (codeLetter > startLetter && codeLetter < endLetter) return true
    if (codeLetter === startLetter && codeNum >= startNum) return true
    if (codeLetter === endLetter && codeNum <= endNum) return true
  }

  return false
}

async function validateHmoPolicy(
  icd10Code: string,
  tier: string,
  planId: string,
): Promise<HmoValidation> {
  const redis = getRedis()
  const cacheKey = `hmo:policy:${planId}`

  let policy = await redis.get<HmoPolicyCache>(cacheKey)

  if (!policy) {
    const plan = await db.hMOPlan.findUnique({ where: { id: planId } })
    if (!plan) {
      return { covered: false, copayPercentage: 0, annualLimit: 0, reason: 'Plan not found' }
    }

    policy = {
      coveredTiers: plan.coveredTiers,
      coveredIcd10Ranges: plan.coveredIcd10Ranges,
      copayPercentage: plan.copayPercentage,
      annualLimit: plan.annualLimit,
    }

    await redis.set(cacheKey, policy, { ex: 3600 })
  }

  const tierCovered = policy.coveredTiers.includes(tier)
  const icd10Covered = isIcd10InRanges(icd10Code, policy.coveredIcd10Ranges)

  if (!tierCovered) {
    return {
      covered: false,
      copayPercentage: 0,
      annualLimit: 0,
      reason: `Tier ${tier} is not covered by your plan`,
    }
  }

  if (!icd10Covered) {
    return {
      covered: false,
      copayPercentage: 0,
      annualLimit: 0,
      reason: `Diagnosis code ${icd10Code} is not covered by your plan`,
    }
  }

  return {
    covered: true,
    copayPercentage: policy.copayPercentage,
    annualLimit: policy.annualLimit,
  }
}

// ─── Facility Matching ──────────────────────────────────────────────────────

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

async function findNearestFacility(
  tier: string,
  lat?: number,
  lon?: number,
): Promise<NearestFacility | null> {
  // Prisma expects the Tier enum value
  const tierEnum = tier as 'PRIMARY' | 'SECONDARY' | 'TERTIARY'

  if (lat === undefined || lon === undefined) {
    const facility = await db.facility.findFirst({ where: { tier: tierEnum } })
    if (!facility) return null
    return {
      id: facility.id,
      name: facility.name,
      tier: facility.tier,
      distanceKm: 0,
      address: facility.address,
      city: facility.city,
    }
  }

  const facilities = await db.facility.findMany({ where: { tier: tierEnum }, take: 100 })
  if (facilities.length === 0) return null

  const sorted = facilities
    .map((f) => ({
      facility: f,
      distance: haversineKm(lat, lon, f.latitude, f.longitude),
    }))
    .sort((a, b) => a.distance - b.distance)

  const closest = sorted[0]!
  return {
    id: closest.facility.id,
    name: closest.facility.name,
    tier: closest.facility.tier,
    distanceKm: Math.round(closest.distance * 100) / 100,
    address: closest.facility.address,
    city: closest.facility.city,
  }
}

// ─── Server Functions ───────────────────────────────────────────────────────

export const triageSymptoms = createServerFn({ method: 'POST' })
  .middleware([requireAuth])
  .inputValidator(triageSchema)
  .handler(
    async ({
      context,
      data,
    }): Promise<ApiResponse<TriageResult | null>> => {
      try {
        const { symptoms, latitude, longitude } = data

        // Emergency keyword bypass — use rules engine directly
        const symptomsLower = symptoms.map((s) => s.toLowerCase())
        const isEmergency = EMERGENCY_KEYWORDS.some((kw) =>
          symptomsLower.some((s) => s.includes(kw)),
        )

        // Fetch enrollee with HMO and plan
        const enrollee = await db.enrollee.findUnique({
          where: { userId: context.user.id },
          include: { hmo: true, plan: true },
        })

        if (!enrollee || !enrollee.plan || !enrollee.hmo) {
          return { success: false, error: 'No active HMO plan found', data: null }
        }

        // Determine triage result via LLM cascade or rules
        let llmResult: TriageLlmResult
        let llmProvider: string

        if (isEmergency) {
          llmResult = triageWithRules(symptoms)
          llmProvider = 'rules'
        } else {
          try {
            llmResult = await triageWithGemini(symptoms)
            llmProvider = 'gemini'
          } catch {
            llmResult = triageWithRules(symptoms)
            llmProvider = 'rules'
          }
        }

        // Validate HMO policy
        const hmoValidation = await validateHmoPolicy(
          llmResult.icd10Code,
          llmResult.recommendedTier,
          enrollee.planId,
        )

        // Find nearest facility
        const nearestFacility = await findNearestFacility(
          llmResult.recommendedTier,
          latitude,
          longitude,
        )

        // Save triage session
        const session = await db.triageSession.create({
          data: {
            enrolleeId: enrollee.id,
            symptoms,
            icd10Code: llmResult.icd10Code,
            recommendedTier: llmResult.recommendedTier,
            status: 'PENDING',
            llmProvider,
          },
        })

        return {
          success: true,
          data: {
            sessionId: session.id,
            icd10Code: llmResult.icd10Code,
            icd10Description: llmResult.icd10Description,
            recommendedTier: llmResult.recommendedTier,
            urgency: llmResult.urgency,
            confidence: llmResult.confidence,
            llmProvider,
            hmoValidation,
            nearestFacility,
          },
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Triage failed'
        return { success: false, error: message, data: null }
      }
    },
  )

export const generateReferralToken = createServerFn({ method: 'POST' })
  .middleware([requireAuth])
  .inputValidator(generateTokenSchema)
  .handler(
    async ({
      context,
      data,
    }): Promise<ApiResponse<{ token: string; expiresAt: string } | null>> => {
      try {
        const { sessionId } = data

        const triageSession = await db.triageSession.findUnique({
          where: { id: sessionId },
          include: { enrollee: true },
        })

        if (!triageSession || triageSession.enrollee.userId !== context.user.id) {
          return { success: false, error: 'Session not found', data: null }
        }

        // Fix 8: guard against duplicate token issuance
        const existing = await db.referralToken.findUnique({ where: { triageSessionId: sessionId } })
        if (existing) {
          return { success: false, error: 'A referral token has already been issued for this session', data: null }
        }

        // Build payload and encrypt with AES-256-GCM
        const encryptionKeyHex = process.env.TOKEN_ENCRYPTION_KEY
        if (!encryptionKeyHex) {
          throw new Error('TOKEN_ENCRYPTION_KEY environment variable is not set')
        }

        // Fix 13: look up a facility matching the session's recommended tier
        const tierEnum = (triageSession.recommendedTier ?? 'PRIMARY') as 'PRIMARY' | 'SECONDARY' | 'TERTIARY'
        const facility = await db.facility.findFirst({ where: { tier: tierEnum } })

        const payload = {
          enrolleeId: triageSession.enrolleeId,
          icd10Code: triageSession.icd10Code ?? '',
          recommendedTier: triageSession.recommendedTier ?? 'PRIMARY',
          facilityId: facility?.id ?? null,
          issuedAt: new Date().toISOString(),
        }

        const key = Buffer.from(encryptionKeyHex, 'hex')
        const iv = crypto.randomBytes(12)
        const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)

        const plaintext = JSON.stringify(payload)
        let encrypted = cipher.update(plaintext, 'utf8', 'hex')
        encrypted += cipher.final('hex')
        const authTag = cipher.getAuthTag()

        const encryptedPayload = `${iv.toString('hex')}:${encrypted}:${authTag.toString('hex')}`

        // Fix 1: generate a random raw token for the client (QR code payload)
        const rawToken = crypto.randomBytes(32).toString('hex')
        // Hash for DB storage — never stored/sent in raw form
        const tokenHash = crypto.createHmac('sha256', encryptionKeyHex).update(rawToken).digest('hex')

        const expiresAt = new Date(Date.now() + 60 * 60 * 1000)

        await db.referralToken.create({
          data: {
            triageSessionId: sessionId,
            tokenHash,
            encryptedPayload,
            expiresAt,
          },
        })

        await db.triageSession.update({
          where: { id: sessionId },
          data: { status: 'TOKEN_ISSUED' },
        })

        // Return raw token to the client — embedded in QR code
        // At scan time the server hashes rawToken to look up the ReferralToken row
        return {
          success: true,
          data: { token: rawToken, expiresAt: expiresAt.toISOString() },
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Token generation failed'
        return { success: false, error: message, data: null }
      }
    },
  )
