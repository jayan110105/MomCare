/*
  Warnings:

  - Added the required column `iron` to the `Nutrition` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ironReq` to the `Nutrition` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Nutrition" ADD COLUMN     "iron" INTEGER NOT NULL,
ADD COLUMN     "ironReq" INTEGER NOT NULL;
