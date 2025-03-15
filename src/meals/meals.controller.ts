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
import { Foods, Meals } from '@prisma/client';

import { AuthGuard } from 'src/auth/auth.guard';
import { CreateMealDto, UpdateMealDto } from './dto';
import { MealsService } from './meals.service';
import { IResponse, IUniqueId } from 'src/common/types/response';

@UseGuards(AuthGuard)
@Controller('meals')
export class MealsController {
  constructor(private mealsService: MealsService) {}

  @Get()
  getMeals(@Req() req: Request): Promise<Omit<Meals, 'userId'>[]> {
    return this.mealsService.getMealsAsync(req);
  }

  @Get(':id')
  getMealById(
    @Param('id') id: string,
  ): Promise<Omit<Meals, 'userId'> & { foods: Omit<Foods, 'userId'>[] }> {
    return this.mealsService.getMealByIdAsync(id);
  }

  @Post()
  createMeal(
    @Req() req: Request,
    @Body() createMealDto: CreateMealDto,
  ): Promise<
    IResponse & {
      meal: Omit<Meals, 'userId'> & { foods: Omit<Foods, 'userId'>[] };
    }
  > {
    return this.mealsService.createMealAsync(req, createMealDto);
  }

  @Patch(':id')
  updateMealById(
    @Param('id') id: string,
    @Body() updateMealDto: UpdateMealDto,
  ): Promise<
    IResponse & {
      meal: Omit<Meals, 'userId'> & { foods: Omit<Foods, 'userId'>[] };
    }
  > {
    return this.mealsService.updateMealByIdAsync(id, updateMealDto);
  }

  @Delete(':id')
  deleteMealById(@Param('id') id: string): Promise<IResponse & IUniqueId> {
    return this.mealsService.deleteMealByIdAsync(id);
  }
}
