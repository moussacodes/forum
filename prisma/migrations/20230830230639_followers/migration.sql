/*
  Warnings:

  - The values [FEATURED_THREAD_] on the enum `UserBadge` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `statues` on the `Thread` table. All the data in the column will be lost.
  - Made the column `createdAt` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "UserBadge_new" AS ENUM ('STARTER', 'ACTIVE_POSTER', 'HELPER', 'DAILY_CONTRIBUTOR', 'ENGAGER', 'VERSATILE_POSTER', 'EVENT_ORGANIZER', 'BADGE_COLLECTOR', 'THREAD_CHAMPION', 'FEATURED_THREAD');
ALTER TABLE "Badge" ALTER COLUMN "name" TYPE "UserBadge_new" USING ("name"::text::"UserBadge_new");
ALTER TYPE "UserBadge" RENAME TO "UserBadge_old";
ALTER TYPE "UserBadge_new" RENAME TO "UserBadge";
DROP TYPE "UserBadge_old";
COMMIT;

-- AlterTable
ALTER TABLE "Thread" DROP COLUMN "statues",
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'open';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "updatedAt" SET NOT NULL,
ALTER COLUMN "updatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "_Followers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_Followers_AB_unique" ON "_Followers"("A", "B");

-- CreateIndex
CREATE INDEX "_Followers_B_index" ON "_Followers"("B");

-- AddForeignKey
ALTER TABLE "_Followers" ADD CONSTRAINT "_Followers_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Followers" ADD CONSTRAINT "_Followers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
