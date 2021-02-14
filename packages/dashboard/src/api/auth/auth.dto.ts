import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class BaseAuthDto {
  @IsEmail()
  readonly email: string
}

export class SignupDto extends BaseAuthDto {
  @IsString()
  readonly name: string

  @IsString()
  readonly password: string
}

export class ActivateDto {
  @IsString()
  readonly captcha: string
}

export class SendActivationEmailDto {
  @IsEmail()
  readonly email: string
}

export class LoginDto extends BaseAuthDto {
  @IsString()
  readonly password: string
}

export class CaptchaDto extends BaseAuthDto {}

export class ResetDto extends BaseAuthDto {
  @IsString()
  readonly password: string

  @IsString()
  readonly captcha: string
}

export class BindUserDto extends BaseAuthDto {
  @IsString()
  readonly captcha: string

  @IsString()
  readonly oauthType: 'github'

  @IsNotEmpty()
  readonly oauthUserDetail: any
}
