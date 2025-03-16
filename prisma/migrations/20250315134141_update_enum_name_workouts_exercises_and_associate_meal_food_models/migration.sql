/*
  Warnings:

  - You are about to drop the column `caloriesBurnedPerRep` on the `Excercises` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `FoodsOnMeals` table. All the data in the column will be lost.
  - You are about to drop the column `caloriesBurned` on the `Workouts` table. All the data in the column will be lost.
  - Changed the type of `addedBy` on the `Excercises` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `addedBy` on the `Foods` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `portion` to the `FoodsOnMeals` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AddedBy" AS ENUM ('SYSTEM', 'USER');

-- AlterTable
ALTER TABLE "Excercises" DROP COLUMN "caloriesBurnedPerRep",
DROP COLUMN "addedBy",
ADD COLUMN     "addedBy" "AddedBy" NOT NULL;

-- AlterTable
ALTER TABLE "Foods" DROP COLUMN "addedBy",
ADD COLUMN     "addedBy" "AddedBy" NOT NULL;

-- AlterTable
ALTER TABLE "FoodsOnMeals" DROP COLUMN "quantity",
ADD COLUMN     "portion" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Workouts" DROP COLUMN "caloriesBurned";

-- DropEnum
DROP TYPE "ExcercisesAddedBy";
