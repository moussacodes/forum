import { Injectable } from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { PrismaService } from 'src/prisma/prisma.service';
import { CommentDto } from './dto';
import { UpdateCommentDto } from './dto/updatecomment.dto';
import { User } from '@prisma/client';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async creatComment(
    comentDto: UpdateCommentDto,
    threadId: string,
    userModel: User,
  ) {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userModel.id,
          email: userModel.email,
          username: userModel.username,
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
      // Find the thread by its ID
      const thread = await this.prisma.thread.findFirst({
        where: {
          id: threadId,
        },
      });

      if (!thread) {
        throw 'Thread not found'; // Handle the case where the thread doesn't exist
      }

      // Retrieve comments associated with the thread
      const comments = await this.prisma.comment.findMany({
        where: {
          threadId,
        },
      });

      return comments;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P1008') {
          throw 'Operations timed out';
        } else if (error.code === 'P1001') {
          throw "Can't reach the database server";
        }
      } else {
        throw error;
      }
    }
  }

  async deleteComment(commentId: string) {
    try {
      const comment = await this.prisma.comment.delete({
        where: {
          id: commentId,
        },
      });
      return 'comment was deleted succesfully';
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

  async likeComment(commentId: string, updateUser: User) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: updateUser.id,
      },
      select: {
        likedComments: true,
        dislikedComments: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.dislikedComments.includes(commentId)) {
      await this.prisma.user.update({
        where: {
          id: updateUser.id,
          email: updateUser.email,
          username: updateUser.username,
        },
        data: {
          dislikedComments: user.dislikedComments.filter(
            (dislikedCommentId) => dislikedCommentId !== commentId,
          ),
          likedComments: [...user.likedComments, commentId],
        },
      });
      await this.prisma.comment.update({
        where: {
          id: commentId,
        },
        data: {
          reactionCount: {
            increment: 2,
          },
        },
      });
    } else {
      if (!user.likedComments.includes(commentId)) {
        // User has not liked the thread, so like it
        await this.prisma.user.update({
          where: {
            id: updateUser.id,
            email: updateUser.email,
            username: updateUser.username,
          },
          data: {
            likedComments: { set: [...user.likedComments, commentId] },
          },
        });
        await this.prisma.comment.update({
          where: {
            id: commentId,
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
            likedComments: user.likedComments.filter(
              (likedCommentsId) => likedCommentsId !== commentId,
            ),
          },
        });
        await this.prisma.comment.update({
          where: {
            id: commentId,
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

  async dislikeComment(commentId: string, updateUser: User) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: updateUser.id,
      },
      select: {
        dislikedComments: true,
        likedComments: true,
      },
    });

    if (!user) {
      throw new Error('User not found');
    }
    // User has liked the thread, so unlike it + dislike it

    if (user.likedComments.includes(commentId)) {
      await this.prisma.user.update({
        where: {
          id: updateUser.id,
          email: updateUser.email,
          username: updateUser.username,
        },
        data: {
          likedComments: user.likedComments.filter(
            (likedThreadId) => likedThreadId !== commentId,
          ),
          dislikedComments: { set: [...user.dislikedComments, commentId] },
        },
      });
      await this.prisma.comment.update({
        where: {
          id: commentId,
        },
        data: {
          reactionCount: {
            decrement: 2,
          },
        },
      });
    } else {
      if (user.dislikedComments.includes(commentId)) {
        // User has disliked the thread, so undislike it
        await this.prisma.user.update({
          where: {
            id: updateUser.id,
            email: updateUser.email,
            username: updateUser.username,
          },
          data: {
            dislikedComments: user.dislikedComments.filter(
              (dislikedCommentId) => dislikedCommentId !== commentId,
            ),
          },
        });
        await this.prisma.comment.update({
          where: {
            id: commentId,
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
            dislikedComments: [...user.dislikedComments, commentId],
          },
        });
        await this.prisma.comment.update({
          where: {
            id: commentId,
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
