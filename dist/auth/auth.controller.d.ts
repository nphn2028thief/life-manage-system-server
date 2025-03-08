import { Request, Response } from 'express';
import { SignInDto, SignUpDto } from './dto';
import { AuthService } from './auth.service';
import { IResponse } from 'src/common/types/response';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signUp(signUpDto: SignUpDto): Promise<{
        message: string;
    }>;
    signIn(signInDto: SignInDto, res: Response): Promise<IResponse>;
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
