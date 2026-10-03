-- CreateEnum
CREATE TYPE "Level" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "instructor" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "level" "Level" NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Module" (
    "id" SERIAL NOT NULL,
    "courseId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "durationSeconds" INTEGER NOT NULL,
    "videoUrl" TEXT NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AudioTrack" (
    "id" SERIAL NOT NULL,
    "moduleId" INTEGER NOT NULL,
    "language" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "AudioTrack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enrollment" (
    "userId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("userId","courseId")
);

-- CreateTable
CREATE TABLE "ModuleCompletion" (
    "userId" INTEGER NOT NULL,
    "moduleId" INTEGER NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ModuleCompletion_pkey" PRIMARY KEY ("userId","moduleId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Module_courseId_position_key" ON "Module"("courseId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "AudioTrack_moduleId_language_key" ON "AudioTrack"("moduleId", "language");

-- AddForeignKey
ALTER TABLE "Module" ADD CONSTRAINT "Module_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AudioTrack" ADD CONSTRAINT "AudioTrack_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleCompletion" ADD CONSTRAINT "ModuleCompletion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleCompletion" ADD CONSTRAINT "ModuleCompletion_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;
