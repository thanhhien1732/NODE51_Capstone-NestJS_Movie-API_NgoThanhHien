import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CallbackPaymentDto {
    @ApiProperty({ example: 12 })
    @IsInt()
    @IsNotEmpty()
    bookingId: number;

    @ApiProperty({ example: 'PAY_20251108_ABC123' })
    @IsString()
    @IsNotEmpty()
    transactionId: string;

    @ApiProperty({ example: 0, description: '0 = success, others = failed' })
    @IsInt()
    @IsNotEmpty()
    resultCode: number;
}
