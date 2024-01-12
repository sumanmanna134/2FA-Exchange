import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { SignupCredentialsDto } from '../dto/signup-credentials.dto';
import { SignUpResponseDto } from '../../utils/interfaces/common.type';
import { SignInPayLoadInterFaceOptions } from '../../interfaces/signIn.payload.interface';
import { SignInCredentialsDto } from '../dto/signin-credentials.dto';
import { SignInResponseDto } from '../dto/signin-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a User' })
  @ApiBody({ type: SignupCredentialsDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully created!',
    type: SignUpResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Bad Request',
    schema: {
      example: {
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
        message: [
          'Password too weak',
          'username must be longer than or equal to 4 characters',
          'password must be longer than or equal to 6 characters',
        ],
      },
    },
  })
  signUp(
    @Body(ValidationPipe) signupCredentialsDto: SignupCredentialsDto,
  ): Promise<SignUpResponseDto> {
    return this.authService.signup(signupCredentialsDto);
  }

  @Post('/signin')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'SignIn' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: SignInResponseDto,
  })
  signIn(
    @Body(ValidationPipe) signInCredentialDto: SignInCredentialsDto,
  ): Promise<SignInPayLoadInterFaceOptions> {
    return this.authService.signIn(signInCredentialDto);
  }
}
