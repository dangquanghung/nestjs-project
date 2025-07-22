import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NextFunction, Request, Response } from 'express';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { MyLogger } from './logger/my.logger';
import { MyLoggerDev } from './logger/my.logger.dev';

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // logger: new MyLogger()
    bufferLogs: true
  })
  app.useLogger(app.get(MyLoggerDev))
  app.useGlobalPipes(new ValidationPipe())

  // enable cors
  app.enableCors()

  app.useStaticAssets(join(__dirname, '../uploads'), {prefix: '/uploads'})
  await app.listen(3000);
}
bootstrap();
