import { ApiProperty } from '@nestjs/swagger';
import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import {
  namePattern,
  nameRegex,
  passwordPattern,
  passwordRegex,
} from '../../utils/regex/regex';
export class SignInCredentialsDto {
  @ApiProperty({
    minimum: 4,
    maximum: 20,
    pattern: `${namePattern}`,
    type: String,
    required: true,
    description: 'Username',
    example: 'john.hopkins1',
  })
  @IsString()
  @Matches(nameRegex)
  @MinLength(4)
  @MaxLength(20)
  username: string;

  @ApiProperty({
    minimum: 6,
    maximum: 20,
    pattern: `${passwordPattern}`,
    required: true,
    description: 'At least 1 capital, 1 small, 1 special character & 1 number',
  })
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(passwordRegex, {
    message:
      'Password too weak,At least 1 capital, 1 small, 1 special character & 1 number',
  })
  password: string;
}
