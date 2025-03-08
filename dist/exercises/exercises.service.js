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
exports.ExercisesService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const response_1 = require("../common/constants/response");
let ExercisesService = class ExercisesService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async getExercisesAsync() {
        return await this.prismaService.excercises.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async getExerciseByIdAsync(id) {
        const exercise = await this.prismaService.excercises.findUnique({
            where: {
                id,
            },
        });
        if (!exercise) {
            throw new common_1.NotFoundException('Cannot found exercise');
        }
        return exercise;
    }
    async createExerciseAsync(req, createExerciseDto) {
        const user = req.user;
        try {
            const newExercise = await this.prismaService.excercises.create({
                data: {
                    ...createExerciseDto,
                    addedBy: user ? client_1.ExcercisesAddedBy.USER : client_1.ExcercisesAddedBy.SYSTEM,
                    userId: user && 'id' in user ? user.id : null,
                },
            });
            return {
                messageType: response_1.MessageType.SUCCESS,
                message: 'Created exercise successfully',
                exercise: newExercise,
            };
        }
        catch (error) {
            if (error.code === 'P2002') {
                throw new common_1.ConflictException(`Exercise '${createExerciseDto.name}' has existed`);
            }
            throw error;
        }
    }
    async updateExerciseByIdAsync(req, updateExerciseDto) {
        const { id } = req.params;
        const { id: userId } = req.user;
        try {
            const exercise = await this.prismaService.excercises.findUnique({
                where: {
                    id,
                },
            });
            if (!exercise) {
                throw new common_1.NotFoundException('Cannot found exercise');
            }
            if (exercise.addedBy !== client_1.ExcercisesAddedBy.USER ||
                exercise.userId !== userId) {
                throw new common_1.UnauthorizedException('You are not allowed to adjust this exercise');
            }
            const updatedExercise = await this.prismaService.excercises.update({
                where: {
                    id,
                },
                data: {
                    ...updateExerciseDto,
                    addedBy: 'USER',
                },
            });
            return {
                messageType: response_1.MessageType.SUCCESS,
                message: 'Updated exercise successfully',
                exercise: updatedExercise,
            };
        }
        catch (error) {
            if (error.code === 'P2002') {
                throw new common_1.ConflictException(`Exercise ${name} has existed`);
            }
            throw error;
        }
    }
    async deleteExerciseByIdAsync(req) {
        const { id } = req.params;
        const { id: userId } = req.user;
        const exercise = await this.prismaService.excercises.findUnique({
            where: {
                id,
            },
        });
        if (!exercise) {
            throw new common_1.NotFoundException('Cannot found exercise');
        }
        if (exercise.addedBy !== client_1.ExcercisesAddedBy.USER ||
            exercise.userId !== userId) {
            throw new common_1.UnauthorizedException('You are not allowed to delete this exercise');
        }
        await this.prismaService.excercises.delete({
            where: {
                id,
            },
        });
        return {
            messageType: response_1.MessageType.SUCCESS,
            message: 'Deleted exercise successfully',
            id,
        };
    }
};
exports.ExercisesService = ExercisesService;
exports.ExercisesService = ExercisesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExercisesService);
//# sourceMappingURL=exercises.service.js.map