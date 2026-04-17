import { IsString, IsOptional } from 'class-validator';

export class UpdateCategoryDto {
  @IsString()
  @IsOptional()
  titleCategory: string;

  @IsString()
  @IsOptional()
  descriptionCategory: string;

  @IsString()
  @IsOptional()
  status: string;
}
