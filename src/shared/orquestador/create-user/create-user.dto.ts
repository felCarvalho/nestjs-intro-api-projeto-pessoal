import { IsString, IsEmail, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Tipo string' })
  @MinLength(8, { message: 'Mínimo de 8 caracteres' })
  @MaxLength(150, { message: 'Máximo de 150 caracteres' })
  name: string;

  @IsEmail()
  @MinLength(8, { message: 'Mínimo de 8 caracteres' })
  @MaxLength(150, { message: 'Máximo de 150 caracteres' })
  identifier: string;

  @IsString()
  @MinLength(8, { message: 'Mínimo de 8 caracteres' })
  @MaxLength(150, { message: 'Máximo de 150 caracteres' })
  password: string;

  @IsString()
  @MinLength(8, { message: 'Mínimo de 8 caracteres' })
  @MaxLength(150, { message: 'Máximo de 150 caracteres' })
  passwordConfirm: string;
}
