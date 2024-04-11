import { Injectable } from '@nestjs/common';
import { CreateUserRequestDto } from './dto/create-user-request.dto';
import { UpdateUserRequestDto } from './dto/update-user-request.dto';
import { File } from 'buffer';
import * as bcrypt from 'bcrypt';
import { UserNotFoundException } from './exception/user-not-found.exception';
import { UserEntity } from './entity/user.entity';
import { UserProviderOptions } from 'src/app.shared';
import { FileStorageService } from 'src/file-storage/file-storage.service';
import { Environment } from 'src/env/environment';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly fileStorage: FileStorageService,
    private readonly env: Environment,
  ) {}

  async create(createUserDto: CreateUserRequestDto): Promise<UserEntity> {
    const { password } = createUserDto;

    const salt = await bcrypt.genSalt();

    const hashPassword = await bcrypt.hash(password, salt);

    return this.userRepository.create({
      ...createUserDto,
      password: hashPassword,
    });
  }

  findMany() {
    return `This action returns all user`;
  }

  async findById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new UserNotFoundException();
    }

    return user;
  }

  async findByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findByEmail(email);

    return user;
  }

  async findByProvider(provider: UserProviderOptions, providerKey: string): Promise<UserEntity> {
    const user = await this.userRepository.findByProvider(provider, providerKey);

    return user;
  }

  async upsert(user: Partial<UserEntity>) {
    return this.userRepository.upsert(user);
  }

  async update(id: string, updateUserDto: UpdateUserRequestDto) {
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }

  async createAvatar(image: File, userId: string) {
    const [filePath] = await this.fileStorage.create(image, userId, this.env.bucket.name);

    return this.userRepository.update(userId, {
      avatarPath: filePath,
    });
  }
}
