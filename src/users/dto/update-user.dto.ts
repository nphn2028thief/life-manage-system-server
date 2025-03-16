import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'First name must be a string' })
  firstName?: string;

  @IsOptional()
  @IsString({ message: 'Last name must be a string' })
  lastName?: string;

  @IsOptional()
  @IsDateString({}, { message: 'Date of birth is invalid' })
  dateOfBirth?: Date;

  @IsOptional()
  @IsNumber({}, { message: 'Weight must be a number' })
  weight?: number;

  @IsOptional()
  @IsNumber({}, { message: 'Height must be a number' })
  height?: number;
}
