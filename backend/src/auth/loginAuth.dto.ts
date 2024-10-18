import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginAuthDto {
  @IsString({ message: 'Email must be a string.' })
  @IsNotEmpty({ message: 'Email field cannot be empty.' })
  @IsEmail({}, { message: 'Invalid email format.' })
  email: string;
}
