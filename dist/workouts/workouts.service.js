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
exports.WorkoutsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const response_1 = require("../common/constants/response");
let WorkoutsService = class WorkoutsService {
    constructor(prismaService) {
        this.prismaService = prismaService;
    }
    async getWorkoutsAsync(req) {
        const { id } = req.user;
        return await this.prismaService.workouts.findMany({
            where: {
                userId: id,
            },
            include: {
                excercises: {
                    include: {
                        exercise: true,
                    },
                    omit: {
                        workoutId: true,
                        exerciseId: true,
                    },
                },
            },
            omit: {
                userId: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
    async getWorkoutByIdAsync(req) {
        const { id } = req.params;
        const existedWorkout = await this.prismaService.workouts.findUnique({
            where: {
                id,
            },
            include: {
                excercises: {
                    include: {
                        exercise: true,
                    },
                    omit: {
                        workoutId: true,
                        exerciseId: true,
                    },
                },
            },
            omit: {
                userId: true,
            },
        });
        if (!existedWorkout) {
            throw new common_1.NotFoundException('Cannot found workout');
        }
        return existedWorkout;
    }
    async createWorkoutAsync(req, createWorkoutDto) {
        const { id } = req.user;
        const { workout, excercises } = createWorkoutDto;
        const excerciseIds = excercises.map((item) => item.id);
        const newWorkout = await this.prismaService.$transaction(async (prisma) => {
            const exerciseCount = await prisma.excercises.count({
                where: {
                    id: {
                        in: excerciseIds,
                    },
                },
            });
            if (exerciseCount !== excerciseIds.length) {
                throw new common_1.NotFoundException('One or more excercise do not exist');
            }
            return prisma.workouts.create({
                data: {
                    ...workout,
                    userId: id,
                    excercises: {
                        create: excercises.map((item) => ({
                            sets: item.sets,
                            reps: item.reps,
                            weight: item.weight,
                            exercise: {
                                connect: { id: item.id },
                            },
                        })),
                    },
                },
                include: {
                    excercises: true,
                },
            });
        });
        return {
            messageType: response_1.MessageType.SUCCESS,
            message: 'Workout created successfully!',
            workout: newWorkout,
        };
    }
    async deleteWorkoutByIdAsync(req) {
        const { id } = req.params;
        await this.prismaService.$transaction(async (prisma) => {
            const workout = await prisma.workouts.findUnique({
                where: {
                    id,
                },
            });
            if (!workout) {
                throw new common_1.NotFoundException('Cannot find workout');
            }
            await prisma.workouts.delete({
                where: {
                    id,
                },
            });
        });
        return {
            messageType: response_1.MessageType.SUCCESS,
            message: 'Workout deleted successfully!',
            id,
        };
    }
};
exports.WorkoutsService = WorkoutsService;
exports.WorkoutsService = WorkoutsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WorkoutsService);
//# sourceMappingURL=workouts.service.js.map