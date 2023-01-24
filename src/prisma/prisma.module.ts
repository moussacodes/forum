import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()    //so all modules can use it 
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
