import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly avatar?: string;

  @IsString()
  @IsOptional()
  readonly introduction?: string;

  @IsNumber()
  readonly admin_id: number;
}

export class UpdateOrganizationDto {
  @IsString()
  @IsOptional()
  readonly name?: string;

  @IsString()
  @IsOptional()
  readonly avatar?: string;

  @IsString()
  @IsOptional()
  readonly introduction?: string;

  @IsNumber()
  readonly organization_id: number;
}

export class DeleteOrganizationDto {
  @IsNumber()
  readonly organization_id: number;
}
