import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { Users } from '@prisma/client';

import { AuthGuard } from 'src/auth/auth.guard';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto';
import { IResponse } from 'src/common/types/response';

@UseGuards(AuthGuard)
@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @Get('getMe')
  getMe(@Req() req: Request): Promise<Omit<Users, 'password'>> {
    return this.userService.getMeAsync(req);
  }

  @Patch('updateMe')
  updateMe(
    @Req() req: Request,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<IResponse & { user: Omit<Users, 'password'> }> {
    return this.userService.updateMeAsync(req, updateUserDto);
  }
}
