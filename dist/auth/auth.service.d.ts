import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { SignInDto, SignUpDto } from './dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { IResponse } from 'src/common/types/response';
export declare class AuthService {
    private prismaService;
    private jwtService;
    constructor(prismaService: PrismaService, jwtService: JwtService);
    signUp(signUpDto: SignUpDto): Promise<IResponse>;
    signIn(signInDto: SignInDto, res: Response): Promise<IResponse>;
    private signToken;
    getMe(req: Request): Promise<{
        username: string;
        email: string;
        firstName: string;
        lastName: string;
        dateOfBirth: Date;
        weight: number;
        height: number;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
