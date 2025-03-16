import { Injectable, NotFoundException } from '@nestjs/common';
import { Request } from 'express';
import { Foods, Meals } from '@prisma/client';

import { WinstonLoggerService } from 'src/winston/winston.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMealDto, UpdateMealDto } from './dto';
import { MessageType } from 'src/common/constants/response';
import { IResponse, IUniqueId } from 'src/common/types/response';

@Injectable()
export class MealsService {
  constructor(
    private loggerService: WinstonLoggerService,
    private prismaService: PrismaService,
  ) {}

  async getMealsAsync(req: Request): Promise<Omit<Meals, 'userId'>[]> {
    const { id: userId } = req.user as IUniqueId;

    this.loggerService.log('Fetching all meals...');

    const allMeals = await this.prismaService.meals.findMany({
      where: {
        userId,
      },
      omit: {
        userId: true,
      },
      include: {
        foods: {
          include: {
            food: {
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

    return allMeals.map((meal) => ({
      ...meal,
      foods: meal.foods.map((item) => ({
        portion: item.portion,
        ...item.food,
      })),
    }));
  }

  async getMealByIdAsync(
    id: string,
  ): Promise<Omit<Meals, 'userId'> & { foods: Omit<Foods, 'userId'>[] }> {
    this.loggerService.log(`Fetching meal by this id: ${id}`);

    const existedMeal = await this.prismaService.meals.findUnique({
      where: {
        id,
      },
      omit: {
        userId: true,
      },
      include: {
        foods: {
          include: {
            food: {
              omit: {
                userId: true,
              },
            },
          },
        },
      },
    });

    this.loggerService.log(`Fetched meal by this id: ${id}`);

    if (!existedMeal) {
      this.loggerService.error(`Cannot find this meal: ${id}`);
      throw new NotFoundException('Cannot find this meal');
    }

    return {
      ...existedMeal,
      foods: existedMeal.foods.map((item) => ({
        portion: item.portion,
        ...item.food,
      })),
    };
  }

  async createMealAsync(
    req: Request,
    createMealDto: CreateMealDto,
  ): Promise<
    IResponse & {
      meal: Omit<Meals, 'userId'> & { foods: Omit<Foods, 'userId'>[] };
    }
  > {
    const { id: userId } = req.user as IUniqueId;
    const { name, date, time, foods } = createMealDto;
    const foodIds = foods.map((item) => item.id);

    this.loggerService.log('Processing $transaction create meal...');

    const newMeal = await this.prismaService.$transaction(async (prisma) => {
      this.loggerService.debug('Fetching food count...');

      const foodCount = await prisma.foods.count({
        where: {
          id: {
            in: foodIds,
          },
        },
      });

      this.loggerService.debug(`Fetched food count: ${foodCount}`);

      if (foodCount !== foodIds.length) {
        this.loggerService.error(
          `One or more food do not exist. Expected ${foodIds.length}, found ${foodCount}. Food IDs: ${foodIds.join(', ')}`,
        );
        throw new NotFoundException('One or more food do not exist');
      }

      this.loggerService.debug('Creating a new food...');

      return prisma.meals.create({
        data: {
          name,
          date: new Date(`${date}T00:00:00Z`),
          time: new Date(`1970-01-01T${time}Z`),
          userId,
          foods: {
            create: foods.map((item) => ({
              portion: item.portion,
              food: {
                connect: {
                  id: item.id,
                },
              },
            })),
          },
        },
        omit: {
          userId: true,
        },
        include: {
          foods: {
            include: {
              food: {
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
      `Created a new meal: ${newMeal.id}: ${newMeal.name}`,
    );

    return {
      messageType: MessageType.SUCCESS,
      message: 'Meal created successfully!',
      meal: {
        ...newMeal,
        foods: newMeal.foods.map((item) => ({
          portion: item.portion,
          ...item.food,
        })),
      },
    };
  }

  async updateMealByIdAsync(
    id: string,
    updateMealDto: UpdateMealDto,
  ): Promise<
    IResponse & {
      meal: Omit<Meals, 'userId'> & { foods: Omit<Foods, 'userId'>[] };
    }
  > {
    const { foods, ...meal } = updateMealDto;
    const start = Date.now();

    this.loggerService.log('Processing $transaction update meal...');

    const updatedMeal = await this.prismaService.$transaction(
      async (prisma) => {
        this.loggerService.debug(`Fetching meal with ID: ${id}`);

        const existingMeal = await prisma.meals.findUnique({
          where: {
            id,
          },
        });

        if (!existingMeal) {
          this.loggerService.error(`Cannot find this meal with ID: ${id}`);
          throw new NotFoundException('Cannot find this meal');
        }

        this.loggerService.debug(
          `Fetched meal: ${id} - Name: ${existingMeal.name}`,
        );

        if (foods && foods.length) {
          const foodIds = foods.map((item) => item.id);
          this.loggerService.debug(`Fetching food count...`);

          const foodCount = await prisma.foods.count({
            where: {
              id: {
                in: foodIds,
              },
            },
          });

          this.loggerService.debug(`Fetched food count: ${foodCount}`);

          if (foodCount !== foodIds.length) {
            this.loggerService.error(
              `One or more food do not exist. Expected ${foodIds.length}, found ${foodCount}. Food IDs: ${foodIds.join(', ')}`,
            );
            throw new NotFoundException('One or more food do not exist');
          }
        }

        const updateData: any = {};
        if (meal.name) updateData.name = meal.name;
        if (meal.date) updateData.date = meal.date;
        if (meal.time) updateData.time = meal.time;

        if (foods) {
          this.loggerService.debug(`Updating foods for meal ID: ${id}`);

          // Delete existing food connections
          await prisma.foodsOnMeals.deleteMany({
            where: {
              mealId: id,
            },
          });

          // Create new food connections
          updateData.foods = {
            create: foods.map((item) => ({
              portion: item.portion,
              food: { connect: { id: item.id } },
            })),
          };
        }

        // Update meal
        this.loggerService.log(`Updating meal with ID: ${id}`);

        return prisma.meals.update({
          where: {
            id,
          },
          data: updateData,
          omit: {
            userId: true,
          },
          include: {
            foods: {
              include: {
                food: {
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
      `Successfully updated meal: ${updatedMeal.id} - ${updatedMeal.name} in ${duration}ms`,
    );

    return {
      messageType: MessageType.SUCCESS,
      message: 'Meal updated successfully!',
      meal: {
        ...updatedMeal,
        foods: updatedMeal.foods.map((item) => ({
          portion: item.portion,
          ...item.food,
        })),
      },
    };
  }

  async deleteMealByIdAsync(id: string): Promise<IResponse & IUniqueId> {
    const start = Date.now();
    this.loggerService.log(`Fetching meal by this id: ${id}`);

    const existedMeal = await this.prismaService.meals.findUnique({
      where: {
        id,
      },
    });

    this.loggerService.debug(`Fetched meal by this id: ${id}`);

    if (!existedMeal) {
      this.loggerService.error(`Cannot find this meal: ${id}`);
      throw new NotFoundException('Cannot find this meal');
    }

    this.loggerService.log(`Deleting meal: ${id}`);

    await this.prismaService.meals.delete({
      where: {
        id,
      },
    });

    const duration = Date.now() - start;
    this.loggerService.log(
      `Successfully deleted meal with ID: ${id} in ${duration}ms`,
    );

    return {
      messageType: MessageType.SUCCESS,
      message: 'Meal deleted successfully!',
      id,
    };
  }
}
