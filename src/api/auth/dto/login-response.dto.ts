import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty()
  accessToken: string;

  constructor(accessToken: Partial<string>) {
    this.accessToken = accessToken;
  }
}