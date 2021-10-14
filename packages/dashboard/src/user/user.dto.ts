import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator'
import { Type } from 'class-transformer'

export class GetDto {
  @Type(() => Number)
  @IsNumber()
  readonly id: number
}

export class LoginDto {
  @IsString()
  @MinLength(4)
  @MaxLength(12)
  readonly name: string

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  readonly password: string
}

export class UpdatePasswordDto extends GetDto {
  @IsString()
  @MinLength(8)
  @MaxLength(20)
  readonly password: string

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  readonly oldPassword: string
}
