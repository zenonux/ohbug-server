import { IsEmail, IsString, IsOptional } from 'class-validator'

export class GetUserDto {
  @IsString()
  readonly user_id: string
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  readonly name?: string

  @IsOptional()
  @IsEmail()
  readonly email?: string

  @IsOptional()
  @IsString()
  readonly avatar?: string
}
