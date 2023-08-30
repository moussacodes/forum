import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { Cache } from 'cache-manager';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateThreadDto } from './dto';
import { ThreadDto } from './dto/thread.dto';
import { User } from '@prisma/client';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ThreadService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async updateThread(
    updateThread: UpdateThreadDto,
    id: string,
    userId: string,
  ) {
    try {
      const findThread = await this.prisma.thread.findFirst({
        where: {
          id,
        },
      });
      if (findThread.userId === userId) {
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
      } else {
        throw "you don't have the authorization to edit this thread";
      }
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
          },
        },
      });

      return threads;
    } catch (error) {
      throw new Error(`Error retrieving threads: ${error.message}`);
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async getTrendyPosts() {
    try {
      const trendyThreads = (await this.getAllThreadsOfLastWeek())
        .slice(0, 10)
        .sort((a, b) => b.views - a.views);
        await this.cacheManager.del('trendy_threads');
        await this.cacheManager.set('trendy_threads', trendyThreads);
    } catch (error) {}
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async getTheNewThreads() {
    try {
      const currentDate = new Date();
      const oneDayAgo = new Date(currentDate);
      oneDayAgo.setDate(currentDate.getDate() - 1);

      const newThreads = (
        await this.prisma.thread.findMany({
          where: {
            createdAt: {
              gte: oneDayAgo,
            },
          },
        })
      )
        .slice(0, 10)
        .sort((a, b) => b.views - a.views);

        await this.cacheManager.del('new_threads');
        await this.cacheManager.set('new_threads', newThreads);

    } catch (error) {}
  }

  async retreiveTrendyThreads() {
    try {
      return await this.cacheManager.get('trendy_threads');
    } catch (error) {}
  }

  async retreiveTodayThreads() {
    try {
      return await this.cacheManager.get('new_threads');
    } catch (error) {}
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

  async getOneThread(id: string) {
    try {
      const thread = await this.prisma.thread.findFirst({
        where: {
          id,
        },
      });
      if (thread) {
        await this.prisma.thread.update({
          where: {
            id,
          },
          data: {
            views: { increment: 1 },
          },
        });
      }
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

  async deleteThread(id: string, userId: string) {
    try {
      const thread = await this.prisma.thread.findFirst({
        where: {
          id,
          userId,
        },
      });

      return {
        response: 'thread was deleted succesfully',
      };
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
          comments: undefined,
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
