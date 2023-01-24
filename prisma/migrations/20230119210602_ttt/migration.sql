/*
  Warnings:

  - You are about to drop the column `commentId` on the `thread` table. All the data in the column will be lost.
  - You are about to drop the column `tagId` on the `thread` table. All the data in the column will be lost.
  - You are about to drop the column `tagsId` on the `thread` table. All the data in the column will be lost.
  - You are about to drop the column `threadId` on the `thread` table. All the data in the column will be lost.
  - You are about to drop the `Tags` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "thread" DROP CONSTRAINT "thread_tagsId_fkey";

-- AlterTable
ALTER TABLE "thread" DROP COLUMN "commentId",
DROP COLUMN "tagId",
DROP COLUMN "tagsId",
DROP COLUMN "threadId",
ADD COLUMN     "tags" TEXT[];

-- DropTable
DROP TABLE "Tags";
