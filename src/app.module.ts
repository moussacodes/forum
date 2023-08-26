import {
  CacheModule,
  CacheModuleAsyncOptions,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThreadModule } from './thread/thread.module';
import { CommentModule } from './comment/comment.module';
import helmet from 'helmet';
import { AuthController } from './auth/auth.controller';
import { ThreadController } from './thread/thread.controller';
import { UserController } from './user/user.controller';
import cors from 'cors';
import * as redis from 'redis'; // Import the 'redis' library

import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import * as redisStore from 'cache-manager-redis-store'; // Correct import statement
import { AcessTokenGuard } from './auth/guards';
import { VerifModule } from './verif/verif.module';
import { BadgeModule } from './badge/badge.module';
import { RoleGuard } from './user/guards/user.guard';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: (): CacheModuleAsyncOptions => ({
        imports: [ConfigModule],
        useFactory: (configService: ConfigService) => {
          const client = redis.createClient({
            socket: {
              host: 'localhost',
              port: 6379,
            },
          });
          return {
            store: require('cache-manager').caching({
              store: redisStore,
              client,
            }),
          };
        },
        inject: [ConfigService],
      }),
    }),

    // CacheModule.register({
    //   store: require('cache-manager-redis-store'), // Use 'cache-manager-redis-store'
    //   host: 'localhost',
    //   port: 6379,
    // }),
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    AuthModule,
    UserModule,
    PrismaModule,
    ThreadModule,
    CommentModule,
    VerifModule,
    BadgeModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

    { provide: APP_GUARD, useClass: AcessTokenGuard },
    { provide: APP_GUARD, useClass: RoleGuard },
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cors, helmet())
      .forRoutes(AuthController, ThreadController, UserController);
  }
}
