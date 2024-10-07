import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class AuthRegisterDto {



    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email:string

    @MinLength(3)
    @MaxLength(8)
    password:string

    @IsNotEmpty()
    @IsString()
    name: string; 

  

    @IsString()
    @IsOptional()
    profilePicture?:string


}