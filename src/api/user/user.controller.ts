import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, ClassSerializerInterceptor, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import { ApiConsumes, ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './entity/user.entity';
import { File } from 'buffer';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from './decorator/user.decorator';
import { CreateUserResponseDto } from './dto/create-user-response.dto';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@ApiTags('Users')
@Controller('v1/users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiCreatedResponse({ type: CreateUserResponseDto })
  async create(@Body() createUserDto: CreateUserRequestDto): Promise<CreateUserResponseDto> {
    const createdUser = await this.userService.create(createUserDto);
    return new CreateUserResponseDto(createdUser);
  }

  @Get()
  findMany() {
    return this.userService.findMany();
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<UserEntity> {
    return this.userService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserRequestDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Post(':id/avatar')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  createAvatar(@UploadedFile() image: File, @User('id') userId: string) {
    return this.userService.createAvatar(image, userId);
  }
}
