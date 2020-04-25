import { IsString } from 'class-validator';

export class GetUserDto {
  @IsString()
  readonly id: string;
}
