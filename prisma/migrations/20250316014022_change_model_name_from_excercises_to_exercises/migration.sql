/*
  Warnings:

  - You are about to drop the `Excercises` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ExcercisesOnWorkouts" DROP CONSTRAINT "ExcercisesOnWorkouts_exerciseId_fkey";

-- DropTable
DROP TABLE "Excercises";

-- CreateTable
CREATE TABLE "Exercises" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" "ExcercisesCategory" NOT NULL,
    "description" TEXT,
    "addedBy" "AddedBy" NOT NULL,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Exercises_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Exercises_name_key" ON "Exercises"("name");

-- AddForeignKey
ALTER TABLE "ExcercisesOnWorkouts" ADD CONSTRAINT "ExcercisesOnWorkouts_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;
