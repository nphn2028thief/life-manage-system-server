import { TransactionType } from '@prisma/client';

export class CreateTransactionDto {
  date: Date;
  amount: number;
  type: TransactionType;
  description: string;
}
