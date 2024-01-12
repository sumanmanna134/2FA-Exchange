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

@Global()
@Module({
  imports: [
    PassportModule.register({}),
    JwtModule.register({}),
    TypeOrmModule.forFeature([User]),
  ],

  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtRefreshStrategy, UserRepository],
  exports: [JwtStrategy, JwtRefreshStrategy, PassportModule],
})
export class AuthModule {}
