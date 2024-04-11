import { UserEntity } from '../entity/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class CreateUserResponseDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  @IsOptional()
  phone?: string;

  @ApiProperty()
  role: string;

  constructor(user: Partial<UserEntity>) {
    this.email = user.email;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.role = user.role;
    user.phone && (this.phone = user.phone);
  }
}
