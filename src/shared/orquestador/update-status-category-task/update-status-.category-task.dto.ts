import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class UpdateCategoryTaskDto {
  @IsString()
  @IsNotEmpty()
  idCategory: string;

  @IsString()
  @IsOptional()
  completed: string;

  @IsString()
  @IsOptional()
  statusCategory: string;
}
