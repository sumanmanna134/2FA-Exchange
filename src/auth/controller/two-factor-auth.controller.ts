import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  InternalServerErrorException,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { TwoFactorAuthService } from '../services/two-factor-auth.service';
import { JwtAuthenticationGuard } from '../guards/jwt-authentication.guard';
import { Response } from 'express';
import { GetUser } from '../decorator/get-user.decorator';
import { User } from '../entity/user.entity';
import { TwoFaAuthDto } from '../dto/two-fa-auth.dto';
@ApiTags('Two Fa')
@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthController {
  constructor(private readonly twoFactorAuthService: TwoFactorAuthService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthenticationGuard)
  @Post('generate-qr')
  async generateQrCode(@Res() response: Response, @GetUser() user: User) {
    const { optAuthUrl } =
      await this.twoFactorAuthService.generateTwoFactorAuthSecret(user);
    response.setHeader('content-type', 'image/png');
    return this.twoFactorAuthService.qrCodeStreamPipe(response, optAuthUrl);
  }

  @ApiBearerAuth()
  @ApiBody({
    type: TwoFaAuthDto,
  })
  @UseGuards(JwtAuthenticationGuard)
  @Post('activate')
  async activationOfTwoFa(
    @GetUser() user: User,
    @Body(ValidationPipe) twoFaAuthDto: TwoFaAuthDto,
  ) {
    const isCodeValid = await this.twoFactorAuthService.verifyTwoFaCode(
      twoFaAuthDto.code,
      user,
    );
    if (!isCodeValid) {
      throw new UnauthorizedException('Invalid Authentication Code');
    }
    try {
      await this.twoFactorAuthService.activationOfTwoFa(user.username, true);
      return { message: '2Factor Authentication activated! 🚀' };
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException('Internal Server Error');
    }
  }

  @ApiBearerAuth()
  @Post('authenticate')
  @UseGuards(JwtAuthenticationGuard)
  async authenticate(
    @GetUser() user: User,
    @Body(ValidationPipe) twoFaAuthDto: TwoFaAuthDto,
  ) {
    const isCodeValid = await this.twoFactorAuthService.verifyTwoFaCode(
      twoFaAuthDto.code,
      user,
    );
    console.log(isCodeValid);
    if (!isCodeValid) {
      throw new UnauthorizedException('Invalid Authentication Code');
    }
    return await this.twoFactorAuthService.signIn(user, true);
  }
}
