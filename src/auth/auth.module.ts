import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repository/user.repository';
import { AuthService } from './services/auth.service';
import { JwtRefreshStrategy } from './strategy/jwt-refresh-strategy';
import { AuthController } from './controller/auth.controller';
import { User } from './entity/user.entity';
import { JwtStrategy } from './strategy/jwt-strategy';
import { TwoFactorAuthController } from './controller/two-factor-auth.controller';
import { JwtTwoFaStrategy } from './strategy/jwt-2fa-strategy';
import { TwoFactorAuthService } from './services/two-factor-auth.service';
import { ConfigModule } from '@nestjs/config';
@Global()
@Module({
  imports: [
    ConfigModule.forRoot(),
    PassportModule.register({}),
    JwtModule.register({}),
    TypeOrmModule.forFeature([User]),
  ],

  controllers: [AuthController, TwoFactorAuthController],
  providers: [
    AuthService,
    TwoFactorAuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    JwtTwoFaStrategy,
    UserRepository,
  ],
  exports: [JwtStrategy, JwtRefreshStrategy, JwtTwoFaStrategy, PassportModule],
})
export class AuthModule {}
