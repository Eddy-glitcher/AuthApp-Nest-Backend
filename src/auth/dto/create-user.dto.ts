import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto {

    // Estos son los datos que espera se esperan del usuario.

    @IsEmail()
    email    : string;

    @IsString()
    name     ?: string;

    @IsString()
    @MinLength(6)
    password : string;

}
