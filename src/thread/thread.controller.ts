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
import { User, Thread } from '@prisma/client';

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
    @Param('id') id: string,
    @Body() updateThreadDto: UpdateThreadDto,
  ): Promise<Thread> {
    return await this.threadService.updateThread(updateThreadDto, id);
  }

  @Get(':id')
  async getOneThread(@Param('id') id: string) {
    return await this.threadService.getOneThread(id);
  }

  @Get('date') //yyyy-mm-dd
  async getAllThreadsOfLastWeek(): Promise<Thread[]> {
    return await this.threadService.getAllThreadsOfLastWeek();
  }

  @Get('tag/:tag')
  async getAllThreadsByTag(@Param('tag') tag: string): Promise<Thread[]> {
    return await this.threadService.getAllThreadsByTag(tag);
  }

  @Get('user/:username') //yyyy-mm-dd
  async getAllThreadsByUser(
    @Param('username') username: string,
  ): Promise<Thread[]> {
    return await this.threadService.getAllThreadsByUser(username);
  }

  @Delete(':id')
  async deleteThread(@Param('id') id: string) {
    return await this.threadService.deleteThread(id);
  }

  //PAGINATION

  @Get('page/:pageNb')
  async getAllThreads(
    @Param('pageNb', ParseIntPipe) pageNb: number,
  ): Promise<Thread[]> {
    return await this.threadService.getAllThreads(pageNb);
  }

  @Post('like/:threadId')
  async likeThread(@Param('threadId') threadId: string, @GetUser() user: User) {
    return await this.threadService.likeThread(threadId, user);
  }

  @Delete('like/:threadId')
  async dislikeThread(
    @Param('threadId') threadId: string,
    @GetUser() user: User,
  ) {
    return await this.threadService.dislikeThread(threadId, user);
  }
}
