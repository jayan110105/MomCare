/*
  Warnings:

  - A unique constraint covering the columns `[nutritionId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "nutritionId" INTEGER;

-- CreateTable
CREATE TABLE "Nutrition" (
    "id" SERIAL NOT NULL,
    "calorie" INTEGER NOT NULL,
    "protein" INTEGER NOT NULL,
    "fats" INTEGER NOT NULL,
    "carbs" INTEGER NOT NULL,
    "fibre" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Nutrition_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Nutrition_userId_key" ON "Nutrition"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_nutritionId_key" ON "User"("nutritionId");

-- AddForeignKey
ALTER TABLE "Nutrition" ADD CONSTRAINT "Nutrition_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
