"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const response_1 = require("../common/constants/response");
let TransactionsService = class TransactionsService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async getMonthlySummaryAsync(req) {
        const { id: userId } = req.user;
        const summaryTransactions = await this.prismaService.$queryRaw `
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
    async getTransactionsAsync(req) {
        const { id: userId } = req.user;
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
    async getTransactionByIdAsync(id) {
        const existedTransaction = await this.prismaService.transactions.findUnique({
            where: {
                id,
            },
            omit: {
                userId: true,
            },
        });
        if (!existedTransaction) {
            throw new common_1.NotFoundException('Cannot found transaction');
        }
        return existedTransaction;
    }
    async createTransactionAsync(req, createTransactionDto) {
        const { id: userId } = req.user;
        const newTransaction = await this.prismaService.transactions.create({
            data: {
                ...createTransactionDto,
                userId,
            },
        });
        return {
            messageType: response_1.MessageType.SUCCESS,
            message: 'Created exercise successfully',
            transaction: newTransaction,
        };
    }
    async deleteTransactionAsync(id) {
        const transaction = await this.prismaService.transactions.findUnique({
            where: {
                id,
            },
        });
        if (!transaction) {
            throw new common_1.NotFoundException('Cannot found transaction');
        }
        await this.prismaService.transactions.delete({
            where: {
                id,
            },
        });
        return {
            messageType: response_1.MessageType.SUCCESS,
            message: 'Deleted transaction successfully',
            id,
        };
    }
};
exports.TransactionsService = TransactionsService;
exports.TransactionsService = TransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TransactionsService);
//# sourceMappingURL=transactions.service.js.map