import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Excercises, ExcercisesAddedBy } from '@prisma/client';
import { Request } from 'express';

import { CreateExerciseDto, UpdateExerciseDto } from './dto/exercise.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageType } from 'src/common/constants/response';
import { IResponse } from 'src/common/types/response';

@Injectable()
export class ExercisesService {
  constructor(private prismaService: PrismaService) {}

  async getExercisesAsync(): Promise<Excercises[]> {
    return await this.prismaService.excercises.findMany();
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
          addedBy: user ? 'USER' : 'SYSTEM',
          userId: user ? (user as { id: string }).id : null,
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
        throw new ConflictException(`Exercise ${name} has existed`);
      }
      throw error;
    }
  }

  async updateExerciseByIdAsync(
    req: Request,
    updateExerciseDto: UpdateExerciseDto,
  ): Promise<IResponse> {
    const { id } = req.params;
    const { id: userId } = req.user as { id: string };

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

      await this.prismaService.excercises.update({
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
      };
    } catch (error) {
      // Duplicate value
      if (error.code === 'P2002') {
        throw new ConflictException(`Exercise ${name} has existed`);
      }
      throw error;
    }
  }

  async deleteExerciseByIdAsync(req: Request): Promise<IResponse> {
    const { id } = req.params;
    const { id: userId } = req.user as { id: string };

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
    };
  }
}
