import { Request } from 'express';
import { Workouts } from '@prisma/client';
import { CreateWorkoutDto } from './dto';
import { WorkoutsService } from './workouts.service';
import { IResponse, IUniqueId } from 'src/common/types/response';
export declare class WorkoutsController {
    private workoutService;
    constructor(workoutService: WorkoutsService);
    getWorkouts(req: Request): Promise<Omit<Workouts, 'userId'>[]>;
    getWorkoutById(req: Request): Promise<Omit<Workouts, 'userId'>>;
    createWorkout(req: Request, createWorkoutDto: CreateWorkoutDto): Promise<IResponse & {
        workout: Workouts;
    }>;
    deleteWorkoutById(req: Request): Promise<IResponse & IUniqueId>;
}
