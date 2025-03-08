import { Request } from 'express';
import { Excercises } from '@prisma/client';
import { CreateExerciseDto, UpdateExerciseDto } from './dto/exercise.dto';
import { ExercisesService } from './exercises.service';
import { IResponse, IUniqueId } from 'src/common/types/response';
export declare class ExercisesController {
    private exerciseService;
    constructor(exerciseService: ExercisesService);
    getExercises(): Promise<Excercises[]>;
    getExerciseById(id: string): Promise<Excercises>;
    createExerciseBySystem(req: Request, createExerciseDto: CreateExerciseDto): Promise<IResponse & {
        exercise: Excercises;
    }>;
    createExerciseByUser(req: Request, createExerciseDto: CreateExerciseDto): Promise<IResponse & {
        exercise: Excercises;
    }>;
    updateExerciseById(req: Request, updateExerciseDto: UpdateExerciseDto): Promise<IResponse & {
        exercise: Excercises;
    }>;
    deleteExerciseById(req: Request): Promise<IResponse & IUniqueId>;
}
