import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthGoogleService } from './auth-google.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { LoginGoogleResponseDto } from './dto/login-google-response.dto';
import { LoginGoogleRequestDto } from './dto/login-google-request.dto';

@ApiTags('Auth')
@Controller('v1/auth/google')
export class AuthGoogleController {
  constructor(private readonly authGoogleService: AuthGoogleService) {}

  @Post('login')
  @ApiOkResponse({ type: LoginGoogleResponseDto })
  async login(@Body() loginGoogleRequestDto: LoginGoogleRequestDto): Promise<LoginGoogleResponseDto> {
    const providedUser = await this.authGoogleService.login(loginGoogleRequestDto);
    return new LoginGoogleResponseDto(providedUser);
  }
}
