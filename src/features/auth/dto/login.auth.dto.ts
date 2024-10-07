import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class AuthLoginDto {



    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email:string
    
    @MinLength(3)
    @MaxLength(8)
    password:string


}