import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { PrismaService } from 'src/prisma/prisma.service';

import { UserDto } from './dto';
import { User } from '@prisma/client';

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

  async deleteUser(userId: string, user: User) {
    try {
      if (userId != user.id) {
        const delUser = await this.prisma.user.findFirst({
          where: {
            id: userId,
          },
        });
        if (delUser) {
          await this.prisma.comment.deleteMany({
            where: {
              userId,
            },
          });

          await this.prisma.thread.deleteMany({
            where: {
              userId,
            },
          });

          await this.prisma.badge.delete({
            where: {
              id: delUser.badgeId,
            },
          });

          await this.prisma.role.deleteMany({
            where: {
              id: delUser.roleId,
            },
          });

          const deletedUser = await this.prisma.user.delete({
            where: {
              id: userId,
            },
          });
          return deletedUser;
        } else {
          throw 'user does not exist';
        }
      } else {
        throw ' sorry you cannot delete yourself';
      }
    } catch (error) {
      console.log(error);
    }
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
