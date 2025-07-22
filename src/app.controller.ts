import { Controller, Get, Logger, Query, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';


@Controller()
export class AppController {
  private logger = new Logger()
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    this.logger.error("111111", AppController.name)
    this.logger.debug("333333", AppController.name)
    this.logger.verbose("444444", AppController.name)
    this.logger.log("555555", AppController.name)
    this.logger.warn("666666", AppController.name)

    return this.appService.getHello();
  }
}
