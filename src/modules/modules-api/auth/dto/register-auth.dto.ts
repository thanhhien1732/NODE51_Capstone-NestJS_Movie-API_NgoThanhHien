import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";

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
    @ApiProperty({ example: '0909123456', required: false })
    phoneNumber?: string;

    @IsString()
    @IsNotEmpty()
    @ApiProperty({ example: '1234' })
    password: string;
}