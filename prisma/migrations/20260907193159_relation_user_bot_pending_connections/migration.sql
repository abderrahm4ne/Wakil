-- DropIndex
DROP INDEX "PendingChannelConnection_userId_expiresAt_idx";

-- AlterTable
ALTER TABLE "PendingChannelConnection" ALTER COLUMN "pages" SET DEFAULT '[]';

-- CreateIndex
CREATE INDEX "PendingChannelConnection_userId_idx" ON "PendingChannelConnection"("userId");

-- CreateIndex
CREATE INDEX "PendingChannelConnection_expiresAt_idx" ON "PendingChannelConnection"("expiresAt");

-- AddForeignKey
ALTER TABLE "PendingChannelConnection" ADD CONSTRAINT "PendingChannelConnection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PendingChannelConnection" ADD CONSTRAINT "PendingChannelConnection_botId_fkey" FOREIGN KEY ("botId") REFERENCES "Bot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
