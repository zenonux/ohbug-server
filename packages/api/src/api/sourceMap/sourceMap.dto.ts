import { IsString, IsOptional } from 'class-validator';

export class ReceiveSourceMapDto {
  @IsString()
  readonly apiKey: string;

  @IsString()
  readonly appVersion: string;

  @IsOptional()
  @IsString()
  readonly appType?: string;
}
