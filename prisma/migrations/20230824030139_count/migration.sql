/*
  Warnings:

  - You are about to drop the column `dislikes` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `dislikes` on the `thread` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `thread` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "dislikes",
DROP COLUMN "likes",
ADD COLUMN     "reactionCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "thread" DROP COLUMN "dislikes",
DROP COLUMN "likes",
ADD COLUMN     "reactionCount" INTEGER NOT NULL DEFAULT 0;
