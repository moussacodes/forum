import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { SigninDto, SignupDto } from './dto';
import { AceessTokenStrategy } from './strategy';
import { Request } from 'express';
import { Tokens } from './types';
import { AcessTokenGuard, RefreshTokenGuard } from './guards';
import { GetUser, Public } from './decorators';
  
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('/local/signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: SignupDto): Promise<Tokens> {
    return await this.authService.signup(dto);
  }

  @Public()
  @Post('/local/signin')
  @HttpCode(HttpStatus.OK)
  async signin(@Body() dto: SigninDto): Promise<Tokens> {
    return await this.authService.signin(dto);
  }

  // @UseGuards(AcessTokenGuard)   //will tell at guard to ignore authoriazation when it sees @Public()
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  async logOut(@GetUser('sub') userId: string) {
    return await this.authService.logOut(userId);
  }

  @UseGuards(RefreshTokenGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @GetUser('sub') userId: string,
    @GetUser('refreshToken') refreshToken: string,
  ) {
    return await this.authService.refreshToken(userId, refreshToken);
  }
}

//auth is done
