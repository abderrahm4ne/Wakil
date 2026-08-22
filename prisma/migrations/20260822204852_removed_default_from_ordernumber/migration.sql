/*
  Warnings:

  - A unique constraint covering the columns `[botId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Order_botId_orderNumber_key";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "orderNumber" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_botId_key" ON "Order"("botId");
