/*
  Warnings:

  - Added the required column `addedBy` to the `Excercises` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ExcercisesAddedBy" AS ENUM ('SYSTEM', 'USER');

-- AlterTable
ALTER TABLE "Excercises" ADD COLUMN     "addedBy" "ExcercisesAddedBy" NOT NULL,
ADD COLUMN     "userId" TEXT;
