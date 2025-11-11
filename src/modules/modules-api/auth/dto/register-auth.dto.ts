import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Max, Min } from "class-validator";

export class RegisterDto {
    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: 'Nguyễn Văn A' })
    fullName: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    @ApiProperty({ example: 'example@gmail.com' })
    email: string;

    @IsOptional()
    @Max(10)
    @ApiPropertyOptional({ example: '0909123456' })
    phoneNumber?: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: '1234' })
    password: string;
}