import { Injectable } from '@nestjs/common';
import { Environment } from 'src/env/environment';
import { LoginTicket, OAuth2Client, TokenPayload } from 'google-auth-library';
import { LoginGoogleRequestDto } from './dto/login-google-request.dto';
import { AuthService } from '../auth/auth.service';
import { UserProviderOptions } from 'src/app.shared';
import { InvalidIdTokenException } from './exception/invalid-id-token.exception';
import { UserEntity } from '../user/entity/user.entity';

@Injectable()
export class AuthGoogleService {
  private googleClient: OAuth2Client;

  constructor(
    private readonly env: Environment,
    private readonly authService: AuthService,
  ) {
    this.googleClient = new OAuth2Client(env.google.clientId, env.google.clientSecret);
  }

  async login(loginDto: LoginGoogleRequestDto) {
    const ticket: LoginTicket = await this.googleClient.verifyIdToken({
      idToken: loginDto.idToken,
      audience: [this.env.google.clientId],
    });

    const payload: TokenPayload = ticket.getPayload();

    if (!payload) {
      throw new InvalidIdTokenException();
    }

    const googleData: Partial<UserEntity> = {
      email: payload.email,
      firstName: payload.given_name,
      lastName: payload.family_name,
      avatarPath: payload.picture,
    };

    return this.authService.findOrUpsertUser(googleData, UserProviderOptions.GOOGLE, payload.sub);
  }
}
