import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiNoContentResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { CreateUserRequestDto } from '../user/dto/create-user-request.dto';

@ApiTags('Auth')
@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOkResponse({ type: LoginResponseDto })
  async login(@Body() { email, password }: LoginRequestDto): Promise<LoginResponseDto> {
    const accessToken = await this.authService.login(email, password);
    return new LoginResponseDto(accessToken);
  }

  @Post('register')
  @ApiNoContentResponse()
  async register(@Body() createUserRequestDto: CreateUserRequestDto): Promise<void> {
    return this.authService.register(createUserRequestDto);
  }
}
