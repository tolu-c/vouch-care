-- AlterTable: add tokenSelector column for O(1) refresh token lookup
ALTER TABLE "RefreshToken" ADD COLUMN "tokenSelector" TEXT;

-- Revoke all existing refresh tokens since they have no selector and
-- cannot be looked up without a full table scan. Users will re-authenticate.
UPDATE "RefreshToken" SET "revoked" = true WHERE "tokenSelector" IS NULL;

-- Make tokenSelector NOT NULL now that all rows without one are revoked.
-- We use a sentinel value for the revoked rows so the NOT NULL constraint holds.
UPDATE "RefreshToken" SET "tokenSelector" = '' WHERE "tokenSelector" IS NULL;
ALTER TABLE "RefreshToken" ALTER COLUMN "tokenSelector" SET NOT NULL;

-- Add unique constraint and index.
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_tokenSelector_key" UNIQUE ("tokenSelector");
CREATE INDEX "RefreshToken_tokenSelector_idx" ON "RefreshToken"("tokenSelector");
