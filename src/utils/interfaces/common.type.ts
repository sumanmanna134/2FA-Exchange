import { ApiProperty } from '@nestjs/swagger';

export class SignUpResponseDto {
  @ApiProperty({
    description: 'message',
    example: 'User successfully created!',
  })
  message: string;
}
