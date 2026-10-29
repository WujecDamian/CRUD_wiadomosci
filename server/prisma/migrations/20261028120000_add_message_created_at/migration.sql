-- AlterTable
-- Backfill in UTC: Prisma writes createdAt in UTC, CURRENT_TIMESTAMP alone would use the session time zone.
ALTER TABLE "Message" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT (CURRENT_TIMESTAMP AT TIME ZONE 'UTC');
