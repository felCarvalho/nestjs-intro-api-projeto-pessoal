import { IsOptional } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  completed: string;

  @IsOptional()
  titleTask: string;

  @IsOptional()
  descriptionTask: string;

  @IsOptional()
  idUser: string;

  @IsOptional()
  idTask: string;
}
