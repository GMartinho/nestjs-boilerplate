import { ApiProperty } from "@nestjs/swagger";
import { UserAccount, UserProvider, UserSetting } from "@prisma/client";

export class UserEntity implements UserAccount {
    @ApiProperty()
    id: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty()
    role: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    password: string;

    @ApiProperty()
    status: string;

    @ApiProperty()
    phone: string;

    @ApiProperty()
    avatarPath: string;

    providers?: UserProvider[];

    setting?: UserSetting;

    constructor(partial: Partial<UserEntity>) {
        Object.assign(this, partial);
    }
}