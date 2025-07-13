import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Length, MinLength } from "class-validator";

export class UpdateArticleDto {
    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    title: string;

    @IsOptional()
    @IsString()
    @IsNotEmpty()
    @Length(10, 500)
    content: string;

    @IsOptional()
    @IsBoolean()
    isPublished: boolean;
}