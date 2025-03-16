import { Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { Exercises, Workouts } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkoutDto, UpdateWorkoutDto } from './dto';
import { MessageType } from '../common/constants/response';
import { IResponse, IUniqueId } from '../common/types/response';
import { WinstonLoggerService } from 'src/winston/winston.service';

@Injectable()
export class WorkoutsService {
  constructor(
    private loggerService: WinstonLoggerService,
    private prismaService: PrismaService,
  ) {}

  private getExercises = (exercises: any[]): Omit<Exercises, 'userId'>[] => {
    return exercises.map((item) => ({
      sets: item.sets,
      reps: item.reps,
      weight: item.weight,
      ...item.exercise,
    }));
  };

  async getWorkoutsAsync(req: Request): Promise<Omit<Workouts, 'userId'>[]> {
    const { id: userId } = req.user as IUniqueId;

    this.loggerService.log('Fetching all workouts...');

    const allWorkouts = await this.prismaService.workouts.findMany({
      where: {
        userId,
      },
      omit: {
        userId: true,
      },
      include: {
        exercises: {
          include: {
            exercise: {
              omit: {
                userId: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return allWorkouts.map((workout) => ({
      ...workout,
      exercises: this.getExercises(workout.exercises),
    }));
  }

  async getWorkoutByIdAsync(
    id: string,
  ): Promise<
    Omit<Workouts, 'userId'> & { exercises: Omit<Exercises, 'userId'>[] }
  > {
    this.loggerService.log(`Fetching workout by this id: ${id}`);

    const existedWorkout = await this.prismaService.workouts.findUnique({
      where: {
        id,
      },
      omit: {
        userId: true,
      },
      include: {
        exercises: {
          include: {
            exercise: {
              omit: {
                userId: true,
              },
            },
          },
        },
      },
    });

    this.loggerService.log(`Fetched workout by this id: ${id}`);

    if (!existedWorkout) {
      this.loggerService.error(`Cannot find this workout: ${id}`);
      throw new NotFoundException('Cannot found this workout');
    }

    return {
      ...existedWorkout,
      exercises: this.getExercises(existedWorkout.exercises),
    };
  }

  async createWorkoutAsync(
    req: Request,
    createWorkoutDto: CreateWorkoutDto,
  ): Promise<
    IResponse & {
      workout: Omit<Workouts, 'userId'> & {
        exercises: Omit<Exercises, 'userId'>[];
      };
    }
  > {
    const { id: userId } = req.user as IUniqueId;
    const { name, description, startTime, endTime, exercises } =
      createWorkoutDto;
    const excerciseIds = exercises.map((item) => item.id);

    this.loggerService.log('Processing $transaction create workout...');

    const newWorkout = await this.prismaService.$transaction(async (prisma) => {
      this.loggerService.debug('Fetching exercise count...');

      const exerciseCount = await prisma.exercises.count({
        where: {
          id: {
            in: excerciseIds,
          },
        },
      });

      this.loggerService.debug(`Fetched exercise count: ${exerciseCount}`);

      if (exerciseCount !== excerciseIds.length) {
        this.loggerService.error(
          `One or more exercise do not exist. Expected ${excerciseIds.length}, found ${exerciseCount}. Exercise IDs: ${excerciseIds.join(', ')}`,
        );
        throw new NotFoundException('One or more excercise do not exist');
      }

      this.loggerService.debug('Creating a new workout...');

      return prisma.workouts.create({
        data: {
          name,
          description,
          startTime,
          endTime,
          userId,
          exercises: {
            create: exercises.map((item) => ({
              sets: item.sets,
              reps: item.reps,
              weight: item.weight,
              exercise: {
                connect: { id: item.id },
              },
            })),
          },
        },
        omit: {
          userId: true,
        },
        include: {
          exercises: {
            include: {
              exercise: {
                omit: {
                  userId: true,
                },
              },
            },
          },
        },
      });
    });

    this.loggerService.log(
      `Created a new workout: ${newWorkout.id}: ${newWorkout.name}`,
    );

    return {
      messageType: MessageType.SUCCESS,
      message: 'Workout created successfully!',
      workout: {
        ...newWorkout,
        exercises: this.getExercises(newWorkout.exercises),
      },
    };
  }

  async updateWorkoutByIdAsync(
    id: string,
    updateWorkoutDto: UpdateWorkoutDto,
  ): Promise<
    IResponse & {
      workout: Omit<Workouts, 'userId'> & {
        exercises: Omit<Exercises, 'userId'>[];
      };
    }
  > {
    const { exercises, ...workout } = updateWorkoutDto;
    const start = Date.now();

    this.loggerService.log('Processing $transaction update workout...');

    const updatedWorkout = await this.prismaService.$transaction(
      async (prisma) => {
        this.loggerService.debug(`Fetching workout with ID: ${id}`);

        const existingWorkout = await prisma.workouts.findUnique({
          where: {
            id,
          },
        });

        if (!existingWorkout) {
          this.loggerService.error(`Cannot find this workout with ID: ${id}`);
          throw new NotFoundException('Cannot find this workout');
        }

        this.loggerService.debug(
          `Fetched workout: ${id} - Name: ${existingWorkout.name}`,
        );

        if (exercises && exercises.length) {
          const exerciseIds = exercises.map((item) => item.id);
          this.loggerService.debug(`Fetching exercise count...`);

          const exerciseCount = await prisma.exercises.count({
            where: {
              id: {
                in: exerciseIds,
              },
            },
          });

          this.loggerService.debug(`Fetched exercise count: ${exerciseCount}`);

          if (exerciseCount !== exerciseIds.length) {
            this.loggerService.error(
              `One or more exercise do not exist. Expected ${exerciseIds.length}, found ${exerciseCount}. Exercise IDs: ${exerciseIds.join(', ')}`,
            );
            throw new NotFoundException('One or more exercise do not exist');
          }
        }

        const updateData: any = {};
        if (workout.name) updateData.name = workout.name;
        if (workout.description) updateData.description = workout.description;
        if (workout.startTime) updateData.startTime = workout.startTime;
        if (workout.endTime) updateData.endTime = workout.endTime;

        if (exercises) {
          this.loggerService.debug(`Updating exercises for workout ID: ${id}`);

          // Delete existing food connections
          await prisma.exercisesOnWorkouts.deleteMany({
            where: {
              workoutId: id,
            },
          });

          // Create new food connections
          updateData.exercises = {
            create: exercises.map((item) => ({
              sets: item.sets,
              reps: item.reps,
              weight: item.weight,
              food: { connect: { id: item.id } },
            })),
          };
        }

        // Update workout
        this.loggerService.log(`Updating workout with ID: ${id}`);

        return prisma.workouts.update({
          where: {
            id,
          },
          data: updateData,
          omit: {
            userId: true,
          },
          include: {
            exercises: {
              include: {
                exercise: {
                  omit: {
                    userId: true,
                  },
                },
              },
            },
          },
        });
      },
    );

    const duration = Date.now() - start;
    this.loggerService.log(
      `Successfully updated workout: ${updatedWorkout.id} - ${updatedWorkout.name} in ${duration}ms`,
    );

    return {
      messageType: MessageType.SUCCESS,
      message: 'Workout updated successfully!',
      workout: {
        ...updatedWorkout,
        exercises: this.getExercises(updatedWorkout.exercises),
      },
    };
  }

  async deleteWorkoutByIdAsync(id: string): Promise<IResponse & IUniqueId> {
    const start = Date.now();
    this.loggerService.log(`Fetching workout by this id: ${id}`);

    const existedWorkout = await this.prismaService.workouts.findUnique({
      where: {
        id,
      },
    });

    this.loggerService.debug(`Fetched workout by this id: ${id}`);

    if (!existedWorkout) {
      this.loggerService.error(`Cannot find this workout: ${id}`);
      throw new NotFoundException('Cannot find this workout');
    }

    this.loggerService.log(`Deleting workout: ${id}`);

    await this.prismaService.workouts.delete({
      where: {
        id,
      },
    });

    const duration = Date.now() - start;
    this.loggerService.log(
      `Successfully deleted workout with ID: ${id} in ${duration}ms`,
    );

    return {
      messageType: MessageType.SUCCESS,
      message: 'Workout deleted successfully!',
      id,
    };
  }
}
