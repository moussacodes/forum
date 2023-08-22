import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
// import { ThreadModule } from './thread/thread.module';
// import { CommentModule } from './comment/comment.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ThreadModule } from './thread/thread.module';
import { CommentModule } from './comment/comment.module';
import helmet from 'helmet';
import { AuthController } from './auth/auth.controller';
import { ThreadController } from './thread/thread.controller';
import { UserController } from './user/user.controller';
import cors from 'cors';
import { APP_GUARD } from '@nestjs/core';
import { AcessTokenGuard } from './auth/guards';
import { VerifModule } from './verif/verif.module';
import { BadgeModule } from './badge/badge.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    // ThreadModule,
    // CommentModule,
    PrismaModule,
    ThreadModule,
    CommentModule,
     VerifModule,
    BadgeModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: AcessTokenGuard }],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cors, helmet())
      .forRoutes(AuthController, ThreadController, UserController);
  }
}
