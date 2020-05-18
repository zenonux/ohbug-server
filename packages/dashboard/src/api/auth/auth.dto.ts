import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  Validate,
  IsNumber,
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
