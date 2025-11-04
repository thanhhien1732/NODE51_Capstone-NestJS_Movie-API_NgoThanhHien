import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
    ACCESS_TOKEN_EXPIRES_IN,
    ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_EXPIRES_IN,
    REFRESH_TOKEN_SECRET,
} from 'src/common/constant/app.constant';

@Injectable()
export class TokenService {
    constructor(private readonly jwtService: JwtService) { }

    createTokens(userId) {
        const accessToken = this.jwtService.sign(
            { userId: userId },
            {
                secret: ACCESS_TOKEN_SECRET,
                expiresIn: ACCESS_TOKEN_EXPIRES_IN,
            }
        );
        const refreshToken = this.jwtService.sign(
            { userId: userId },
            {
                secret: REFRESH_TOKEN_SECRET,
                expiresIn: REFRESH_TOKEN_EXPIRES_IN,
            }
        );

        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
        };
    }

    verifyAccesToken(accessToken, option) {
        const decodeAccessToken = this.jwtService.verify(accessToken, {
            ...option,
            secret: ACCESS_TOKEN_SECRET,
        });
        return decodeAccessToken;
    }

    verifyRefreshToken(refreshToken) {
        const decodeRefreshToken = this.jwtService.verify(refreshToken, {
            secret: REFRESH_TOKEN_SECRET,
        });
        return decodeRefreshToken;
    }
}
