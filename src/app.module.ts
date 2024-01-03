import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ExchangeModule } from './exchange/exchange.module';

@Module({
  imports: [AuthModule, UserModule, ExchangeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
