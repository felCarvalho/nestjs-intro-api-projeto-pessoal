import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  titleTask: string;

  @IsOptional()
  @IsString()
  descriptionTask: string;

  @IsOptional()
  @IsString()
  status: string;
}
