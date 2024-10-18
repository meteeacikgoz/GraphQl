import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';

export async function createResetToken() {
  const resetToken = crypto.randomBytes(64).toString('hex');
  const expires = new Date();
  expires.setHours(expires.getHours() + 1);
  return { resetToken, expires };
}

export async function createRefreshToken() {
  const refreshToken = crypto.randomBytes(64).toString('hex');
  const expires = new Date();
  expires.setHours(expires.getHours() + 1);
  return { refreshToken, expires };
}

export async function createJwtKey(
  userId: number,
  configService: ConfigService,
  jwtService: JwtService,
) {
  const payload = { sub: userId };
  const secret = configService.get<string>('JWT_SECRET_KEY');
  const jwtToken = await jwtService.signAsync(payload, {
    secret,
    expiresIn: '15m',
  });
  return {
    jwtToken,
  };
}
