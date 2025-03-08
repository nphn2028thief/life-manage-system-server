import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Excercises, ExcercisesAddedBy } from '@prisma/client';
import { Request } from 'express';

import { CreateExerciseDto, UpdateExerciseDto } from './dto/exercise.dto';
import { PrismaService } from '../prisma/prisma.service';
import { MessageType } from '../common/constants/response';
import { IResponse, IUniqueId } from '../common/types/response';

@Injectable()
export class ExercisesService {
  constructor(private prismaService: PrismaService) {}

  async getExercisesAsync(): Promise<Excercises[]> {
    return await this.prismaService.excercises.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getExerciseByIdAsync(id: string): Promise<Excercises> {
    const exercise = await this.prismaService.excercises.findUnique({
      where: {
        id,
      },
    });

    if (!exercise) {
      throw new NotFoundException('Cannot found exercise');
    }

    return exercise;
  }

  async createExerciseAsync(
    req: Request,
    createExerciseDto: CreateExerciseDto,
  ): Promise<IResponse & { exercise: Excercises }> {
    const user = req.user;

    try {
      const newExercise = await this.prismaService.excercises.create({
        data: {
          ...createExerciseDto,
          addedBy: user ? ExcercisesAddedBy.USER : ExcercisesAddedBy.SYSTEM,
          userId: user && 'id' in user ? (user as IUniqueId).id : null,
        },
      });
      return {
        messageType: MessageType.SUCCESS,
        message: 'Created exercise successfully',
        exercise: newExercise,
      };
    } catch (error) {
      // Duplicate value
      if (error.code === 'P2002') {
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
  ): Promise<IResponse & { exercise: Excercises }> {
    const { id } = req.params;
    const { id: userId } = req.user as IUniqueId;

    try {
      const exercise = await this.prismaService.excercises.findUnique({
        where: {
          id,
        },
      });

      if (!exercise) {
        throw new NotFoundException('Cannot found exercise');
      }

      if (
        exercise.addedBy !== ExcercisesAddedBy.USER ||
        exercise.userId !== userId
      ) {
        throw new UnauthorizedException(
          'You are not allowed to adjust this exercise',
        );
      }

      const updatedExercise = await this.prismaService.excercises.update({
        where: {
          id,
        },
        data: {
          ...updateExerciseDto,
          addedBy: 'USER',
        },
      });

      return {
        messageType: MessageType.SUCCESS,
        message: 'Updated exercise successfully',
        exercise: updatedExercise,
      };
    } catch (error) {
      // Duplicate value
      if (error.code === 'P2002') {
        throw new ConflictException(`Exercise ${name} has existed`);
      }
      throw error;
    }
  }

  async deleteExerciseByIdAsync(req: Request): Promise<IResponse & IUniqueId> {
    const { id } = req.params;
    const { id: userId } = req.user as IUniqueId;

    const exercise = await this.prismaService.excercises.findUnique({
      where: {
        id,
      },
    });

    if (!exercise) {
      throw new NotFoundException('Cannot found exercise');
    }

    if (
      exercise.addedBy !== ExcercisesAddedBy.USER ||
      exercise.userId !== userId
    ) {
      throw new UnauthorizedException(
        'You are not allowed to delete this exercise',
      );
    }

    await this.prismaService.excercises.delete({
      where: {
        id,
      },
    });

    return {
      messageType: MessageType.SUCCESS,
      message: 'Deleted exercise successfully',
      id,
    };
  }
}
