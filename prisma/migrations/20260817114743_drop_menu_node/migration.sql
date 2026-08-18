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
