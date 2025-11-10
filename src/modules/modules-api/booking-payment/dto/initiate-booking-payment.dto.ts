import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';

export enum PaymentMethod {
    ATM_CARD = 'ATM_CARD',
    CREDIT_CARD = 'CREDIT_CARD',
    DEBIT_CARD = 'DEBIT_CARD',
    MOMO = 'MOMO',
    ZALOPAY = 'ZALOPAY',
    VNPAY = 'VNPAY',
    SHOPEEPAY = 'SHOPEEPAY',
    APPLEPAY = 'APPLEPAY',
}

export class InitiatePaymentDto {
    @ApiProperty({ example: 12 })
    @IsInt()
    @IsNotEmpty()
    bookingId: number;

    @ApiProperty({ enum: PaymentMethod, default: PaymentMethod.MOMO })
    @IsEnum(PaymentMethod)
    @IsNotEmpty()
    method: PaymentMethod;
}
