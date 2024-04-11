import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../user/entity/user.entity';
import { InvalidPasswordException } from './exception/invalid-password.exception';
import { UserNotFoundException } from '../user/exception/user-not-found.exception';
import { UserAccountRole, UserAccountStatus, UserProviderOptions } from 'src/app.shared';
import { TokenData } from './auth.shared';
import { UserRepository } from '../user/user.repository';
import { CreateUserRequestDto } from '../user/dto/create-user-request.dto';
import { Environment } from 'src/env/environment';
import { EmailService } from 'src/email/email.service';
import { InvalidTokenException } from './exception/invalid-token.exception';
import { EmailAlreadyConfirmedException } from './exception/email-already-confirmed.exception';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UserRepository, private readonly jwtService: JwtService, private readonly env: Environment, private readonly emailService: EmailService) {}
  
  async login(email: string, password: string): Promise<string> {
    const user: UserEntity = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UserNotFoundException();
    }

    const validPassword: boolean = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      throw new InvalidPasswordException();
    }

    return this.generateToken({ userId: user.id, role: user.role });
  }
  
  async findOrUpsertUser(providedUser: Partial<UserEntity>, provider: UserProviderOptions, providerKey: string) {
    const { email } = providedUser;

    const [userByEmail, userByProvider] = await Promise.all([
      this.userRepository.findByEmail(email),
      this.userRepository.findByProvider(provider, providerKey)
    ]);

    const user = JSON.stringify(userByProvider) === JSON.stringify(userByEmail) 
                 ? userByEmail
                 : await this.userRepository.upsert(providedUser);

    return this.generateToken({ userId: user.id, role: user.role });
  }

  async register(user: CreateUserRequestDto): Promise<void> {
    const createdUser = await this.userRepository.create({
      ...user,
      role: UserAccountRole.DEFAULT_USER,
      status: UserAccountStatus.INACTIVE
    })

    const hash = await this.jwtService.signAsync(
      {
        confirmEmailUserId: createdUser.id
      },
      {
        secret: this.env.authConfig.confirmEmailSecret,
        expiresIn: this.env.authConfig.confirmEmailExpiresIn
      }
    )

    await this.emailService.userSignUp({
      to: createdUser.email,
      data: {
        hash
      }
    })
  }

  async confirmEmail(token: string): Promise<void> {
    const jwtData = await this.jwtService.verifyAsync(token, {
      secret: this.env.authConfig.confirmEmailSecret
    });

    const userId = jwtData?.confirmEmailUserId;

    if (!userId) {
      throw new InvalidTokenException();
    }

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new UserNotFoundException();
    }

    if (user.status !== UserAccountStatus.INACTIVE) {
      throw new EmailAlreadyConfirmedException();
    }

    await this.userRepository.update(user.id, {
      status: UserAccountStatus.ACTIVE
    })
  }

  validateUser(userId: string) {
    return this.userRepository.findById(userId);
  }

  private generateToken(tokenData: TokenData) {
    const { userId, role } = tokenData;

    return this.jwtService.sign({
      userId,
      role
    })
  }
}