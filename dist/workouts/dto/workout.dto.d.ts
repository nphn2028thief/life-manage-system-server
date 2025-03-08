export declare class WorkoutDto {
    name: string;
    description: string;
    startTime: Date;
    endTime: Date;
    caloriesBurned: number;
}
export declare class ExcerciseDto {
    id: string;
    sets: number;
    reps: number;
    weight: number;
}
export declare class CreateWorkoutDto {
    workout: WorkoutDto;
    excercises: ExcerciseDto[];
}
