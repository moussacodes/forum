/*
  Warnings:

  - The `commentId` column on the `thread` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `tagsId` to the `thread` table without a default value. This is not possible if the table is not empty.
  - Added the required column `views` to the `thread` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "thread" ADD COLUMN     "tagId" INTEGER[],
ADD COLUMN     "tagsId" TEXT NOT NULL,
ADD COLUMN     "views" INTEGER NOT NULL,
DROP COLUMN "commentId",
ADD COLUMN     "commentId" INTEGER[];

-- CreateTable
CREATE TABLE "Tags" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "nbThreads" INTEGER NOT NULL,

    CONSTRAINT "Tags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tags_id_key" ON "Tags"("id");

-- AddForeignKey
ALTER TABLE "thread" ADD CONSTRAINT "thread_tagsId_fkey" FOREIGN KEY ("tagsId") REFERENCES "Tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
