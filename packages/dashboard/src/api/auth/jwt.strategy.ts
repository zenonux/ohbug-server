import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

import { AuthService } from './auth.service';
import type { JwtPayload } from './auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('security.jwt').secret,
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.authService.validateUser(payload.id);

    if (!user) {
      throw new UnauthorizedException(new Error('登录状态失效，请重新登录'));
    }

    return user;
  }
}
