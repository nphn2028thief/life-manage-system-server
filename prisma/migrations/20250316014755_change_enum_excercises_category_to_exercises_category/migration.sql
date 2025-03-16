/*
  Warnings:

  - Changed the type of `category` on the `Exercises` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ExercisesCategory" AS ENUM ('GYM', 'CARDIO');

-- AlterTable
ALTER TABLE "Exercises" DROP COLUMN "category",
ADD COLUMN     "category" "ExercisesCategory" NOT NULL;

-- DropEnum
DROP TYPE "ExcercisesCategory";
