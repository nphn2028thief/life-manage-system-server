import { ExcercisesCategory } from '@prisma/client';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateExerciseDto {
  @IsString({ message: 'Exercise name must be a string' })
  @IsNotEmpty({ message: 'Exercise name cannot be empty' })
  name: string;

  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description name cannot be empty' })
  description: string;

  @IsEnum(ExcercisesCategory, {
    message: 'Exercise category must be GYM or CARDIO',
  })
  @IsNotEmpty({ message: 'Exercise category cannot be empty' })
  category: ExcercisesCategory;

  @IsNumber({}, { message: 'Calories burned per rep must be a number' })
  @IsNotEmpty({ message: 'Calories burned per rep cannot be empty' })
  caloriesBurnedPerRep: number;
}

export class UpdateExerciseDto {
  @IsString({ message: 'Exercise name must be a string' })
  @IsOptional()
  name: string;

  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description: string;

  @IsEnum(ExcercisesCategory)
  @IsOptional()
  category: ExcercisesCategory;

  @IsNumber({}, { message: 'Calories burned per rep must be a number' })
  @IsOptional()
  caloriesBurnedPerRep: number;
}
