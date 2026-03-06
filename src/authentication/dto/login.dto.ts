import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginDto {
  @IsNotEmpty()
  @IsEmail()
  @MinLength(8)
  @MaxLength(150)
  identifier: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @MaxLength(150)
  password: string;
}
