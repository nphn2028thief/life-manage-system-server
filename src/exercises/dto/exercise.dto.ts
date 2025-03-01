import { ExcercisesCategory } from '@prisma/client';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateExerciseDto {
  @IsString({ message: 'Exercise name must be a string' })
  name: string;

  @IsString({ message: 'Description must be a string' })
  description: string;

  @IsEnum(ExcercisesCategory)
  category: ExcercisesCategory;

  @IsNumber({}, { message: 'Calories burned per rep must be a number' })
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
