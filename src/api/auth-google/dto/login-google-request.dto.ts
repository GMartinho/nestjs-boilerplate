import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class LoginGoogleRequestDto {
    @ApiProperty()
    @IsNotEmpty()
    idToken: string;
}
