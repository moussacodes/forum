-- AlterTable
ALTER TABLE "User" ADD COLUMN     "likedComments" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "likedThreads" TEXT[] DEFAULT ARRAY[]::TEXT[];
