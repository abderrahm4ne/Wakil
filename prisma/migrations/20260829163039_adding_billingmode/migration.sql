-- CreateEnum
CREATE TYPE "BillingMode" AS ENUM ('MONTHLY', 'ONE_TIME');

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "billingMode" "BillingMode" NOT NULL DEFAULT 'MONTHLY';
