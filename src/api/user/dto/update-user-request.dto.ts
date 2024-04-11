import { PartialType } from '@nestjs/mapped-types';
import { CreateUserRequestDto } from './create-user-request.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserRequestDto extends PartialType(CreateUserRequestDto) {
  @ApiProperty()
  role?: string;

  @ApiProperty()
  status?: string;

  @ApiProperty()
  avatarPath?: string;
}
