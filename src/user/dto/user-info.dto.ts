import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UserInfoDto {
  @ApiProperty({
    required: false,
    type: String,
    minLength: 3,
    maxLength: 60,
    example: 'kenny',
  })
  petName: string;

  @ApiProperty({
    type: 'file',
    properties: {
      file: {
        type: 'string',
        format: 'binary',
      },
    },
    required: false,
  })
  photo: string;

  @ApiProperty({
    required: false,
  })
  modified_photo: string;

  @ApiPropertyOptional({
    required: false,
    description: 'address',
    minLength: 3,
    type: String,
    example: 'Margitlaan 523, Noord Streundingsland, GA 2671 UZ',
  })
  @IsOptional()
  address: string;
}
