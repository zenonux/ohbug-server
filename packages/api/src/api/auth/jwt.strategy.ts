import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { config } from '@/config';

import { AuthService } from './auth.service';
import type { JwtPayload } from './auth.interface';

function cookieExtractor(req) {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies.authorization;
  }
  return token;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      secretOrKey: config.jwt.secret,
    });
  }

  async validate(payload: JwtPayload, done: (arg0: any, arg1: any) => void) {
    const user = await this.authService.validateUser(payload);

    if (!user) {
      return done(new UnauthorizedException(), false);
    }
    done(null, user);
  }
}
