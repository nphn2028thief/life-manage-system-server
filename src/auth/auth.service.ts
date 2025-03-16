import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import * as argon from 'argon2';

import { WinstonLoggerService } from 'src/winston/winston.service';
import { PrismaService } from '../prisma/prisma.service';
import { SignInDto, SignUpDto } from './dto';
import { MessageType } from '../common/constants/response';
import { IResponse } from '../common/types/response';

@Injectable()
export class AuthService {
  constructor(
    private loggerService: WinstonLoggerService,
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<IResponse> {
    const { username, email, password, ...rest } = signUpDto;

    this.loggerService.log(
      `Fetching existed user with username: ${username} and email: ${email}`,
    );

    const existedUser = await this.prismaService.users.findFirst({
      where: {
        OR: [
          {
            username,
          },
          {
            email,
          },
        ],
      },
    });

    this.loggerService.debug(
      `Fetched existed user with username: ${username} and email: ${email}`,
    );

    if (existedUser) {
      this.loggerService.error(
        `Username: ${username} or email: ${email} already exist`,
      );
      throw new ConflictException('Username or email already exist');
    }

    this.loggerService.log(`Hashing password...`);

    const hash = await argon.hash(password);

    this.loggerService.log(`Creating a new user...`);

    await this.prismaService.users.create({
      data: {
        ...rest,
        username,
        email,
        password: hash,
      },
    });

    this.loggerService.debug(`Created user successfully!`);

    return {
      messageType: MessageType.SUCCESS,
      message: 'Sign up successfully!',
    };
  }

  async signIn(signInDto: SignInDto, res: Response): Promise<IResponse> {
    const { username, password } = signInDto;

    this.loggerService.log(
      `Fetching existed user with username: ${username} and password: ${password} ...`,
    );

    const existedUser = await this.prismaService.users.findUnique({
      where: {
        username,
      },
    });

    this.loggerService.debug(
      `Fetched existed user with username: ${username} and password: ${password}`,
    );

    if (!existedUser) {
      this.loggerService.error(
        `Username: ${username} or password: ${password} is incorrect`,
      );
      throw new BadRequestException('Credentials incorrect');
    }

    this.loggerService.log(`Verifying password with argon: ${password} ...`);

    // Verify password with argon
    const isMatchesPassword = await argon.verify(
      existedUser.password,
      password,
    );

    if (!isMatchesPassword) {
      this.loggerService.error(`Password: ${password} is incorrect`);
      throw new BadRequestException('Credentials incorrect');
    }

    this.loggerService.log(`Signing token...`);

    const accessToken = await this.signToken(existedUser.id);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: false, // this.configService.get<string>('NODE_ENV') === 'production'
      sameSite: 'strict',
      maxAge: 3600000,
    });

    return {
      messageType: MessageType.SUCCESS,
      message: 'Sign in successfully!',
    };
  }

  private async signToken(userId: string): Promise<string> {
    const payload = {
      id: userId,
    };
    return this.jwtService.signAsync(payload);
  }
}
