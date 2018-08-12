import { Get, Controller } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  root(): string {
    return 'Welcome to REST API';
  }
}
