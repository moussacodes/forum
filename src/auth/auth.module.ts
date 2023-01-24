import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AceessTokenStrategy, RefreshTokenStrategy } from './strategy';

@Module({
    imports: [JwtModule.register({})],
    controllers: [AuthController],
    providers: [AuthService, AceessTokenStrategy, RefreshTokenStrategy]
})
export class AuthModule {}
