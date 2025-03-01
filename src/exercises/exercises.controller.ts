import {
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
import { Excercises } from '@prisma/client';

import { AuthGuard } from 'src/auth/auth.guard';
import { CreateExerciseDto, UpdateExerciseDto } from './dto/exercise.dto';
import { ExercisesService } from './exercises.service';
import { IResponse } from 'src/common/types/response';

@Controller('exercises')
export class ExercisesController {
  constructor(private exerciseService: ExercisesService) {}

  @Get()
  getExercises(): Promise<Excercises[]> {
    return this.exerciseService.getExercisesAsync();
  }

  @Get(':id')
  getExerciseById(@Param('id') id: string): Promise<Excercises> {
    return this.exerciseService.getExerciseByIdAsync(id);
  }

  @Post('/system')
  createExerciseBySystem(
    @Req() req: Request,
    createExerciseDto: CreateExerciseDto,
  ): Promise<IResponse & { exercise: Excercises }> {
    return this.exerciseService.createExerciseAsync(req, createExerciseDto);
  }

  @UseGuards(AuthGuard)
  @Post()
  createExerciseByUser(
    @Req() req: Request,
    createExerciseDto: CreateExerciseDto,
  ): Promise<IResponse & { exercise: Excercises }> {
    return this.exerciseService.createExerciseAsync(req, createExerciseDto);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  updateExerciseById(
    @Req() req: Request,
    updateExerciseDto: UpdateExerciseDto,
  ): Promise<IResponse> {
    return this.exerciseService.updateExerciseByIdAsync(req, updateExerciseDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteExerciseById(@Req() req: Request): Promise<IResponse> {
    return this.exerciseService.deleteExerciseByIdAsync(req);
  }
}
