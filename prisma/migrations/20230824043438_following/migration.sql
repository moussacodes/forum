/*
  Warnings:

  - You are about to drop the `thread` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_threadId_fkey";

-- DropForeignKey
ALTER TABLE "thread" DROP CONSTRAINT "thread_userId_fkey";

-- AlterTable
CREATE SEQUENCE user_badge_seq;
ALTER TABLE "User" ALTER COLUMN "createdAt" DROP NOT NULL,
ALTER COLUMN "updatedAt" DROP NOT NULL,
ALTER COLUMN "verified" DROP NOT NULL,
ALTER COLUMN "badge" DROP NOT NULL,
ALTER COLUMN "badge" SET DEFAULT nextval('user_badge_seq'),
ALTER COLUMN "socialLinks" DROP DEFAULT,
ALTER COLUMN "likedComments" DROP DEFAULT,
ALTER COLUMN "likedThreads" DROP DEFAULT;
ALTER SEQUENCE user_badge_seq OWNED BY "User"."badge";

-- DropTable
DROP TABLE "thread";

-- CreateTable
CREATE TABLE "Thread" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,
    "tags" TEXT[],
    "reactionCount" INTEGER NOT NULL DEFAULT 0,
    "modified" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "statues" TEXT NOT NULL DEFAULT 'open',

    CONSTRAINT "Thread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_users" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Thread_id_key" ON "Thread"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_users_AB_unique" ON "_users"("A", "B");

-- CreateIndex
CREATE INDEX "_users_B_index" ON "_users"("B");

-- AddForeignKey
ALTER TABLE "Thread" ADD CONSTRAINT "Thread_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_users" ADD CONSTRAINT "_users_A_fkey" FOREIGN KEY ("A") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_users" ADD CONSTRAINT "_users_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
