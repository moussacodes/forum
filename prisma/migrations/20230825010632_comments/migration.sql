-- AlterTable
ALTER TABLE "User" ADD COLUMN     "dislikedComments" TEXT[],
ALTER COLUMN "badge" DROP NOT NULL;
