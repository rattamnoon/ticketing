import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get('refreshtoken')
  async refreshToken(@Request() req: any) {
    const token = this.authService.createJwt(req.user);

    return { token: token.token, tokenExpires: token.tokenExpires };
  }
}
