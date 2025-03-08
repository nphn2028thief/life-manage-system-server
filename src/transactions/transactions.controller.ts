import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Transactions } from '@prisma/client';

import { AuthGuard } from 'src/auth/auth.guard';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto, TransactionSummaryDto } from './dto';
import { IResponse, IUniqueId } from 'src/common/types/response';

@Controller('transactions')
@UseGuards(AuthGuard)
export class TransactionsController {
  constructor(private transactionService: TransactionsService) {}

  @Get('/summary')
  getMonthlySummary(@Req() req: Request): Promise<TransactionSummaryDto[]> {
    return this.transactionService.getMonthlySummaryAsync(req);
  }

  @Get()
  getTransactions(
    @Req() req: Request,
  ): Promise<Omit<Transactions, 'userId'>[]> {
    return this.transactionService.getTransactionsAsync(req);
  }

  @Get(':id')
  getTransactionById(
    @Param('id') id: string,
  ): Promise<Omit<Transactions, 'userId'>> {
    return this.transactionService.getTransactionByIdAsync(id);
  }

  @Post()
  createTransactionAsync(
    @Req() req: Request,
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<IResponse & { transaction: Omit<Transactions, 'userId'> }> {
    return this.transactionService.createTransactionAsync(
      req,
      createTransactionDto,
    );
  }

  @Delete(':id')
  deleteTransaction(@Param('id') id: string): Promise<IResponse & IUniqueId> {
    return this.transactionService.deleteTransactionAsync(id);
  }
}
