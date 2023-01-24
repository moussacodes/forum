import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateThreadDto } from './dto';
import { ThreadDto } from './dto/thread.dto';

@Injectable()
export class ThreadService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async updateThread(updateThread: UpdateThreadDto, id: string) {
    try {
      const thread = await this.prisma.thread.update({
        where: {
          id,
        },
        data: {
          title: updateThread.title,
          content: updateThread.content,
          modified: true,
          //set modified to true, after starting the database
        },
      });
      return thread;
    } catch (error) {}
  }

  async getOneThread(id) {
    try {
      const thread = await this.prisma.thread.findUnique({
        where: {
          id,
        },
      });
      return thread;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P1008') {
          throw 'Operations timed out';
        } else if (error.code === 'P1001') {
          throw "Can't reach database server";
        }
      } else {
        throw error;
      }
    }
  }

  async deleteThread(id: string) {
    try {
      const thread = await this.prisma.thread.delete({
        where: {
          id,
        },
      });
      return thread;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P1008') {
          throw 'Operations timed out';
        } else if (error.code === 'P1001') {
          throw "Can't reach database server";
        }
      } else {
        throw error;
      }
    }
  }

  async createThread(threadDto: ThreadDto, id: string) {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id,
        },
      });
      const thread = await this.prisma.thread.create({
        data: {
          title: threadDto.title,
          content: threadDto.content,
          coments: undefined,
          userId: user.id,
          views: 0,
        },
      });
      return thread;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P1008') {
          throw 'Operations timed out';
        } else if (error.code === 'P1001') {
          throw "Can't reach database server";
        }
      } else {
        throw error;
      }
    }
  }

  async getAllThreads(pageNb: number) {
    try {
      let threadNumber = 25 * (pageNb - 1);
      const threads = await this.prisma.thread.findMany({
        skip: threadNumber,
        take: 25,
      });

      return threads;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P1008') {
          throw 'Operations timed out';
        } else if (error.code === 'P1001') {
          throw "Can't reach database server";
        }
      } else {
        throw error;
      }
    }
  }

  async likePost(id: string, threadDto: UpdateThreadDto) {
    try {
      // let newLikes = threadDto.likes + 1; //should check from front end if post was liked or not
      const threads = await this.prisma.thread.update({
        where: {
          id,
        },
        data: {
          likes: { increment: 1 },
        },
      });
      return threads;
    } catch (error) {}
  }

  async dislikePost(id: string, threadDto: UpdateThreadDto) {
    try {
      //should check from front end if post was liked or not
      const threads = await this.prisma.thread.update({
        where: {
          id,
        },
        data: {
          dislikes: { increment: 1 },
        },
      });
      return threads;
    } catch (error) {}
  }

  async removeLike(id: string, threadDto: UpdateThreadDto) {
    try {
      //should check from front end if post was liked or not
      const threads = await this.prisma.thread.update({
        where: {
          id,
        },
        data: {
          likes: { decrement: 1 },
        },
      });
      return threads;
    } catch (error) {}
  }

  async removeDislike(id: string, threadDto: UpdateThreadDto) {
    try {
      //should check from front end if post was liked or not
      const threads = await this.prisma.thread.update({
        where: {
          id,
        },
        data: {
          dislikes: { decrement: 1 },
        },
      });
      return threads;
    } catch (error) {}
  }
}
