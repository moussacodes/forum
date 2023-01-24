import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ThreadController } from './thread.controller';
import { ThreadService } from './thread.service';

@Module({
  controllers: [ThreadController],
  providers: [ThreadService, JwtService],
})
export class ThreadModule {}
