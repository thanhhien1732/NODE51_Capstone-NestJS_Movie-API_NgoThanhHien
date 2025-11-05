import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, Min, IsString, IsEmail, IsInt } from 'class-validator';

export class FindAllUserDto {
    @IsInt()
    @Min(1)
    @IsOptional()
    @ApiPropertyOptional({
        example: 1,
        description: 'Current page (starting from 1)',
    })
    page?: number;

    @IsInt()
    @Min(1)
    @IsOptional()
    @ApiPropertyOptional({
        example: 10,
        description: 'Number of records per page',
    })
    pageSize?: number;

    @IsString()
    @IsOptional()
    @ApiPropertyOptional({
        example: 'Nguyễn',
        description: 'Search keywords to fullName',
    })
    keyword?: string;

    @ApiPropertyOptional({
        example: 'example@gmail.com',
        description: 'Search keywords to email',
    })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({
        example: '0958746312',
        description: 'Search keywords to phoneNumer',
    })
    @IsOptional()
    @IsString()
    phoneNumber?: string;
}
