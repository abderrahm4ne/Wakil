-- AlterTable
ALTER TABLE "User" ADD COLUMN     "lastVerificationSent" TIMESTAMP(3),
ADD COLUMN     "verificationAttempts" INTEGER NOT NULL DEFAULT 0;
