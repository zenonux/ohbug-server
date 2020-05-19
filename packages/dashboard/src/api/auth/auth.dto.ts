import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  Validate,
  IsNumber,
  IsNotEmpty,
  IsString,
} from 'class-validator';

@ValidatorConstraint()
export class ValidateMobile implements ValidatorConstraintInterface {
  validate(text: string) {
    if (!/^1[3456789]\d{9}$/.test(text)) {
      return false;
    }
    return true;
  }
}

export class CaptchaDto {
  @Validate(ValidateMobile)
  readonly mobile: string;
}

export class SignupDto {
  @Validate(ValidateMobile)
  readonly mobile: string;

  @IsNumber()
  readonly captcha: number;
}

export class LoginDto {
  @Validate(ValidateMobile)
  readonly mobile: string;

  @IsNumber()
  readonly captcha: number;
}

export class BindUserDto {
  @Validate(ValidateMobile)
  readonly mobile: string;

  @IsNumber()
  readonly captcha: number;

  @IsString()
  readonly oauthType: 'github';

  @IsNotEmpty()
  readonly oauthUserDetail: any;
}
