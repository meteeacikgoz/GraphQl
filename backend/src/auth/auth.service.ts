import { Injectable } from '@nestjs/common';
import { LoginAuthDto } from './loginAuth.dto';

import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { createJwtKey } from 'src/jwt/token.utils';
import { PrismaService } from 'src/prisma.service';
@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async login(loginAuthDto: LoginAuthDto, id: number) {
    const email = await this.prismaService.user.findUnique({
      where: { id: id },
    });
    if (loginAuthDto.email === email.email) {
      const jwtKey = createJwtKey(id, this.configService, this.jwtService);
      return jwtKey;
    }
  }
}
