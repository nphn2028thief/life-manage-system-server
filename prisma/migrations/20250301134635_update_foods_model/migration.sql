/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Foods` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `addedBy` to the `Foods` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FoodsOnMeals" DROP CONSTRAINT "FoodsOnMeals_foodId_fkey";

-- AlterTable
ALTER TABLE "Foods" ADD COLUMN     "addedBy" "ExcercisesAddedBy" NOT NULL,
ADD COLUMN     "userId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Foods_name_key" ON "Foods"("name");

-- AddForeignKey
ALTER TABLE "FoodsOnMeals" ADD CONSTRAINT "FoodsOnMeals_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Foods"("id") ON DELETE CASCADE ON UPDATE CASCADE;
