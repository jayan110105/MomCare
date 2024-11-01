/*
  Warnings:

  - Added the required column `calorieReq` to the `Nutrition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `carbsReq` to the `Nutrition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fatsReq` to the `Nutrition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fibreReq` to the `Nutrition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `proteinReq` to the `Nutrition` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Nutrition" ADD COLUMN     "calorieReq" INTEGER NOT NULL,
ADD COLUMN     "carbsReq" INTEGER NOT NULL,
ADD COLUMN     "fatsReq" INTEGER NOT NULL,
ADD COLUMN     "fibreReq" INTEGER NOT NULL,
ADD COLUMN     "proteinReq" INTEGER NOT NULL;
