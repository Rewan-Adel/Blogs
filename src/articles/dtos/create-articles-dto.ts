import { IsBoolean, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class CreateArticleDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(100)
    title: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    @MaxLength(500)
    content: string;

    @IsOptional()
    @IsBoolean()
    isPublished: boolean;
}