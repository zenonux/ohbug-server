import {
  IsString,
  IsNumber,
  ValidateIf,
  IsNotEmpty,
  IsNumberString,
} from 'class-validator';
import type { ProjectType } from './project.interface';

const types: ProjectType[] = ['JavaScript', 'NodeJS'];
const validateType = (dto: CreateProjectDto) => types.includes(dto.type);

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

export class GetAllProjectsByOrganizationIdDto {
  @IsNumberString()
  readonly organization_id: number;
}

export class GetTrendByProjectIdDto {
  @IsNumberString()
  readonly project_id: number;

  @IsString()
  readonly start: Date;

  @IsString()
  readonly end: Date;
}
