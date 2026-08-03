-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('CHARGILY');

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "currentPeriodEnd" TIMESTAMP(3),
ADD COLUMN     "provider" "PaymentProvider",
ADD COLUMN     "providerCustomerId" TEXT,
ADD COLUMN     "providerSubscriptionId" TEXT,
ALTER COLUMN "isActive" SET DEFAULT false;
