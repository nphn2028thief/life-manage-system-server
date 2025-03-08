import { Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { Transactions } from '@prisma/client';

import { CreateTransactionDto, TransactionSummaryDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { MessageType } from '../common/constants/response';
import { IResponse, IUniqueId } from '../common/types/response';

@Injectable()
export class TransactionsService {
  constructor(private prismaService: PrismaService) {}

  async getMonthlySummaryAsync(req: Request): Promise<TransactionSummaryDto[]> {
    const { id: userId } = req.user as IUniqueId;

    const summaryTransactions = await this.prismaService.$queryRaw<
      TransactionSummaryDto[]
    >`
        SELECT
            TO_CHAR(date, 'YYYY-MM') AS month,
            SUM(CASE WHEN type = 'INCOME' THEN amount ELSE 0 END) AS income,
            SUM(CASE WHEN type = 'EXPENSE' THEN amount ELSE 0 END) AS expense,
            SUM(CASE WHEN type = 'SAVINGS' THEN amount ELSE 0 END) AS savings
        FROM
            "Transactions"
        WHERE
            "userId" = ${userId}
        GROUP BY
            TO_CHAR(date, 'YYYY-MM')
        ORDER BY
            TO_CHAR(date, 'YYYY-MM');
      `;

    return summaryTransactions.map((item) => ({
      month: item.month,
      income: Number(item.income),
      expense: Number(item.expense),
      savings: Number(item.savings),
    }));
  }

  async getTransactionsAsync(
    req: Request,
  ): Promise<Omit<Transactions, 'userId'>[]> {
    const { id: userId } = req.user as IUniqueId;
    return await this.prismaService.transactions.findMany({
      where: {
        userId,
      },
      omit: {
        userId: true,
      },
      orderBy: {
        date: 'desc',
      },
    });
  }

  async getTransactionByIdAsync(
    id: string,
  ): Promise<Omit<Transactions, 'userId'>> {
    const existedTransaction = await this.prismaService.transactions.findUnique(
      {
        where: {
          id,
        },
        omit: {
          userId: true,
        },
      },
    );

    if (!existedTransaction) {
      throw new NotFoundException('Cannot found transaction');
    }

    return existedTransaction;
  }

  async createTransactionAsync(
    req: Request,
    createTransactionDto: CreateTransactionDto,
  ): Promise<IResponse & { transaction: Omit<Transactions, 'userId'> }> {
    const { id: userId } = req.user as IUniqueId;
    const newTransaction = await this.prismaService.transactions.create({
      data: {
        ...createTransactionDto,
        userId,
      },
    });

    return {
      messageType: MessageType.SUCCESS,
      message: 'Created exercise successfully',
      transaction: newTransaction,
    };
  }

  async deleteTransactionAsync(id: string): Promise<IResponse & IUniqueId> {
    const transaction = await this.prismaService.transactions.findUnique({
      where: {
        id,
      },
    });

    if (!transaction) {
      throw new NotFoundException('Cannot found transaction');
    }

    await this.prismaService.transactions.delete({
      where: {
        id,
      },
    });

    return {
      messageType: MessageType.SUCCESS,
      message: 'Deleted transaction successfully',
      id,
    };
  }
}
