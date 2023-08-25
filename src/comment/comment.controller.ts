import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from 'src/auth/decorators';
import { JwtGuard } from 'src/auth/guards';
import { GetThread } from 'src/thread/decorators';
import { CommentService } from './comment.service';
import { CommentDto } from './dto';
import { UpdateCommentDto } from './dto/updatecomment.dto';
import { User } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post(':threadId')
  async creatComment(
    @Body() coment: CommentDto,
    @Param('threadId') threadId: string,
    @GetUser() user: User,
  ) {
    return await this.commentService.creatComment(coment, threadId, user);
  }

  @Get(':threadId')
  async getAllComments(@Param('threadId') threadId: string) {
    return await this.commentService.getAllCommentsOfThread(threadId);
  }

  @Patch(':commentId')
  async updateComment(
    @Body() comentDto: UpdateCommentDto,
    @Param('commentId') commentId: string,
    @GetUser('id') userId: string,

  ) {
    return await this.commentService.updateComment(comentDto, commentId,userId);
  }

  @Delete(':commentId')
  async deleteComment(
    @Param('commentId') commentId: string,
    @GetUser('id') userId: string,
  ) {
    return await this.commentService.deleteComment(commentId, userId);
  }

  @Post('like/:commentId')
  async likeComment(
    @Param('commentId') commentId: string,
    @GetUser() user: User,
  ) {
    return await this.commentService.likeComment(commentId, user);
  }

  @Delete('like/:commentId')
  async dislikeComment(
    @Param('commentId') commentId: string,
    @GetUser() user: User,
  ) {
    return await this.commentService.dislikeComment(commentId, user);
  }
}
