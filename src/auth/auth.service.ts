import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import * as argon from 'argon2';

import { MessageType } from 'src/common/constants/response';
import { PrismaService } from 'src/prisma/prisma.service';
import { IResponse } from 'src/common/types/response';
import { SignInDto, SignUpDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<IResponse> {
    const { username, email, password, ...rest } = signUpDto;
    try {
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
        return {
          messageType: MessageType.FAILED,
          message: 'Existed user',
        };
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
    } catch (error) {
      console.log('Failed to sign up: ', error);
      throw new HttpException(
        'Oops! Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async signIn(signInDto: SignInDto, res: Response): Promise<IResponse> {
    const { username, password } = signInDto;
    try {
      const existedUser = await this.prismaService.users.findUnique({
        where: {
          username,
        },
      });

      if (!existedUser) {
        return {
          messageType: MessageType.FAILED,
          message: 'Credentials incorrect',
        };
      }

      // Verify password with argon
      const isMatchesPassword = await argon.verify(
        existedUser.password,
        password,
      );

      if (!isMatchesPassword) {
        return {
          messageType: MessageType.FAILED,
          message: 'Credentials incorrect',
        };
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
    } catch (error) {
      console.log('Failed to sign in: ', error);
      throw new HttpException(
        'Oops! Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async signToken(userId: string): Promise<string> {
    const payload = {
      id: userId,
    };
    return this.jwtService.signAsync(payload);
  }

  async getMe(req: Request) {
    const { id } = req.user as { id: string };
    try {
      const user = await this.prismaService.users.findUnique({
        where: {
          id,
        },
        omit: {
          password: true,
        },
      });
      if (!user) {
        return {
          messageType: MessageType.FAILED,
          message: 'Hello',
        };
      }
      return user;
    } catch (error) {
      console.log('Failed to get me: ', error);
      throw new HttpException(
        'Oops! Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
