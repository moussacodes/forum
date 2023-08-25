import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { PrismaService } from 'src/prisma/prisma.service';

import { UserDto } from './dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  // async findOne(id: number) {
  //   try {
  //     const user = await this.prisma.user.findUnique({
  //       where: {
  //         id,
  //       },
  //     });
  //     return user;
  //   } catch (error) {
  //     if (error instanceof PrismaClientKnownRequestError) {
  //       if (error.code === 'P1001') {
  //         throw new ForbiddenException('Credential taken');
  //       }
  //     }
  //     throw error;
  //   }
  // }

 
  async findOneByUserName(username: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          username: username,
        },
      });
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P1001') {
          throw new ForbiddenException('Credential taken');
        }
      }
      throw error;
    }
  }

  async getMe(userDto: UserDto) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          email: userDto.email,
        },
      });
      return user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P1001') {
          throw new ForbiddenException('Credential taken');
        }
      }
      throw error;
    }
  }

  async deleteUser(userId: string){
    
  }

  async getAllUser() {
    try {
      const users = await this.prisma.user.findMany({});
      return users;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P1001') {
          throw new ForbiddenException('Credential taken');
        }
      }
      throw error;
    }
  }
}
