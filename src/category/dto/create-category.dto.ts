import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  titleCategory: string;

  @IsString()
  @IsOptional()
  descriptionCategory: string;

  @IsString()
  @IsOptional()
  status: string;
}
