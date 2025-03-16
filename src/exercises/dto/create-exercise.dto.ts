import { ExercisesCategory } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateExerciseDto {
  @IsString({ message: 'Exercise name must be a string' })
  @IsNotEmpty({ message: 'Exercise name cannot be empty' })
  name: string;

  @IsString({ message: 'Description must be a string' })
  @IsNotEmpty({ message: 'Description name cannot be empty' })
  description: string;

  @IsEnum(ExercisesCategory, {
    message: 'Exercise category must be GYM or CARDIO',
  })
  @IsNotEmpty({ message: 'Exercise category cannot be empty' })
  category: ExercisesCategory;
}
