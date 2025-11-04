import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, Min, IsString } from 'class-validator';

export class FindAllDto {
    @IsNumber()
    @Min(1)
    @IsOptional()
    @ApiProperty({
        example: 1,
        required: false,
        description: 'Current page (starting from 1)',
    })
    page?: number;

    @IsNumber()
    @Min(1)
    @IsOptional()
    @ApiProperty({
        example: 10,
        required: false,
        description: 'Number of records per page',
    })
    pageSize?: number;

    @IsString()
    @IsOptional()
    @ApiProperty({
        example: 'User',
        required: false,
        description: 'Search keywords (applies to name, description)',
    })
    keyword?: string;
}
