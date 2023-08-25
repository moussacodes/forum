/*
  Warnings:

  - You are about to drop the column `userId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "userId",
ALTER COLUMN "muted" SET DEFAULT false,
ALTER COLUMN "dislikedComments" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "dislikedThreads" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "likedComments" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "likedThreads" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "socialLinks" SET DEFAULT ARRAY[]::TEXT[];
