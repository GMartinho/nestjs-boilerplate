import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, Length } from "class-validator";

export class CreateUserRequestDto {
    @IsNotEmpty()
    @Length(2, 255)
    @ApiProperty()
    firstName: string;

    @IsNotEmpty()
    @Length(2, 255)
    @ApiProperty()
    lastName: string;

    @IsNotEmpty()
    @Length(7, 320)
    @IsEmail()
    @ApiProperty()
    email: string;

    @IsNotEmpty()
    @Length(8, 255)
    @ApiProperty()
    password: string;

    @IsOptional()
    @IsPhoneNumber()
    @Length(7, 255)
    @ApiProperty()
    phone?: string;
}