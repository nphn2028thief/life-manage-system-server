import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import * as argon from 'argon2';

import { SignInDto, SignUpDto } from './dto';
import { PrismaService } from '../prisma/prisma.service';
import { MessageType } from '../common/constants/response';
import { IResponse, IUniqueId } from '../common/types/response';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<IResponse> {
    const { username, email, password, ...rest } = signUpDto;
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

    if (existedUser) {
      throw new ConflictException('Username or email already exist');
    }

    const hash = await argon.hash(password);
    await this.prismaService.users.create({
      data: {
        ...rest,
        username,
        email,
        password: hash,
      },
    });

    return {
      messageType: MessageType.SUCCESS,
      message: 'Sign up successfully!',
    };
  }

  async signIn(signInDto: SignInDto, res: Response): Promise<IResponse> {
    const { username, password } = signInDto;
    const existedUser = await this.prismaService.users.findUnique({
      where: {
        username,
      },
    });

    if (!existedUser) {
      throw new BadRequestException('Credentials incorrect');
    }

    // Verify password with argon
    const isMatchesPassword = await argon.verify(
      existedUser.password,
      password,
    );

    if (!isMatchesPassword) {
      throw new BadRequestException('Credentials incorrect');
    }

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

  async getMe(req: Request) {
    const { id } = req.user as IUniqueId;
    const user = await this.prismaService.users.findUnique({
      where: {
        id,
      },
      omit: {
        password: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
