-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "pfp" TEXT,
    "bio" TEXT,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "localization" TEXT,
    "refreshToken" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "badge" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "thread" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "content" TEXT NOT NULL,
    "tags" TEXT[],
    "likes" INTEGER DEFAULT 0,
    "dislikes" INTEGER DEFAULT 0,
    "likedBy" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "dislikedBy" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "modified" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "thread_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "modified" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT NOT NULL,
    "likes" INTEGER DEFAULT 0,
    "dislikes" INTEGER DEFAULT 0,
    "likedBy" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "dislikedBy" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "threadId" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "thread_id_key" ON "thread"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Comment_id_key" ON "Comment"("id");

-- AddForeignKey
ALTER TABLE "thread" ADD CONSTRAINT "thread_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "thread"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
