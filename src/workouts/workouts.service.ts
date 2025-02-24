import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { Workouts } from '@prisma/client';

import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWorkoutDto } from './dto';
import { MessageType } from 'src/constants/response';
import { IResponse } from 'src/types/response';

@Injectable()
export class WorkoutsService {
  constructor(private prismaService: PrismaService) {}

  async getWorkoutsAsync(req: Request): Promise<Omit<Workouts, 'userId'>[]> {
    const { id } = req.user as { id: string };
    try {
      const workouts = await this.prismaService.workouts.findMany({
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

      return workouts;
    } catch (error) {
      console.log('Failed to get workouts: ', error);
      throw new HttpException(
        'Oops! Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getWorkoutByIdAsync(
    req: Request,
  ): Promise<IResponse | Omit<Workouts, 'userId'>> {
    const { id } = req.params;
    try {
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
        return {
          messageType: MessageType.FAILED,
          message: 'Cannot find workout',
        };
      }
      return existedWorkout;
    } catch (error) {
      console.log('Failed to get workout: ', error);
      throw new HttpException(
        'Oops! Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createWorkoutAsync(
    req: Request,
    createWorkoutDto: CreateWorkoutDto,
  ): Promise<IResponse & { workout: Workouts }> {
    const { id } = req.user as { id: string };
    const { workout, excercises } = createWorkoutDto;
    const excerciseIds = excercises.map((item) => item.id);

    try {
      const newWorkout = await this.prismaService.$transaction(
        async (prisma) => {
          const exerciseCount = await prisma.excercises.count({
            where: {
              id: {
                in: excerciseIds,
              },
            },
          });

          if (exerciseCount !== excerciseIds.length) {
            throw new NotFoundException({
              messageType: MessageType.FAILED,
              message: 'One or more excercise do not exist',
            });
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
        },
      );

      return {
        messageType: MessageType.SUCCESS,
        message: 'Workout created successfully!',
        workout: newWorkout,
      };
    } catch (error) {
      console.log('Failed to create workouts: ', error);
      if (error instanceof NotFoundException) {
        throw new HttpException(error.getResponse(), HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Oops! Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async deleteWorkoutByIdAsync(req: Request) {
    const { id } = req.params;
    try {
      await this.prismaService.$transaction(async (prisma) => {
        const workout = await prisma.workouts.findUnique({
          where: {
            id,
          },
        });

        if (!workout) {
          throw new NotFoundException({
            messageType: MessageType.FAILED,
            message: 'Cannot find workout for delete',
          });
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
      };
    } catch (error) {
      console.log('Failed to delete workout: ', error);
      if (error instanceof NotFoundException) {
        throw new HttpException(error.getResponse(), HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Oops! Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
