import { IsString } from 'class-validator';

export class GetUserDto {
  @IsString()
  readonly user_id: string;
}
