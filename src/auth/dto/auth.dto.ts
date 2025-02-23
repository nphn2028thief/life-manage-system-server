import { IsEmail, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SignUpDto {
  @IsString({ message: 'Username must be a string.' })
  @IsNotEmpty({ message: 'Username cannot be empty.' })
  username: string;

  @IsString({ message: 'Email must be a string.' })
  @IsEmail({}, { message: 'Email is invalid.' })
  @IsNotEmpty({ message: 'Email cannot be empty.' })
  email: string;

  @IsString({ message: 'Password must be a string.' })
  @IsNotEmpty({ message: 'Password cannot be empty.' })
  password: string;

  @IsString({ message: 'First name must be a string.' })
  @IsNotEmpty({ message: 'First name cannot be empty.' })
  firstName: string;

  @IsString({ message: 'Last name must be a string.' })
  @IsNotEmpty({ message: 'Last name cannot be empty.' })
  lastName: string;

  @IsString({ message: 'Date of birth must be a string.' })
  @IsNotEmpty({ message: 'Date of birth cannot be empty.' })
  dateOfBirth: Date;

  @IsNumber()
  @IsNotEmpty({ message: 'Weight cannot be empty.' })
  weight: number;

  @IsNumber()
  @IsNotEmpty({ message: 'Height cannot be empty.' })
  height: number;
}

export class SignInDto {
  @IsString({ message: 'Username must be a string.' })
  @IsNotEmpty({ message: 'Username cannot be empty.' })
  username: string;

  @IsString({ message: 'Password must be a string.' })
  @IsNotEmpty({ message: 'Password cannot be empty.' })
  password: string;
}
