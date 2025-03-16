import { ExercisesCategory } from '@prisma/client';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateExerciseDto {
  @IsString({ message: 'Exercise name must be a string' })
  @IsOptional()
  name?: string;

  @IsString({ message: 'Description must be a string' })
  @IsOptional()
  description?: string;

  @IsEnum(ExercisesCategory)
  @IsOptional()
  category: ExercisesCategory;
}
