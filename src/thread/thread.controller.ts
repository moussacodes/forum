import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards';
import { ThreadDto } from './dto/thread.dto';
import { ThreadService } from './thread.service';
import { GetUser } from 'src/auth/decorators';
import { UpdateThreadDto } from './dto';
import { thread } from '@prisma/client';

@UseGuards(JwtGuard)
@Controller('thread')
export class ThreadController {
  constructor(private threadService: ThreadService) {}

  @Post()
  async createThread(@Body() thread: ThreadDto, @GetUser('id') id: string) {
    return await this.threadService.createThread(thread, id);
  }

  @Patch(':id')
  async updateThread(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateTransactionDto: UpdateThreadDto,
  ): Promise<thread> {
    return await this.threadService.updateThread(updateTransactionDto, id);
  }

  @Get(':id')
  async getOneThread(@Param('id') id: string) {
    return await this.threadService.getOneThread(id);
  }

  

  @Delete(':id')
  async deleteThread(@Param('id') id: string) {
    return await this.threadService.deleteThread(id);
  }

  //PAGINATION

  @Get('page/:pageNb')
  async getAllThreads(
    @Param('pageNb', ParseIntPipe) pageNb: number,
  ): Promise<thread[]> {
    return await this.threadService.getAllThreads(pageNb);
  }

  @Post('/like/:id')
  async likePost(@Param('id') id: string, @Body() threadDto: UpdateThreadDto) {
    return await this.threadService.likePost(id, threadDto);
  }

  @Post('/dislike/:id')
  async dislikePost(
    @Param('id') id: string,
    @Body() threadDto: UpdateThreadDto,
  ) {
    return await this.threadService.dislikePost(id, threadDto);
  }

  @Delete('/like/:id')
  async removeLike(
    @Param('id') id: string,
    @Body() threadDto: UpdateThreadDto,
  ) {
    return await this.threadService.removeLike(id, threadDto);
  }

  @Delete('/dislike/:id')
  async removeDislike(
    @Param('id') id: string,
    @Body() threadDto: UpdateThreadDto,
  ) {
    return await this.threadService.removeDislike(id, threadDto);
  }
}
