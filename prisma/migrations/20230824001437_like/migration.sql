/*
  Warnings:

  - You are about to drop the column `dislikedBy` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `likedBy` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `dislikedBy` on the `thread` table. All the data in the column will be lost.
  - You are about to drop the column `likedBy` on the `thread` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "dislikedBy",
DROP COLUMN "likedBy",
ADD COLUMN     "dislikes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "thread" DROP COLUMN "dislikedBy",
DROP COLUMN "likedBy",
ADD COLUMN     "dislikes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "likes" INTEGER NOT NULL DEFAULT 0;
