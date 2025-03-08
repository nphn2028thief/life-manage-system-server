import { Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { Workouts } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkoutDto } from './dto';
import { MessageType } from '../common/constants/response';
import { IResponse, IUniqueId } from '../common/types/response';

@Injectable()
export class WorkoutsService {
  constructor(private prismaService: PrismaService) {}

  async getWorkoutsAsync(req: Request): Promise<Omit<Workouts, 'userId'>[]> {
    const { id } = req.user as IUniqueId;
    return await this.prismaService.workouts.findMany({
      where: {
        userId: id,
      },
      include: {
        excercises: {
          include: {
            exercise: true,
          },
          omit: {
            workoutId: true,
            exerciseId: true,
          },
        },
      },
      omit: {
        userId: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getWorkoutByIdAsync(req: Request): Promise<Omit<Workouts, 'userId'>> {
    const { id } = req.params;
    const existedWorkout = await this.prismaService.workouts.findUnique({
      where: {
        id,
      },
      include: {
        excercises: {
          include: {
            exercise: true,
          },
          omit: {
            workoutId: true,
            exerciseId: true,
          },
        },
      },
      omit: {
        userId: true,
      },
    });

    if (!existedWorkout) {
      throw new NotFoundException('Cannot found workout');
    }
    return existedWorkout;
  }

  async createWorkoutAsync(
    req: Request,
    createWorkoutDto: CreateWorkoutDto,
  ): Promise<IResponse & { workout: Workouts }> {
    const { id } = req.user as IUniqueId;
    const { workout, excercises } = createWorkoutDto;
    const excerciseIds = excercises.map((item) => item.id);

    const newWorkout = await this.prismaService.$transaction(async (prisma) => {
      const exerciseCount = await prisma.excercises.count({
        where: {
          id: {
            in: excerciseIds,
          },
        },
      });

      if (exerciseCount !== excerciseIds.length) {
        throw new NotFoundException('One or more excercise do not exist');
      }

      return prisma.workouts.create({
        data: {
          ...workout,
          userId: id,
          excercises: {
            create: excercises.map((item) => ({
              sets: item.sets,
              reps: item.reps,
              weight: item.weight,
              exercise: {
                connect: { id: item.id },
              },
            })),
          },
        },
        include: {
          excercises: true,
        },
      });
    });

    return {
      messageType: MessageType.SUCCESS,
      message: 'Workout created successfully!',
      workout: newWorkout,
    };
  }

  async deleteWorkoutByIdAsync(req: Request): Promise<IResponse & IUniqueId> {
    const { id } = req.params;
    await this.prismaService.$transaction(async (prisma) => {
      const workout = await prisma.workouts.findUnique({
        where: {
          id,
        },
      });

      if (!workout) {
        throw new NotFoundException('Cannot find workout');
      }

      // Delete workout has id and associative table (ExcerciseOnWorkout)
      await prisma.workouts.delete({
        where: {
          id,
        },
      });
    });

    return {
      messageType: MessageType.SUCCESS,
      message: 'Workout deleted successfully!',
      id,
    };
  }
}
