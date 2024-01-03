import { Injectable } from '@nestjs/common';
import { SystemMessage } from './interfaces/system.ping.interface';

@Injectable()
export class AppService {
  public ping(): SystemMessage {
    return { status: 'Ok', timestamp: Date.now() };
  }
}
