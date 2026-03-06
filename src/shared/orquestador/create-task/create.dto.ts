import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  titleTask: string;
  @IsString()
  @IsNotEmpty()
  descriptionTask: string;
  @IsString()
  @IsNotEmpty()
  titleCategory: string;
  @IsString()
  @IsNotEmpty()
  descriptionCategory: string;
}
