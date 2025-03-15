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
import { Foods } from '@prisma/client';
import { Request } from 'express';

import FoodDto from './dto/food.dto';
import { FoodsService } from './foods.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { IResponse, IUniqueId } from 'src/common/types/response';

@Controller('foods')
export class FoodsController {
  constructor(private foodService: FoodsService) {}

  @Get()
  getFoods(): Promise<Foods[]> {
    return this.foodService.getFoodsAsync();
  }

  @Get(':id')
  getFoodById(@Param('id') id: string): Promise<Foods> {
    return this.foodService.getFoodByIdAsync(id);
  }

  @Post('/system')
  createFoodBySystem(
    @Req() req: Request,
    @Body() createFoodDto: FoodDto,
  ): Promise<IResponse & { food: Foods }> {
    return this.foodService.createFoodAsync(req, createFoodDto);
  }

  @UseGuards(AuthGuard)
  @Post()
  createFoodByUser(
    @Req() req: Request,
    @Body() createFoodDto: FoodDto,
  ): Promise<IResponse & { food: Foods }> {
    return this.foodService.createFoodAsync(req, createFoodDto);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  updateFoodById(
    @Req() req: Request,
    @Body() updateFoodDto: FoodDto,
  ): Promise<IResponse & { food: Foods }> {
    return this.foodService.updateFoodByIdAsync(req, updateFoodDto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  deleteFoodById(@Req() req: Request): Promise<IResponse & IUniqueId> {
    return this.foodService.deleteFoodByIdAsync(req);
  }
}
