import { Allow, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class WorkoutDto {
  @IsString({ message: 'Workout name must be a string' })
  @IsNotEmpty({ message: 'Workout name cannot be empty' })
  name: string;

  @IsString()
  @Allow()
  description: string;

  @IsString()
  @IsNotEmpty({ message: 'Start time cannot be empty' })
  startTime: Date;

  @IsString()
  @IsNotEmpty({ message: 'End time cannot be empty' })
  endTime: Date;

  @IsNumber()
  @IsNotEmpty({ message: 'Burned calories cannot be empty' })
  caloriesBurned: number;
}

export class ExcerciseDto {
  @IsString({ message: 'Excercise id must be a string' })
  @IsNotEmpty({ message: 'Exercise id cannot be empty' })
  id: string;

  @IsNumber()
  @IsNotEmpty({ message: 'Sets cannot be empty' })
  sets: number;

  @IsNumber()
  @IsNotEmpty({ message: 'Reps cannot be empty' })
  reps: number;

  @IsNumber()
  @IsNotEmpty({ message: 'Weight cannot be empty' })
  weight: number;
}

export class CreateWorkoutDto {
  @IsNotEmpty({ message: 'Workout cannot be empty' })
  workout: WorkoutDto;

  @IsNotEmpty({ message: 'Excercise must be at least 1' })
  excercises: ExcerciseDto[];
}
