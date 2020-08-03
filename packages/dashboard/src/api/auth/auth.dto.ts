import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  Validate,
  IsNumberString,
  IsNotEmpty,
  IsString,
} from 'class-validator';

@ValidatorConstraint()
export class ValidateMobile implements ValidatorConstraintInterface {
  validate(text: string) {
    return /^1[3456789]\d{9}$/.test(text);
  }
}

export class CaptchaDto {
  @Validate(ValidateMobile)
  readonly mobile: string;
}

export class BaseAuthDto {
  @Validate(ValidateMobile)
  readonly mobile: string;

  @IsNumberString()
  readonly captcha: number | string;
}

export class LoginDto extends BaseAuthDto {}

export class BindUserDto extends BaseAuthDto {
  @IsString()
  readonly oauthType: 'github';

  @IsNotEmpty()
  readonly oauthUserDetail: any;
}
