/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Excercises` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ExcercisesOnWorkouts" DROP CONSTRAINT "ExcercisesOnWorkouts_exerciseId_fkey";

-- CreateIndex
CREATE UNIQUE INDEX "Excercises_name_key" ON "Excercises"("name");

-- AddForeignKey
ALTER TABLE "ExcercisesOnWorkouts" ADD CONSTRAINT "ExcercisesOnWorkouts_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Excercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;
