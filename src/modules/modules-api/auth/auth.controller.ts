import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register-auth.dto';
import { LoginDto } from './dto/login-auth.dto';
import { Public } from 'src/common/decorators/public.decorator';
import { MessageResponse } from 'src/common/decorators/message-response.decorator';
import { User } from 'src/common/decorators/user.decorator';
import type { Users } from 'generated/prisma';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // ------------------ Register ------------------
  @Post('register')
  @Public()
  @ApiOperation({ summary: 'Register a new account' })
  @MessageResponse('Account registered successfully!')
  register(@Query() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  // ------------------ Login ------------------
  @Post('login')
  @Public()
  @ApiOperation({ summary: 'Login to the system' })
  @MessageResponse('Login successful!')
  login(@Query() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // ------------------ RefreshToken ------------------
  @Post('refresh-token')
  @Public()
  @ApiOperation({ summary: 'Refresh Token' })
  @MessageResponse('Refresh Token successfully!')
  refreshToken(@Body() refreshToken: RefreshTokenDto) {
    return this.authService.refreshToken(refreshToken);
  }

  // ------------------ Get Info ------------------
  @Get('get-info')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user info from token payload' })
  @MessageResponse('User info retrieved successfully!')
  getInfo(@User() user: Users) {
    return this.authService.getInfo(user);
  }
}
