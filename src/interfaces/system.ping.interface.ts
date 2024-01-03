import { HttpStatus } from '@nestjs/common';

export interface SystemMessage {
  status: string;
  timestamp: number;
}
