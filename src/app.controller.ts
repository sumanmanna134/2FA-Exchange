import { Controller, Get, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { SystemMessage } from './interfaces/system.ping.interface';
@ApiTags('Common')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/ping')
  @ApiOperation({ summary: 'Return Server health check' })
  @ApiOkResponse({ description: 'Return Server health check' })
  ping(): SystemMessage {
    return this.appService.ping();
  }
}
