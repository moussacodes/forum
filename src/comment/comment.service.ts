import { Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommentDto } from './dto';
import { UpdateCommentDto } from './dto/updatecomment.dto';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async creatComment(
    comentDto: UpdateCommentDto,
    threadId: string,
    usersId: string,
  ) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: usersId,
        },
      });

      const comments = this.prisma.comment.create({
        data: {
          content: comentDto.content,
          userId: user.id,
          threadId: threadId,
          modified: false,
        },
      });

      const threadDb = await this.prisma.thread.update({
        where: {
          id: threadId,
        },
        data: {
          coments: {
            connect: { id: (await comments).id },
          },
        },
      });
      return comments;
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

  async getAllCommentsOfThread(threadId: string) {
    try {
      const thread = this.prisma.thread.findFirst({
        where: {
          id: threadId,
        },
      });
      return thread.coments;
      // const comments = this.prisma.comment.findMany({
      //   where: {
      //     threadId,
      //   },
      // });
      // return comments;
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

  async updateComment(comentDto: UpdateCommentDto, commentId: string) {
    try {
      const coments = this.prisma.comment.update({
        where: {
          id: commentId,
        },
        data: {
          content: comentDto.content,
          modified: true,
        },
      });
      return coments;
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
}
