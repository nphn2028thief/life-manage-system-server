import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

import { IsTimeString } from 'src/common/validators/is-time-string';

class FoodDto {
  @IsString({ message: 'Food id must be a string' })
  @IsNotEmpty({ message: 'Food id cannot be empty' })
  id: string;

  @IsNumber({}, { message: 'Portion of food must be a number' })
  @IsNotEmpty({ message: 'Portion of food cannot be empty' })
  @IsPositive({ message: 'Portion of food must be at least 1 gram' })
  @Min(1)
  portion: number;
}

export class CreateMealDto {
  @IsString({ message: 'Meal name must be a string' })
  @IsNotEmpty({ message: 'Meal name cannot be empty' })
  name: string;

  @IsDateString({}, { message: 'Meal date is invalid' })
  @IsNotEmpty({ message: 'Meal date cannot be empty' })
  date: string;

  @IsTimeString({ message: 'Meal time is invalid' })
  @IsNotEmpty({ message: 'Meal time cannot be empty' })
  time: string;

  @ArrayNotEmpty({ message: 'Foods must be at least 1' })
  @IsArray({ message: 'Foods must be an array' })
  @ValidateNested()
  @Type(() => FoodDto)
  foods: FoodDto[];
}

export default CreateMealDto;
