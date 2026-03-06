import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateTaskDto {
  @IsString()
  @IsNotEmpty()
  completed: string;

  @IsString()
  @IsNotEmpty()
  titleTask: string;

  @IsString()
  @IsNotEmpty()
  descriptionTask: string;

  @IsString()
  @IsNotEmpty()
  idUser: string;

  @IsString()
  @IsNotEmpty()
  idTask: string;
}
