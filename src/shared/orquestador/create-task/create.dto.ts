import { IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  titleTask: string;
  @IsString()
  @MinLength(0)
  @MaxLength(255)
  descriptionTask: string;
  @IsString()
  @IsNotEmpty()
  titleCategory: string;
  @IsString()
  @MinLength(0)
  @MaxLength(255)
  descriptionCategory: string;
}
