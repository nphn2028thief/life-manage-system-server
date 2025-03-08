import { Excercises } from '@prisma/client';
import { Request } from 'express';
import { CreateExerciseDto, UpdateExerciseDto } from './dto/exercise.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { IResponse, IUniqueId } from 'src/common/types/response';
export declare class ExercisesService {
    private prismaService;
    constructor(prismaService: PrismaService);
    getExercisesAsync(): Promise<Excercises[]>;
    getExerciseByIdAsync(id: string): Promise<Excercises>;
    createExerciseAsync(req: Request, createExerciseDto: CreateExerciseDto): Promise<IResponse & {
        exercise: Excercises;
    }>;
    updateExerciseByIdAsync(req: Request, updateExerciseDto: UpdateExerciseDto): Promise<IResponse & {
        exercise: Excercises;
    }>;
    deleteExerciseByIdAsync(req: Request): Promise<IResponse & IUniqueId>;
}
