import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const db = new PrismaClient()

async function main() {
  // ─── HMO ────────────────────────────────────────────────────────────────────

  const hmo = await db.hMO.upsert({
    where: { id: 'seed-hmo-001' },
    update: {},
    create: {
      id: 'seed-hmo-001',
      name: 'Test HMO Nigeria',
      escrowWalletId: 'escrow-wallet-seed-001',
    },
  })

  // ─── HMO Plan ───────────────────────────────────────────────────────────────

  const plan = await db.hMOPlan.upsert({
    where: { id: 'seed-plan-001' },
    update: {},
    create: {
      id: 'seed-plan-001',
      hmoId: hmo.id,
      name: 'Standard Plan',
      coveredTiers: ['PRIMARY', 'SECONDARY'],
      coveredIcd10Ranges: ['A00-B99', 'J00-J99', 'K00-K93', 'M00-M99', 'R00-R99'],
      copayPercentage: 20,
      annualLimit: 500000,
    },
  })

  // ─── Test Patient User ──────────────────────────────────────────────────────

  const passwordHash = await bcrypt.hash('password123', 10)

  const user = await db.user.upsert({
    where: { email: 'patient@test.com' },
    update: {},
    create: {
      email: 'patient@test.com',
      passwordHash,
      role: 'PATIENT',
    },
  })

  // ─── Enrollee ───────────────────────────────────────────────────────────────

  await db.enrollee.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      hmoId: hmo.id,
      planId: plan.id,
      enrolleeNumber: 'ENC-TEST-000001',
    },
  })

  // ─── Facility (Lagos) ───────────────────────────────────────────────────────

  await db.facility.upsert({
    where: { id: 'seed-facility-primary-001' },
    update: {},
    create: {
      id: 'seed-facility-primary-001',
      name: 'Reddington Hospital',
      tier: 'PRIMARY',
      address: '12 Idejo Street, Victoria Island',
      city: 'Lagos',
      state: 'Lagos',
      latitude: 6.4281,
      longitude: 3.4219,
      phone: '+234-1-270-2200',
    },
  })

  await db.facility.upsert({
    where: { id: 'seed-facility-secondary-001' },
    update: {},
    create: {
      id: 'seed-facility-secondary-001',
      name: 'Lagos Island General Hospital',
      tier: 'SECONDARY',
      address: '1 Broad Street, Lagos Island',
      city: 'Lagos',
      state: 'Lagos',
      latitude: 6.4541,
      longitude: 3.3947,
      phone: '+234-1-263-2541',
    },
  })

  await db.facility.upsert({
    where: { id: 'seed-facility-tertiary-001' },
    update: {},
    create: {
      id: 'seed-facility-tertiary-001',
      name: 'Lagos University Teaching Hospital',
      tier: 'TERTIARY',
      address: 'Ishaga Road, Surulere',
      city: 'Lagos',
      state: 'Lagos',
      latitude: 6.5095,
      longitude: 3.3559,
      phone: '+234-1-774-8294',
    },
  })

  console.log('✓ Seed complete')
  console.log('  Test patient: patient@test.com / password123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
