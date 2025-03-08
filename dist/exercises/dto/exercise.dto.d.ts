import { ExcercisesCategory } from '@prisma/client';
export declare class CreateExerciseDto {
    name: string;
    description: string;
    category: ExcercisesCategory;
    caloriesBurnedPerRep: number;
}
export declare class UpdateExerciseDto {
    name: string;
    description: string;
    category: ExcercisesCategory;
    caloriesBurnedPerRep: number;
}
