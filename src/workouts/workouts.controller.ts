import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Workouts } from '@prisma/client';

import { AuthGuard } from '../auth/auth.guard';
import { CreateWorkoutDto } from './dto';
import { WorkoutsService } from './workouts.service';
import { IResponse, IUniqueId } from '../common/types/response';

@Controller('workouts')
export class WorkoutsController {
  constructor(private workoutService: WorkoutsService) {}

  @UseGuards(AuthGuard)
  @Get()
  getWorkouts(@Req() req: Request): Promise<Omit<Workouts, 'userId'>[]> {
    return this.workoutService.getWorkoutsAsync(req);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  getWorkoutById(@Req() req: Request): Promise<Omit<Workouts, 'userId'>> {
    return this.workoutService.getWorkoutByIdAsync(req);
  }

  @UseGuards(AuthGuard)
  @Post()
  createWorkout(
    @Req() req: Request,
    @Body() createWorkoutDto: CreateWorkoutDto,
  ): Promise<IResponse & { workout: Workouts }> {
    return this.workoutService.createWorkoutAsync(req, createWorkoutDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteWorkoutById(@Req() req: Request): Promise<IResponse & IUniqueId> {
    return this.workoutService.deleteWorkoutByIdAsync(req);
  }
}
