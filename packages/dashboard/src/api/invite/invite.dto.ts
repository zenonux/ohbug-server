import { IsString, IsNumber, IsArray, IsOptional } from 'class-validator';

import type { InviteAuth } from './invite.interface';

export class CreateInviteUrlDto {
  @IsString()
  readonly auth: InviteAuth;

  @IsArray()
  @IsOptional()
  readonly projects?: number[];

  @IsNumber()
  readonly organization_id: number;

  @IsNumber()
  readonly inviter_id: number;
}

export class GetInviteDto {
  @IsString()
  readonly uuid: string;
}

export class BindUserDto {
  @IsNumber()
  user_id: number;

  @IsString()
  readonly uuid: string;
}
