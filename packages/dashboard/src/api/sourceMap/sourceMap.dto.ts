import { IsString, IsOptional, IsNumberString } from 'class-validator';

export class ReceiveSourceMapDto {
  @IsString()
  readonly apiKey: string;

  @IsString()
  readonly appVersion: string;

  @IsOptional()
  @IsString()
  readonly appType?: string;
}

export class GetSourceMapsDto {
  @IsString()
  readonly apiKey: string;
}

export class DeleteSourceMapsDto {
  @IsNumberString()
  readonly id: number | string;
}
