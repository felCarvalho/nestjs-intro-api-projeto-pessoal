import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateCategoryTaskDto {
  @IsString()
  @IsNotEmpty()
  completed: string;
}
