import { Request } from 'express';
import { Transactions } from '@prisma/client';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, TransactionSummaryDto } from './dto';
import { IResponse, IUniqueId } from 'src/common/types/response';
export declare class TransactionsController {
    private transactionService;
    constructor(transactionService: TransactionsService);
    getMonthlySummary(req: Request): Promise<TransactionSummaryDto[]>;
    getTransactions(req: Request): Promise<Omit<Transactions, 'userId'>[]>;
    getTransactionById(id: string): Promise<Omit<Transactions, 'userId'>>;
    createTransactionAsync(req: Request, createTransactionDto: CreateTransactionDto): Promise<IResponse & {
        transaction: Omit<Transactions, 'userId'>;
    }>;
    deleteTransaction(id: string): Promise<IResponse & IUniqueId>;
}
