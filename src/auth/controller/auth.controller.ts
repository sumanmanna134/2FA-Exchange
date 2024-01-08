import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { SignupCredentialsDto } from '../dto/signup-credentials.dto';
import { CommonPromiseInterface } from '../../utils/interfaces/common.type';
import { SignInPayLoadInterFaceOptions } from '../../interfaces/signIn.payload.interface';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(
    @Body(ValidationPipe) signupCredentialsDto: SignupCredentialsDto,
  ): Promise<CommonPromiseInterface> {
    return this.authService.signup(signupCredentialsDto);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) signInCredentialDto: SignupCredentialsDto,
  ): Promise<SignInPayLoadInterFaceOptions> {
    return this.authService.signIn(signInCredentialDto);
  }
}
