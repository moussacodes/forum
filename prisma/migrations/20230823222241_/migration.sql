/*
  Warnings:

  - You are about to drop the column `dislikes` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `dislikes` on the `thread` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `thread` table. All the data in the column will be lost.
  - You are about to drop the `Like` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "dislikes",
DROP COLUMN "likes";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "socialLinks" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "thread" DROP COLUMN "dislikes",
DROP COLUMN "likes",
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "statues" TEXT NOT NULL DEFAULT 'open';

-- DropTable
DROP TABLE "Like";
