import { IsEmail, IsString, Length, IsNotEmpty, IsOptional } from "class-validator";
import { Transform } from 'class-transformer';

export class CreateUserDTO {

    @IsNotEmpty()
    @IsString()
    @Length(5, 100)
    username: string;
    
    
    @IsNotEmpty()
    @IsEmail()
    @Transform(({ value }) => value.toLowerCase())
    email: string;
    
    @IsNotEmpty()
    @IsString()
    @Length(6, 100)
    password: string;

    @IsString()
    @IsOptional()
    image: string;
}