import { PartialType } from "@nestjs/mapped-types";
import { CreateUserResponseDto } from "src/api/user/dto/create-user-response.dto";

export class LoginGoogleResponseDto extends PartialType(CreateUserResponseDto){}
