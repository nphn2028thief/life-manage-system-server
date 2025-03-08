import { Request } from 'express';
import { Transactions } from '@prisma/client';
import { CreateTransactionDto, TransactionSummaryDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { IResponse, IUniqueId } from 'src/common/types/response';
export declare class TransactionsService {
    private prismaService;
    constructor(prismaService: PrismaService);
    getMonthlySummaryAsync(req: Request): Promise<TransactionSummaryDto[]>;
    getTransactionsAsync(req: Request): Promise<Omit<Transactions, 'userId'>[]>;
    getTransactionByIdAsync(id: string): Promise<Omit<Transactions, 'userId'>>;
    createTransactionAsync(req: Request, createTransactionDto: CreateTransactionDto): Promise<IResponse & {
        transaction: Omit<Transactions, 'userId'>;
    }>;
    deleteTransactionAsync(id: string): Promise<IResponse & IUniqueId>;
}
