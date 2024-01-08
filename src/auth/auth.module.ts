import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repository/user.repository';
import { AuthService } from './services/auth.service';

@Global()
@Module({
  imports: [
    PassportModule.register({}),
    JwtModule.register({}),
    TypeOrmModule.forFeature([UserRepository]),
  ],

  controllers: [],
  providers: [AuthService],
  exports: [],
})
export class AuthModule {}
