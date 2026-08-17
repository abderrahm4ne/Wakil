/*
  Warnings:

  - You are about to drop the `MenuNode` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MenuNode" DROP CONSTRAINT "MenuNode_botId_fkey";

-- DropForeignKey
ALTER TABLE "MenuNode" DROP CONSTRAINT "MenuNode_parentId_fkey";

-- DropTable
DROP TABLE "MenuNode";

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "botId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "variant" TEXT,
    "price" DECIMAL(65,30) NOT NULL,
    "stock" INTEGER NOT NULL DEFAULT 0,
    "sku" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Product_botId_name_idx" ON "Product"("botId", "name");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_botId_fkey" FOREIGN KEY ("botId") REFERENCES "Bot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
