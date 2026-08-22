/*
  Warnings:

  - A unique constraint covering the columns `[botId,orderNumber]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Bot" ADD COLUMN     "orderCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "orderNumber" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "Order_botId_orderNumber_key" ON "Order"("botId", "orderNumber");
