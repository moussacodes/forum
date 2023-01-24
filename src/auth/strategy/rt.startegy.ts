import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Passport } from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //this will extract from authorization ex: Bearer token
      secretOrKey: config.get('JWT_SECRET'),
      passReqToCallback: true, //tell that we want to get payload + token ===> to make refresh token
    });
  }

  async validate(req: Request, payload: { sub: string; email: string }) {
    //payload is the decoded token
    const user = await this.prisma.user.findFirst({
      where: {
        id: payload.sub,
      },
    });
    const refreshToken = req.get('authorization').replace('Bearer', '').trim();
    delete user.hashedPassword;
    return { ...payload, refreshToken };
  }
}
