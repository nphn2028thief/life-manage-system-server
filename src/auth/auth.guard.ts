import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const accessToken = this.extractTokenFromCookie(request);
    if (!accessToken) {
      console.log('Failed to extract token from cookie: ', accessToken);
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(accessToken, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });
      request['user'] = payload;
    } catch (error) {
      console.log('Failed to verify token: ', error);
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromCookie(req: Request): string | undefined {
    return req.cookies['access_token'];
  }
}
