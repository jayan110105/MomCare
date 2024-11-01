/*
  Warnings:

  - A unique constraint covering the columns `[symptomId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "symptomId" INTEGER;

-- CreateTable
CREATE TABLE "Symptom" (
    "id" SERIAL NOT NULL,
    "nausea" INTEGER NOT NULL,
    "fatigue" INTEGER NOT NULL,
    "moodSwings" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Symptom_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Symptom_userId_key" ON "Symptom"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_symptomId_key" ON "User"("symptomId");

-- AddForeignKey
ALTER TABLE "Symptom" ADD CONSTRAINT "Symptom_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
