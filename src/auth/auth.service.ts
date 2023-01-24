import { Body, ForbiddenException, Injectable, Req } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SigninDto, SignupDto } from './dto';
// import * as argon from 'argon2';
import * as bcrypt from 'bcrypt'; //maybe change it
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  async hashPwd(pwd: string) {
    const salt = 10;
    return await bcrypt.hash(pwd, salt);
  }

  async signup(dto: SignupDto) {
    const hashedPassword = await this.hashPwd(dto.hashedPassword);

    try {
      const user = await this.prisma.user.create({
        data: {
          username: dto.username,
          email: dto.email,
          hashedPassword,
          pfp: dto.pfp,
          bio: dto.bio,
        },
      });
      delete user.hashedPassword;

      const tokens = await this.signToken(user.id, user.email);
      await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
      return tokens;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credential taken');
        }
      }
      throw error;
    }
  }

  async signin(dto: SigninDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('Credential incorrect');
    }

    const isMatch = await bcrypt.compare(
      dto.hashedPassword,
      user.hashedPassword,
    );

    if (!isMatch) throw new ForbiddenException('Credentials incorrect');
    const tokens = await this.signToken(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
    return tokens;
  }

  async signToken(
    userId: string,
    email: string,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const secret = this.config.get('JWT_SECRET');

    const payload = {
      sub: userId,
      email,
    };

    const [aceess_token, refresh_token] = await Promise.all([
      this.jwt.signAsync(payload, {
        expiresIn: '15m',
        secret: secret,
      }),
      this.jwt.signAsync(payload, {
        expiresIn: 60 * 60 * 24 * 7,
        secret: secret,
      }),
    ]);

    return {
      access_token: aceess_token,
      refresh_token: refresh_token,
    };
  }

  async updateRefreshTokenHash(userId: string, refreshToken: string) {
    const hashedToken = await this.hashPwd(refreshToken);

    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        refreshToken: hashedToken,
      },
    });
  }
  async logOut(userId: string) {
    await this.prisma.user.update({
      where: {
        id: userId, //later make sure that logOut is not null
      },
      data: {
        refreshToken: null,
      },
    });
  }
  async refreshToken(userId: string, refreshtoken: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new ForbiddenException('Access denied');
    if (user.refreshToken != null) {
      const match = bcrypt.compare(refreshtoken, user.refreshToken);
      if (!match)
        throw new ForbiddenException('Access denied [WRONG CREDENTIALS]');
    } else {
      throw new ForbiddenException(
        "You've been logged out, you need to log in again ",
      );
    }

    const tokens = await this.signToken(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
    return tokens;
  }
}

//special for buisness logic (connect to db, ect...)
