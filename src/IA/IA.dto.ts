import { IsString, IsOptional } from 'class-validator';

export class IADto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  @IsOptional()
  id: string;
}
