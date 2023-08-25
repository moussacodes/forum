import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateThreadDto } from './dto';
import { ThreadDto } from './dto/thread.dto';
import { User } from '@prisma/client';

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
          tags: updateThread.topics,
          modified: true,
          //set modified to true, after starting the database
        },
      });
      return thread;
    } catch (error) {
      throw new Error(`Error retrieving threads: ${error.message}`);
    }
  }
  async getAllThreadsOfLastWeek() {
    try {
      const currentDate = new Date();
      const oneWeekAgo = new Date(currentDate);
      oneWeekAgo.setDate(currentDate.getDate() - 7); // Calculate one week ago

      const threads = await this.prisma.thread.findMany({
        where: {
          createdAt: {
            gte: oneWeekAgo,
            lte: currentDate,
          },
        },
      });

      return threads;
    } catch (error) {
      throw new Error(`Error retrieving threads: ${error.message}`);
    }
  }

  async getAllThreadsByUser(username: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          username,
        },
        include: {
          threads: true,
        },
      });
      return user.threads;
    } catch (error) {
      throw new Error(`Error retrieving threads: ${error.message}`);
    }
  }

  async getAllThreadsByTag(tag: string) {
    try {
      const threads = await this.prisma.thread.findMany({
        where: {
          tags: {
            has: tag,
          },
        },
      });
      return threads;
    } catch (error) {
      throw new Error(`Error retrieving threads: ${error.message}`);
    }
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
      return 'thread was deleted succesfully';
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
          tags: threadDto.topics,
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
      if (pageNb < 1) {
        throw "this page doesn't exist";
      }
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

  async likeThread(threadId: string, updateUser: User) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: updateUser.id,
      },
      select: {
        likedThreads: true,
        dislikedThreads: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.dislikedThreads.includes(threadId)) {
      await this.prisma.user.update({
        where: {
          id: updateUser.id,
          email: updateUser.email,
          username: updateUser.username,
        },
        data: {
          dislikedThreads: user.dislikedThreads.filter(
            (dislikedThreadId) => dislikedThreadId !== threadId,
          ),
          likedThreads: [...user.likedThreads, threadId],
        },
      });
      await this.prisma.thread.update({
        where: {
          id: threadId,
        },
        data: {
          reactionCount: {
            increment: 2,
          },
        },
      });
    } else {
      if (!user.likedThreads.includes(threadId)) {
        // User has not liked the thread, so like it
        await this.prisma.user.update({
          where: {
            id: updateUser.id,
            email: updateUser.email,
            username: updateUser.username,
          },
          data: {
            likedThreads: { set: [...user.likedThreads, threadId] },
          },
        });
        await this.prisma.thread.update({
          where: {
            id: threadId,
          },
          data: {
            reactionCount: {
              increment: 1,
            },
          },
        });
      } else {
        await this.prisma.user.update({
          where: {
            id: updateUser.id,
            email: updateUser.email,
            username: updateUser.username,
          },
          data: {
            likedThreads: user.likedThreads.filter(
              (likedThreadId) => likedThreadId !== threadId,
            ),
          },
        });
        await this.prisma.thread.update({
          where: {
            id: threadId,
          },
          data: {
            reactionCount: {
              decrement: 1,
            },
          },
        });
      }
    }
  }

  async dislikeThread(threadId: string, updateUser: User) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: updateUser.id,
      },
      select: {
        dislikedThreads: true,
        likedThreads: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }
    // User has liked the thread, so unlike it + dislike it

    if (user.likedThreads.includes(threadId)) {
      await this.prisma.user.update({
        where: {
          id: updateUser.id,
          email: updateUser.email,
          username: updateUser.username,
        },
        data: {
          likedThreads: user.likedThreads.filter(
            (likedThreadId) => likedThreadId !== threadId,
          ),
          dislikedThreads: { set: [...user.dislikedThreads, threadId] },
        },
      });
      await this.prisma.thread.update({
        where: {
          id: threadId,
        },
        data: {
          reactionCount: {
            decrement: 2,
          },
        },
      });
    } else {
      if (user.dislikedThreads.includes(threadId)) {
        // User has disliked the thread, so undislike it
        await this.prisma.user.update({
          where: {
            id: updateUser.id,
            email: updateUser.email,
            username: updateUser.username,
          },
          data: {
            dislikedThreads: user.dislikedThreads.filter(
              (dislikedThreadId) => dislikedThreadId !== threadId,
            ),
          },
        });
        await this.prisma.thread.update({
          where: {
            id: threadId,
          },
          data: {
            reactionCount: {
              increment: 1,
            },
          },
        });
      } else {
        await this.prisma.user.update({
          where: {
            id: updateUser.id,
            email: updateUser.email,
            username: updateUser.username,
          },
          data: {
            dislikedThreads: [...user.dislikedThreads, threadId],
          },
        });
        await this.prisma.thread.update({
          where: {
            id: threadId,
          },
          data: {
            reactionCount: {
              decrement: 1,
            },
          },
        });
      }
    }
  }
}

// implemented like, dislike, functionality, FINALLLLLLLY:!!!
