import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { Exercises, Workouts } from '@prisma/client';

import { AuthGuard } from '../auth/auth.guard';
import { CreateWorkoutDto, UpdateWorkoutDto } from './dto';
import { WorkoutsService } from './workouts.service';
import { IResponse, IUniqueId } from '../common/types/response';

@UseGuards(AuthGuard)
@Controller('workouts')
export class WorkoutsController {
  constructor(private workoutService: WorkoutsService) {}

  @Get()
  getWorkouts(@Req() req: Request): Promise<Omit<Workouts, 'userId'>[]> {
    return this.workoutService.getWorkoutsAsync(req);
  }

  @Get(':id')
  getWorkoutById(
    @Param('id') id: string,
  ): Promise<
    Omit<Workouts, 'userId'> & { exercises: Omit<Exercises, 'userId'>[] }
  > {
    return this.workoutService.getWorkoutByIdAsync(id);
  }

  @Post()
  createWorkout(
    @Req() req: Request,
    @Body() createWorkoutDto: CreateWorkoutDto,
  ): Promise<
    IResponse & {
      workout: Omit<Workouts, 'userId'> & {
        exercises: Omit<Exercises, 'userId'>[];
      };
    }
  > {
    return this.workoutService.createWorkoutAsync(req, createWorkoutDto);
  }

  @Patch(':id')
  updateWorkout(
    @Param('id') id: string,
    @Body() updateWorkoutDto: UpdateWorkoutDto,
  ): Promise<
    IResponse & {
      workout: Omit<Workouts, 'userId'> & {
        exercises: Omit<Exercises, 'userId'>[];
      };
    }
  > {
    return this.workoutService.updateWorkoutByIdAsync(id, updateWorkoutDto);
  }

  @Delete(':id')
  deleteWorkoutById(@Param('id') id: string): Promise<IResponse & IUniqueId> {
    return this.workoutService.deleteWorkoutByIdAsync(id);
  }
}
