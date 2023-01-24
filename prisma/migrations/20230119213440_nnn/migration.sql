/*
  Warnings:

  - You are about to alter the column `likes` on the `Comment` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `dislikes` on the `Comment` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `likes` on the `thread` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `dislikes` on the `thread` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "likes" SET DATA TYPE INTEGER,
ALTER COLUMN "dislikes" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "thread" ALTER COLUMN "likes" SET DATA TYPE INTEGER,
ALTER COLUMN "dislikes" SET DATA TYPE INTEGER;
