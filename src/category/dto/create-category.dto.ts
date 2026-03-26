import { IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  titleCategory: string;

  @IsString()
  descriptionCategory: string;
}
