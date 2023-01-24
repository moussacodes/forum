/*
  Warnings:

  - You are about to drop the column `title` on the `Comment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "title";

-- AlterTable
ALTER TABLE "thread" ADD COLUMN     "modified" BOOLEAN NOT NULL DEFAULT false;
