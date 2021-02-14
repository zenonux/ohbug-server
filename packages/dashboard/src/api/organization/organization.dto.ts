import { IsString, IsNumber, IsNumberString, IsOptional } from 'class-validator'

export class BaseOrganizationDto {
  @IsNumberString()
  readonly organization_id: number | string
}

export class CreateOrganizationDto {
  @IsString()
  readonly name: string

  @IsString()
  @IsOptional()
  readonly introduction?: string

  @IsNumber()
  readonly admin_id: number
}

export class UpdateOrganizationDto {
  @IsString()
  @IsOptional()
  readonly name?: string

  @IsString()
  @IsOptional()
  readonly introduction?: string
}
