import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  titleTask: string;

  @IsString()
  @IsOptional()
  @MinLength(0)
  @MaxLength(255)
  descriptionTask: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  idCategory: string;

  @IsString()
  @IsOptional()
  status: string;
}
