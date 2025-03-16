/*
  Warnings:

  - You are about to drop the `ExcercisesOnWorkouts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ExcercisesOnWorkouts" DROP CONSTRAINT "ExcercisesOnWorkouts_exerciseId_fkey";

-- DropForeignKey
ALTER TABLE "ExcercisesOnWorkouts" DROP CONSTRAINT "ExcercisesOnWorkouts_workoutId_fkey";

-- DropTable
DROP TABLE "ExcercisesOnWorkouts";

-- CreateTable
CREATE TABLE "ExercisesOnWorkouts" (
    "workoutId" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "sets" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExercisesOnWorkouts_pkey" PRIMARY KEY ("workoutId","exerciseId")
);

-- AddForeignKey
ALTER TABLE "ExercisesOnWorkouts" ADD CONSTRAINT "ExercisesOnWorkouts_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExercisesOnWorkouts" ADD CONSTRAINT "ExercisesOnWorkouts_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;
