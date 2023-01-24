/*
  Warnings:

  - Made the column `threadId` on table `Comment` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_threadId_fkey";

-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "threadId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "thread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
