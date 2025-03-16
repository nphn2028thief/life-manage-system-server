import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

class FoodItemDto {
  @IsString({ message: 'Food id must be a string' })
  @IsNotEmpty({ message: 'Food id cannot be empty' })
  id: string;

  @IsNumber({}, { message: 'Portion of food must be a number' })
  @IsNotEmpty({ message: 'Portion of food cannot be empty' })
  @IsPositive({ message: 'Portion of food must be at least 1 gram' })
  @Min(1)
  portion: number;
}

export class UpdateMealDto {
  @IsOptional()
  @IsString({ message: 'Meal name must be a string' })
  name?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Meal date is invalid' })
  date?: Date;

  @IsOptional()
  @IsDateString({}, { message: 'Meal time is invalid' })
  time?: Date;

  @IsOptional()
  @IsArray({ message: 'Foods must be an array' })
  @ValidateNested({ each: true })
  @Type(() => FoodItemDto)
  foods?: FoodItemDto[];
}
