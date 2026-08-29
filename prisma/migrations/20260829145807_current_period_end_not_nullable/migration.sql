/*
  Warnings:

  - Made the column `currentPeriodEnd` on table `Subscription` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Subscription" ALTER COLUMN "currentPeriodEnd" SET NOT NULL;
