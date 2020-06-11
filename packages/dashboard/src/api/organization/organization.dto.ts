import { IsString, IsNumberString, IsOptional } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  readonly name: string;

  @IsString()
  @IsOptional()
  readonly avatar?: string;

  @IsString()
  @IsOptional()
  readonly introduction?: string;

  @IsNumberString()
  readonly admin_id: number | string;
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

  @IsNumberString()
  readonly organization_id: number | string;
}

export class DeleteOrganizationDto {
  @IsNumberString()
  readonly organization_id: number | string;
}
