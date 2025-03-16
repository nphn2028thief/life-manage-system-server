import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Users } from '@prisma/client';

import { WinstonLoggerService } from 'src/winston/winston.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto';
import { MessageType } from 'src/common/constants/response';
import { IResponse, IUniqueId } from 'src/common/types/response';

@Injectable()
export class UsersService {
  constructor(
    private loggerService: WinstonLoggerService,
    private prismaService: PrismaService,
  ) {}

  async getMeAsync(req: Request): Promise<Omit<Users, 'password'>> {
    const { id } = req.user as IUniqueId;

    this.loggerService.log(`Fetching user with ID: ${id}`);

    const user = await this.prismaService.users.findUnique({
      where: {
        id,
      },
      omit: {
        password: true,
      },
    });

    this.loggerService.debug(`Fetched user with ID: ${id}`);

    if (!user) {
      this.loggerService.error(`Cannot find this user: ${id}`);
      throw new UnauthorizedException();
    }

    return user;
  }

  async updateMeAsync(
    req: Request,
    updateUserDto: UpdateUserDto,
  ): Promise<IResponse & { user: Omit<Users, 'password'> }> {
    const { id } = req.user as IUniqueId;
    const start = Date.now();

    this.loggerService.log(`Fetching user with ID: ${id}`);

    const user = await this.prismaService.users.findUnique({
      where: {
        id,
      },
      omit: {
        password: true,
      },
    });

    this.loggerService.debug(`Fetched user with ID: ${id}`);

    if (!user) {
      this.loggerService.error(`Cannot find this user: ${id}`);
      throw new UnauthorizedException();
    }

    const updatedData: any = {};

    if (updateUserDto.firstName)
      updatedData.firstName = updateUserDto.firstName;
    if (updateUserDto.lastName) updatedData.lastName = updateUserDto.lastName;
    if (updateUserDto.dateOfBirth)
      updatedData.dateOfBirth = updateUserDto.dateOfBirth;
    if (updateUserDto.weight) updatedData.weight = updateUserDto.weight;
    if (updateUserDto.height) updatedData.height = updateUserDto.height;

    // Update user
    this.loggerService.log(`Updating user with ID: ${id}`);

    const updatedUser = await this.prismaService.users.update({
      where: {
        id,
      },
      data: updatedData,
      omit: {
        password: true,
      },
    });

    const duration = Date.now() - start;
    this.loggerService.log(
      `Successfully updated meal: ${updatedUser.id} - ${updatedUser.firstName} ${updatedUser.lastName} in ${duration}ms`,
    );

    return {
      messageType: MessageType.SUCCESS,
      message: 'User updated successfully!',
      user: updatedUser,
    };
  }
}
