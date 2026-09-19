-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('TEXT', 'VOICE', 'IMAGE', 'MIXED');

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "imageAnalysis" TEXT,
ADD COLUMN     "mediaType" "MediaType" NOT NULL DEFAULT 'TEXT',
ADD COLUMN     "modelUsed" TEXT,
ADD COLUMN     "transcriptText" TEXT;

-- AlterTable
ALTER TABLE "MessageQueue" ADD COLUMN     "mediaType" "MediaType" NOT NULL DEFAULT 'TEXT',
ADD COLUMN     "mediaUrl" TEXT,
ALTER COLUMN "text" DROP NOT NULL;
