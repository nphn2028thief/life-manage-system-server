import { TransactionType } from '@prisma/client';
export declare class CreateTransactionDto {
    date: Date;
    amount: number;
    type: TransactionType;
    description: string;
}
