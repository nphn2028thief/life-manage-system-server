import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ExcercisesAddedBy, Foods } from '@prisma/client';
import { Request } from 'express';

import FoodDto from './dto/food.dto';
import { WinstonLoggerService } from 'src/winston/winston.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { MessageType } from 'src/common/constants/response';
import { IResponse, IUniqueId } from 'src/common/types/response';

@Injectable()
export class FoodsService {
  constructor(
    private loggerService: WinstonLoggerService,
    private prismaService: PrismaService,
  ) {}

  async getFoodsAsync(): Promise<Foods[]> {
    this.loggerService.log(`Fetching all foods...`);

    return await this.prismaService.foods.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async getFoodByIdAsync(id: string): Promise<Foods> {
    this.loggerService.log(`Fetching food: ${id} ...`);

    const food = await this.prismaService.foods.findUnique({
      where: {
        id,
      },
    });

    this.loggerService.debug(`Fetched food: ${id}`);

    if (!food) {
      this.loggerService.error(`Cannot find this food: ${id}`);
      throw new NotFoundException('Cannot find food');
    }

    return food;
  }

  async createFoodAsync(
    req: Request,
    createFoodDto: FoodDto,
  ): Promise<IResponse & { food: Foods }> {
    const user = req.user;

    try {
      this.loggerService.log('Creating a new food...');

      const newFood = await this.prismaService.foods.create({
        data: {
          ...createFoodDto,
          addedBy: user ? ExcercisesAddedBy.USER : ExcercisesAddedBy.SYSTEM,
          userId: user && 'id' in user ? (user as IUniqueId).id : null,
        },
      });

      this.loggerService.debug('Created a new food successfully!');

      return {
        messageType: MessageType.SUCCESS,
        message: 'Created food successfully',
        food: newFood,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        this.loggerService.error(`Food '${createFoodDto.name}' has existed`);
        throw new ConflictException(`Food '${createFoodDto.name}' has existed`);
      }
      throw error;
    }
  }

  async updateFoodByIdAsync(
    req: Request,
    updateFoodDto: FoodDto,
  ): Promise<IResponse & { food: Foods }> {
    const { id } = req.params;
    const { id: userId } = req.user as IUniqueId;

    try {
      this.loggerService.log(`Fetching food: ${id} ...`);

      const food = await this.prismaService.foods.findUnique({
        where: {
          id,
        },
      });

      this.loggerService.debug(`Fetched food: ${id}`);

      if (!food) {
        this.loggerService.error(`Cannot find this food: ${id}`);
        throw new NotFoundException('Cannot find food');
      }

      if (food.addedBy !== ExcercisesAddedBy.USER || food.userId !== userId) {
        this.loggerService.error(
          `You are not allowed to adjust this food: ${id}`,
        );
        throw new UnauthorizedException(
          'You are not allowed to adjust this food',
        );
      }

      this.loggerService.log(
        `Updating food ${id}: ${food.name}, new name: ${updateFoodDto.name} ...`,
      );

      const updatedFood = await this.prismaService.foods.update({
        where: {
          id,
        },
        data: {
          ...updateFoodDto,
          addedBy: 'USER',
        },
      });

      this.loggerService.debug(
        `Updated food ${id}, new name: ${updatedFood.name}`,
      );

      return {
        messageType: MessageType.SUCCESS,
        message: 'Updated food successfully',
        food: updatedFood,
      };
    } catch (error) {
      // Duplicate value
      if (error.code === 'P2002') {
        this.loggerService.error(
          `Food ${id}: ${updateFoodDto.name} has existed`,
        );
        throw new ConflictException(`Food ${updateFoodDto.name} has existed`);
      }
      throw error;
    }
  }

  async deleteFoodByIdAsync(req: Request): Promise<IResponse & IUniqueId> {
    const { id } = req.params;
    const { id: userId } = req.user as IUniqueId;

    this.loggerService.log(`Fetching food: ${id} ...`);

    const food = await this.prismaService.foods.findUnique({
      where: {
        id,
      },
    });

    this.loggerService.debug(`Fetched food: ${id}`);

    if (!food) {
      this.loggerService.error(`Cannot find this food: ${id}`);
      throw new NotFoundException('Cannot find food');
    }

    if (food.addedBy !== ExcercisesAddedBy.USER || food.userId !== userId) {
      this.loggerService.error(
        `You are not allowed to delete this food: ${id}`,
      );
      throw new UnauthorizedException(
        'You are not allowed to delete this food',
      );
    }

    this.loggerService.log(`Deleting food ${id}: ${food.name} ...`);

    await this.prismaService.foods.delete({
      where: {
        id,
      },
    });

    this.loggerService.debug(`Deleted food ${id}: ${food.name}`);

    return {
      messageType: MessageType.SUCCESS,
      message: 'Deleted food successfully',
      id,
    };
  }
}
