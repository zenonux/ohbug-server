import { IsString, IsNumber } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  readonly name: string;

  readonly avatar?: string;

  @IsNumber()
  readonly admin_id: number;
}
