import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Passport } from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AceessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //this will extract from authorization ex: Bearer token
      secretOrKey: config.get('JWT_SECRET'),
      passReqToCallback: true, //tell that we want to get payload + token ===> to make refresh token
    });
  }

  async validate(req: Request, payload: { sub: string; email: string }) {   //payload is the decoded token
    const user = await this.prisma.user.findFirst({
      where: {
        id: payload.sub,
      },
    });
    delete user.hashedPassword;
    return payload;   //here it was return payload, changed ot to make logout work
  }
}
