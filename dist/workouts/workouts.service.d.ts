import { Request } from 'express';
import { Workouts } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWorkoutDto } from './dto';
import { IResponse, IUniqueId } from 'src/common/types/response';
export declare class WorkoutsService {
    private prismaService;
    constructor(prismaService: PrismaService);
    getWorkoutsAsync(req: Request): Promise<Omit<Workouts, 'userId'>[]>;
    getWorkoutByIdAsync(req: Request): Promise<Omit<Workouts, 'userId'>>;
    createWorkoutAsync(req: Request, createWorkoutDto: CreateWorkoutDto): Promise<IResponse & {
        workout: Workouts;
    }>;
    deleteWorkoutByIdAsync(req: Request): Promise<IResponse & IUniqueId>;
}
