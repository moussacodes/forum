import { Body, ForbiddenException, Injectable, Req } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SigninDto, SignupDto } from './dto';
// import * as argon from 'argon2';
import * as bcrypt from 'bcrypt'; //maybe change it
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Prisma, User } from '@prisma/client';

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
    try {
      const userEmailExist = await this.prisma.user.findFirst({
        where: { email: dto.email },
      });

      const userUsernameExist = await this.prisma.user.findFirst({
        where: { username: dto.username },
      });
      if (!userEmailExist && !userUsernameExist) {
        const hashedPassword = await this.hashPwd(dto.hashedPassword);

        const newRole = await this.prisma.role.create({
          data: {
            name: 'ADMIN',
          },
        });

        if (!newRole) {
          throw "couldn't create role";
        }

        const newBadge = await this.prisma.badge.create({
          data: {
            name: 'STARTER',
          },
        });

        if (!newBadge) {
          throw "couldn't create badge";
        }

        const user = await this.prisma.user.create({
          data: {
            username: dto.username,
            email: dto.email,
            hashedPassword,
            badge: {
              connect: {
                id: newBadge.id,
              },
            },
            role: {
              connect: {
                id: newRole.id,
              },
            },
            active: true,
            score: 0,
          },
        });
        if (!user) {
          throw "couldn't create badge";
        }

        const role = await this.findRole(user);
        if (role) {
          const tokens = await this.signToken(user.id, user.email, role.name);
          await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
          return tokens;
        }
      } else {
        throw new ForbiddenException('Credential taken');
      }
    } catch (error) {
      console.log(error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
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

    const role = await this.findRole(user);
    if (role) {
      const tokens = await this.signToken(user.id, user.email, role.name);
      await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
      return tokens;
    }
  }

  async signToken(
    userId: string,
    email: string,
    role,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const secret = this.config.get('JWT_SECRET');

    const payload = {
      sub: userId,
      email,
      role,
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
    const role = await this.findRole(user);
    if (role) {
      const tokens = await this.signToken(user.id, user.email, role.name);
      await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
      return tokens;
    }
  }

  async findRole(user: User) {
    const role = await this.prisma.role.findFirst({
      where: {
        id: user.roleId,
      },
    });
    return role;
  }
}

//special for buisness logic (connect to db, ect...)
