import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class LoginDto {
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ example: 'example@gmail.com' })
    email: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: '1234' })
    password: string;
}