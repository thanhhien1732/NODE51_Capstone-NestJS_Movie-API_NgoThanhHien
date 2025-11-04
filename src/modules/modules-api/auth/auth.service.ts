import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/modules/modules-system/prisma/prisma.service';
import { TokenService } from 'src/modules/modules-system/token/token.service';
import { RegisterDto } from './dto/register-auth.dto';
import { LoginDto } from './dto/login-auth.dto';
import { Users } from 'generated/prisma';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tokenService: TokenService
  ) { }

  // ------------------ Register ------------------
  async register(registerDto: RegisterDto) {
    const { fullName, email, phoneNumber, password } = registerDto;

    const userExits = await this.prisma.users.findUnique({
      where: {
        email: email
      }
    })

    if (userExits) {
      throw new BadRequestException("Account already exists!")
    }

    const passwordHash = bcrypt.hashSync(password, 10)

    const { password: _, ...userNew } = await this.prisma.users.create({
      data: {
        fullName: fullName,
        email: email,
        phoneNumber: phoneNumber,
        password: passwordHash,
      }
    })

    return userNew;
  }

  // ------------------ Login ------------------
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto

    const userExits = await this.prisma.users.findUnique({
      where: {
        email: email
      }
    })

    if (!userExits) throw new BadRequestException("User does not exist, please register!")

    if (!userExits.password) {
      throw new BadRequestException("Please log in with social network (gmail, facebook) to update new password in setting")
    }

    const isPassword = bcrypt.compareSync(password, userExits.password);
    if (!isPassword) throw new BadRequestException("Incorrect password")

    if (userExits.isDeleted)
      throw new BadRequestException('Your account has been deactivated.');

    const tokens = this.tokenService.createTokens(userExits.userId)

    return tokens;
  }

  // ------------------ Get Info ------------------
  getInfo(user: Users) {
    const { password, ...safeUser } = user;
    return safeUser;
  }

  // ------------------ Refresh Token ------------------
  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { accessToken, refreshToken } = refreshTokenDto;

    const decodeAccessToken = this.tokenService.verifyAccesToken(accessToken, { ignoreExpiration: true })
    const decodeRefreshToken = this.tokenService.verifyRefreshToken(refreshToken)

    if (decodeAccessToken.userId !== decodeRefreshToken.userId) throw new UnauthorizedException("Token Invalid")

    const user = await this.prisma.users.findUnique({
      where: {
        userId: decodeRefreshToken.userId
      }
    })

    if (!user) throw new UnauthorizedException("User Invalid")

    const tokens = this.tokenService.createTokens(user.userId)

    console.log({ accessToken, refreshToken, decodeAccessToken, decodeRefreshToken })

    return tokens
  }

}
