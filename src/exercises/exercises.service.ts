import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Exercises, AddedBy } from '@prisma/client';
import { Request } from 'express';

import { CreateExerciseDto, UpdateExerciseDto } from './dto';
import { WinstonLoggerService } from 'src/winston/winston.service';
import { PrismaService } from '../prisma/prisma.service';
import { MessageType } from '../common/constants/response';
import { IResponse, IUniqueId } from '../common/types/response';

@Injectable()
export class ExercisesService {
  constructor(
    private loggerService: WinstonLoggerService,
    private prismaService: PrismaService,
  ) {}

  async getExercisesAsync(): Promise<Exercises[]> {
    this.loggerService.log(`Fetching all exercises...`);

    return await this.prismaService.exercises.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getExerciseByIdAsync(id: string): Promise<Exercises> {
    this.loggerService.log(`Fetching exercise: ${id} ...`);

    const exercise = await this.prismaService.exercises.findUnique({
      where: {
        id,
      },
    });

    this.loggerService.debug(`Fetched exercise: ${id}`);

    if (!exercise) {
      this.loggerService.error(`Cannot find this exercise: ${id}`);
      throw new NotFoundException('Cannot find this exercise');
    }

    return exercise;
  }

  async createExerciseAsync(
    req: Request,
    createExerciseDto: CreateExerciseDto,
  ): Promise<IResponse & { exercise: Exercises }> {
    const user = req.user;

    try {
      this.loggerService.log('Creating a new exercise...');

      const newExercise = await this.prismaService.exercises.create({
        data: {
          ...createExerciseDto,
          addedBy: user ? AddedBy.USER : AddedBy.SYSTEM,
          userId: user && 'id' in user ? (user as IUniqueId).id : null,
        },
      });

      this.loggerService.debug('Created a new exercise successfully!');

      return {
        messageType: MessageType.SUCCESS,
        message: 'Created exercise successfully',
        exercise: newExercise,
      };
    } catch (error) {
      // Duplicate value
      if (error.code === 'P2002') {
        this.loggerService.error(
          `Exercise '${createExerciseDto.name}' has existed`,
        );
        throw new ConflictException(
          `Exercise '${createExerciseDto.name}' has existed`,
        );
      }
      throw error;
    }
  }

  async updateExerciseByIdAsync(
    req: Request,
    updateExerciseDto: UpdateExerciseDto,
  ): Promise<IResponse & { exercise: Exercises }> {
    const { id } = req.params;
    const { id: userId } = req.user as IUniqueId;

    try {
      this.loggerService.log(`Fetching exercise: ${id} ...`);

      const exercise = await this.prismaService.exercises.findUnique({
        where: {
          id,
        },
      });

      this.loggerService.debug(`Fetched exercise: ${id}`);

      if (!exercise) {
        this.loggerService.error(`Cannot find this exercise: ${id}`);
        throw new NotFoundException('Cannot find this exercise');
      }

      if (exercise.addedBy !== AddedBy.USER || exercise.userId !== userId) {
        this.loggerService.error(
          `You are not allowed to adjust this exercise: ${id}`,
        );
        throw new UnauthorizedException(
          'You are not allowed to adjust this exercise',
        );
      }

      this.loggerService.log(
        `Updating exercise ${id}: ${exercise.name}, new name: ${updateExerciseDto.name} ...`,
      );

      const updatedExercise = await this.prismaService.exercises.update({
        where: {
          id,
        },
        data: {
          ...updateExerciseDto,
          addedBy: 'USER',
        },
      });

      this.loggerService.debug(
        `Updated exercise ${id}, new name: ${updatedExercise.name}`,
      );

      return {
        messageType: MessageType.SUCCESS,
        message: 'Updated exercise successfully',
        exercise: updatedExercise,
      };
    } catch (error) {
      // Duplicate value
      if (error.code === 'P2002') {
        this.loggerService.error(
          `Exercise ${id}: ${updateExerciseDto.name} has existed`,
        );
        throw new ConflictException(
          `Exercise ${updateExerciseDto.name} has existed`,
        );
      }
      throw error;
    }
  }

  async deleteExerciseByIdAsync(req: Request): Promise<IResponse & IUniqueId> {
    const { id } = req.params;
    const { id: userId } = req.user as IUniqueId;

    this.loggerService.log(`Fetching exercise: ${id} ...`);

    const exercise = await this.prismaService.exercises.findUnique({
      where: {
        id,
      },
    });

    this.loggerService.debug(`Fetched exercise: ${id}`);

    if (!exercise) {
      this.loggerService.error(`Cannot find this exercise: ${id}`);
      throw new NotFoundException('Cannot find this exercise');
    }

    if (exercise.addedBy !== AddedBy.USER || exercise.userId !== userId) {
      this.loggerService.error(
        `You are not allowed to delete this exercise: ${id}`,
      );
      throw new UnauthorizedException(
        'You are not allowed to delete this exercise',
      );
    }

    this.loggerService.log(`Deleting exercise ${id}: ${exercise.name} ...`);

    await this.prismaService.exercises.delete({
      where: {
        id,
      },
    });

    this.loggerService.debug(`Deleted exercise ${id}: ${exercise.name}`);

    return {
      messageType: MessageType.SUCCESS,
      message: 'Deleted exercise successfully',
      id,
    };
  }
}
