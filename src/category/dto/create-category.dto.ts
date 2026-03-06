import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  titleCategory: string;

  @IsString()
  @IsNotEmpty()
  descriptionCategory: string;
}
