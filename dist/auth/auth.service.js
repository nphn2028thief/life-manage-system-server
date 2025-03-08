"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const argon = require("argon2");
const prisma_service_1 = require("../prisma/prisma.service");
const response_1 = require("../common/constants/response");
let AuthService = class AuthService {
    constructor(prismaService, jwtService) {
        this.prismaService = prismaService;
        this.jwtService = jwtService;
    }
    async signUp(signUpDto) {
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
            throw new common_1.ConflictException('Username or email already exist');
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
            messageType: response_1.MessageType.SUCCESS,
            message: 'Sign up successfully!',
        };
    }
    async signIn(signInDto, res) {
        const { username, password } = signInDto;
        const existedUser = await this.prismaService.users.findUnique({
            where: {
                username,
            },
        });
        if (!existedUser) {
            throw new common_1.BadRequestException('Credentials incorrect');
        }
        const isMatchesPassword = await argon.verify(existedUser.password, password);
        if (!isMatchesPassword) {
            throw new common_1.BadRequestException('Credentials incorrect');
        }
        const accessToken = await this.signToken(existedUser.id);
        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 3600000,
        });
        return {
            messageType: response_1.MessageType.SUCCESS,
            message: 'Sign in successfully!',
        };
    }
    async signToken(userId) {
        const payload = {
            id: userId,
        };
        return this.jwtService.signAsync(payload);
    }
    async getMe(req) {
        const { id } = req.user;
        const user = await this.prismaService.users.findUnique({
            where: {
                id,
            },
            omit: {
                password: true,
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map