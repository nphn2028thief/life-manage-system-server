import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { SignInDto, SignUpDto } from './dto';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { IResponse } from 'src/common/types/response';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signUp')
  signUp(@Body() signUpDto: SignUpDto): Promise<{ message: string }> {
    return this.authService.signUp(signUpDto);
  }

  @Post('signIn')
  signIn(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<IResponse> {
    return this.authService.signIn(signInDto, res);
  }

  @UseGuards(AuthGuard)
  @Get('getMe')
  getMe(@Req() req: Request) {
    return this.authService.getMe(req);
  }
}
