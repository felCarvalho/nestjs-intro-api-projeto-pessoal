import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCategoryRascunhoDto {
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
