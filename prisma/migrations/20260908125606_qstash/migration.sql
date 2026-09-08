/*
  Warnings:

  - Added the required column `userToken` to the `PendingChannelConnection` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PendingChannelConnection" ADD COLUMN     "userToken" TEXT NOT NULL;
