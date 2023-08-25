import {
  Controller,
  HttpCode,
  Post,
  Body,
  HttpStatus,
  Get,
  Param,
  Req,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorators';
import { UserDto } from './dto';

import { UserService } from './user.service';
import { JwtGuard } from 'src/auth/guards';
import { Roles } from './decorator';
import { UserRole } from './enum';

@UseGuards(JwtGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  async getMe(@GetUser() user: User, @GetUser('email') email: string) {
    //this is just a test, you can get only some proprety if you want, however if you want other prpreties, you should edit dto file
    console.log({
      email,
    });
    return user;
  }

  @Roles(UserRole.ADMIN)
  @Delete(':userId')
  async deleteUser(@Param('userId') userId: string) {
    return await this.userService.deleteUser(userId);
  }

  @Get()
  async getAllUser() {
    //this is just a test, you can get only some proprety if you want, however if you want other prpreties, you should edit dto file
    return await this.userService.getAllUser();
  }

  @Get('/:username')
  async findOneByUserName(@Param('username') username: string) {
    return this.userService.findOneByUserName(username);
  }

  


}

/*

Admin:
  GET user
  UPDATE user
  DELETE user
  MUTE user
  BAN user

 
MODERATOR:
  GET user
  MUTE user

CONTRIBUTOR
REGULAR_USER
NEW_USER
BANNED_USER
BOT
COMMUNITY_AMBASSADOR
MUTED_USER:
  GET user

*/
