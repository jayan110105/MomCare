/*
  Warnings:

  - A unique constraint covering the columns `[metricsId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "metricsId" INTEGER;

-- CreateTable
CREATE TABLE "Metrics" (
    "id" SERIAL NOT NULL,
    "age" INTEGER NOT NULL,
    "bloodPressure" TEXT NOT NULL,
    "glucose" INTEGER NOT NULL,
    "heartRate" INTEGER NOT NULL,
    "gestationalAge" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Metrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reminder" (
    "id" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Metrics_userId_key" ON "Metrics"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_metricsId_key" ON "User"("metricsId");

-- AddForeignKey
ALTER TABLE "Metrics" ADD CONSTRAINT "Metrics_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reminder" ADD CONSTRAINT "Reminder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
