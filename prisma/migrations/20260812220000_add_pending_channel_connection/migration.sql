CREATE TABLE "PendingChannelConnection" (
    "id" TEXT NOT NULL,
    "platform" "ChannelType" NOT NULL,
    "pages" JSONB NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "botId" TEXT NOT NULL,
    CONSTRAINT "PendingChannelConnection_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PendingChannelConnection_userId_expiresAt_idx"
ON "PendingChannelConnection"("userId", "expiresAt");
