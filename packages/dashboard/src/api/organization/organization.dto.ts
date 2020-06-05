import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  readonly name: string;

  readonly avatar?: string;

  @IsString()
  @IsOptional()
  readonly introduction?: string;

  @IsNumber()
  readonly admin_id: number;
}
