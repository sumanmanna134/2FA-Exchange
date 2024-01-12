import { ApiProperty } from '@nestjs/swagger';

class UserInfoDto {
  @ApiProperty({ required: true })
  id: number;

  @ApiProperty()
  petName: string | null;

  @ApiProperty()
  photo: string | null;

  @ApiProperty()
  modified_photo: string | null;

  @ApiProperty()
  address: string | null;
}

class UserDto {
  @ApiProperty({
    description: 'Flag indicating if two-factor authentication is enabled',
  })
  isTwoFactorEnable: boolean;

  @ApiProperty({
    description: 'Username of the user',
    example: 'suman.manna134',
  })
  username: string;

  @ApiProperty({ type: UserInfoDto })
  user_info: UserInfoDto;
}

export class SignInResponseDto {
  @ApiProperty({
    description: 'Access token for authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'Refresh token for authentication',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;

  @ApiProperty({ type: UserDto })
  user: UserDto;
}
