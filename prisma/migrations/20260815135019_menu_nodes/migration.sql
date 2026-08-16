-- CreateEnum
CREATE TYPE "NodeType" AS ENUM ('MENU', 'CONFIRM', 'CALL_OWNER', 'FALLBACK');

-- CreateTable
CREATE TABLE "MenuNode" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "language" "Language" NOT NULL,
    "responseText" TEXT,
    "nodeType" "NodeType" NOT NULL DEFAULT 'MENU',
    "order" INTEGER NOT NULL DEFAULT 0,
    "botId" TEXT NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "MenuNode_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MenuNode" ADD CONSTRAINT "MenuNode_botId_fkey" FOREIGN KEY ("botId") REFERENCES "Bot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuNode" ADD CONSTRAINT "MenuNode_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "MenuNode"("id") ON DELETE SET NULL ON UPDATE CASCADE;
