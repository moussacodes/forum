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

@UseGuards(JwtGuard)
@Controller('comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @Post(':threadId')
  async creatComment(
    @Body() coment: CommentDto,
    @Param('threadId') threadId: string,
    @GetUser('id') id: string,
  ) {
    return await this.commentService.creatComment(coment, threadId, id);
  }

  @Get(':threadId')
  async getAllComments(@Param('threadId') threadId: string) {
    return await this.commentService.getAllCommentsOfThread(threadId);
  }

  @Patch(':commentId')
  async updateComment(
    @Body() comentDto: UpdateCommentDto,
    @Param('commentId') commentId: string,
  ) {
    return await this.commentService.updateComment(comentDto, commentId);
  }

  @Post('/:id/like')
  async likePost(
    @Param('id') id: string,
    @Body() commentDto: UpdateCommentDto,
  ) {
    return await this.commentService.likeComment(id, commentDto);
  }

  @Post('/:id/dislike')
  async dislikePost(
    @Param('id') id: string,
    @Body() commentDto: UpdateCommentDto,
  ) {
    return await this.commentService.dislikeComment(id, commentDto);
  }

  @Delete('/:id/like')
  async removeLike(
    @Param('id') id: string,
    @Body() commentDto: UpdateCommentDto,
  ) {
    return await this.commentService.removeLike(id, commentDto);
  }

  @Delete('/:id/dislike')
  async removeDislike(
    @Param('id') id: string,
    @Body() commentDto: UpdateCommentDto,
  ) {
    return await this.commentService.removeDislike(id, commentDto);
  }
}
