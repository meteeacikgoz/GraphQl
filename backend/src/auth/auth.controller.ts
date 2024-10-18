import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { LoginAuthDto } from './loginAuth.dto';
import { JwtUtils } from 'src/jwt/jwt.utils';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtUtils: JwtUtils,
  ) {}

  @Post('login/:id')
  login(
    @Body() loginAuthDto: LoginAuthDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.authService.login(loginAuthDto, id);
  }
}
