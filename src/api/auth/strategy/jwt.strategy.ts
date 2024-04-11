import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import { Environment } from 'src/env/environment';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    public env: Environment,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: env.jwtSecret,
    });
  }

  async validate(payload: { userId: string }) {
    const user = await this.authService.validateUser(payload.userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
