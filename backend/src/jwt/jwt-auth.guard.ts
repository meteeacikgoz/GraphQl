import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // Eğer request null ise hata verebilir
    if (!request) {
      return false; // İsteği geçersiz say
    }

    const token = request.headers['authorization']?.split(' ')[1]; // Bearer token kısmını al

    if (!token) {
      return false; // Token yoksa geçersiz say
    }

    try {
      const user = this.jwtService.verify(token); // Token'ı doğrula
      request.user = user; // Kullanıcıyı isteğe ekle
      return true;
    } catch (error) {
      return false; // Token geçersizse geçersiz say
    }
  }
}
