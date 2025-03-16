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
import { Exercises } from '@prisma/client';

import { AuthGuard } from '../auth/auth.guard';
import { CreateExerciseDto, UpdateExerciseDto } from './dto';
import { ExercisesService } from './exercises.service';
import { IResponse, IUniqueId } from '../common/types/response';

@Controller('exercises')
export class ExercisesController {
  constructor(private exerciseService: ExercisesService) {}

  @Get()
  getExercises(): Promise<Exercises[]> {
    return this.exerciseService.getExercisesAsync();
  }

  @Get(':id')
  getExerciseById(@Param('id') id: string): Promise<Exercises> {
    return this.exerciseService.getExerciseByIdAsync(id);
  }

  @Post('/system')
  createExerciseBySystem(
    @Req() req: Request,
    @Body() createExerciseDto: CreateExerciseDto,
  ): Promise<IResponse & { exercise: Exercises }> {
    return this.exerciseService.createExerciseAsync(req, createExerciseDto);
  }

  @UseGuards(AuthGuard)
  @Post()
  createExerciseByUser(
    @Req() req: Request,
    @Body() createExerciseDto: CreateExerciseDto,
  ): Promise<IResponse & { exercise: Exercises }> {
    return this.exerciseService.createExerciseAsync(req, createExerciseDto);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  updateExerciseById(
    @Req() req: Request,
    @Body() updateExerciseDto: UpdateExerciseDto,
  ): Promise<IResponse & { exercise: Exercises }> {
    return this.exerciseService.updateExerciseByIdAsync(req, updateExerciseDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteExerciseById(@Req() req: Request): Promise<IResponse & IUniqueId> {
    return this.exerciseService.deleteExerciseByIdAsync(req);
  }
}
