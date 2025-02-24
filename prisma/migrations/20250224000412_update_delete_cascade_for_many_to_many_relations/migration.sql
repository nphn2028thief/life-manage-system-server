-- DropForeignKey
ALTER TABLE "ExcercisesOnWorkouts" DROP CONSTRAINT "ExcercisesOnWorkouts_workoutId_fkey";

-- DropForeignKey
ALTER TABLE "FoodsOnMeals" DROP CONSTRAINT "FoodsOnMeals_mealId_fkey";

-- AddForeignKey
ALTER TABLE "ExcercisesOnWorkouts" ADD CONSTRAINT "ExcercisesOnWorkouts_workoutId_fkey" FOREIGN KEY ("workoutId") REFERENCES "Workouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FoodsOnMeals" ADD CONSTRAINT "FoodsOnMeals_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
