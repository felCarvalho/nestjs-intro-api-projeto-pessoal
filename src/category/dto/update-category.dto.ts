import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @IsNotEmpty()
  titleCategory: string;

  @IsString()
  @IsNotEmpty()
  descriptionCategory: string;

  @IsString()
  @IsNotEmpty()
  idUser: string;

  @IsString()
  @IsNotEmpty()
  id: string;
}
