import { IsEmail, IsString, Length, IsNotEmpty, IsOptional } from "class-validator";
import { Transform } from 'class-transformer';

export class UpdateUserDTO {
    @IsOptional()
    @IsString()
    @Length(5, 100)
    username: string;
    
    @IsOptional()
    @IsNotEmpty()
    @IsEmail()
    @Transform(({ value }) => value.toLowerCase())
    email: string;

    @IsOptional()
    @IsString()
    @IsOptional()
    image: string;
}