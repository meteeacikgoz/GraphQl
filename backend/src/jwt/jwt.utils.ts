import { Injectable, Req, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtUtils {
  constructor(private configService: ConfigService) {}
  getSubFromToken(@Req() request: Request): number {
    const authHeader = request.headers.authorization;

    const token = authHeader?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException(
        'Authentication token is missing. Please include a token in the Authorization header.',
      );
    }
    const secret = this.configService.get<string>('JWT_SECRET_KEY');
    try {
      const decoded = jwt.verify(token, secret);
      const sub = (decoded as any).sub;
      return sub;
    } catch (error) {
      throw new UnauthorizedException(
        'Invalid token. The token could not be verified. Please provide a valid token.',
      );
    }
  }
}
