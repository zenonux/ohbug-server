import {
  IsString,
  IsNumber,
  ValidateIf,
  IsNotEmpty,
  IsNumberString,
  IsDateString,
  IsOptional,
} from 'class-validator';
import type { ProjectType } from './project.interface';

const types: ProjectType[] = ['JavaScript', 'NodeJS'];
const validateType = (dto: CreateProjectDto) => types.includes(dto.type);

export class BaseProjectDto {
  @IsNumberString()
  readonly project_id: number;
}

export class CreateProjectDto {
  @IsString()
  readonly name: string;

  @ValidateIf(validateType)
  @IsNotEmpty()
  readonly type: ProjectType;

  @IsNumber()
  readonly admin_id: number;

  @IsNumber()
  readonly organization_id: number;
}

export class UpdateProjectDto {
  @IsString()
  readonly name: string;

  @ValidateIf(validateType)
  @IsNotEmpty()
  readonly type: ProjectType;
}

export class GetAllProjectsByOrganizationIdDto {
  @IsNumberString()
  readonly organization_id: number;

  @IsOptional()
  @IsNumberString()
  readonly user_id?: number;
}

export class GetTrendByProjectIdDto {
  @IsDateString()
  readonly start: Date;

  @IsDateString()
  readonly end: Date;
}
