import { IsString, IsNotEmpty } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  titleTask: string;

  @IsString()
  @IsNotEmpty()
  descriptionTask: string;
}
