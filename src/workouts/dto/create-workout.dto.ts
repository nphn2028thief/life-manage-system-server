import { Type } from 'class-transformer';
import {
  Allow,
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';

export class WorkoutExcerciseDto {
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
  @IsString({ message: 'Workout name must be a string' })
  @IsNotEmpty({ message: 'Workout name cannot be empty' })
  name: string;

  @IsString()
  @Allow()
  description: string;

  @IsDateString({}, { message: 'Start time is invalid' })
  @IsNotEmpty({ message: 'Start time cannot be empty' })
  startTime: Date;

  @IsDateString({}, { message: 'End time is invalid' })
  @IsNotEmpty({ message: 'End time cannot be empty' })
  endTime: Date;

  @ArrayNotEmpty({ message: 'Exercises must be at least 1' })
  @IsArray({ message: 'Exercises must be an array' })
  @ValidateNested()
  @Type(() => WorkoutExcerciseDto)
  exercises: WorkoutExcerciseDto[];
}
