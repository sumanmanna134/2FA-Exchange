import { Global, Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserInfoRepository } from './repository/user-info.repository';
import { UserController } from './controller/user.controller';
import { UserInfo } from './entity/user-info.entity';
import { UserService } from './service/user.service';
import { UserRepository } from '../auth/repository/user.repository';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MulterModule.register({ dest: './uploads' }),
    TypeOrmModule.forFeature([UserInfo]),
  ],
  controllers: [UserController],
  providers: [UserService, UserInfoRepository],
})
export class UserModule {}
