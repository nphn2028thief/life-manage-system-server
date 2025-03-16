import {
  Allow,
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { WorkoutExcerciseDto } from './create-workout.dto';
import { Type } from 'class-transformer';

export class UpdateWorkoutDto {
  @IsOptional()
  @IsString({ message: 'Workout name must be a string' })
  name?: string;

  @IsOptional()
  @IsString()
  @Allow()
  description?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Start time is invalid' })
  startTime?: Date;

  @IsOptional()
  @IsDateString({}, { message: 'End time is invalid' })
  endTime?: Date;

  @IsOptional()
  @ArrayNotEmpty({ message: 'Exercises must be at least 1' })
  @IsArray({ message: 'Exercises must be an array' })
  @ValidateNested()
  @Type(() => WorkoutExcerciseDto)
  exercises: WorkoutExcerciseDto[];
}
