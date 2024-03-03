/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
// import session from 'express-session';
import passport = require('passport');
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:4200',
    methods: 'GET,POST,HEAD,PUT,PATCH,DELETE',
    credentials: true,
  })
  const swaggerConfig = new DocumentBuilder()
    .setTitle('HeathCare API')
    .setDescription('Healthcare API description')
    .setVersion('0.1')
    .addTag('healthcare')
    .build();
  //   const globalPrefix = 'api';
  //   app.setGlobalPrefix(globalPrefix);
  //   const port = process.env.PORT || 3000;
  //   await app.listen(port);
  //   Logger.log(
  //     `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  //   );
  // }
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('swagger', app, document);
  // app.use(
  //   session({
  //     secret: 'my-secret',
  //     resave: false,
  //     saveUninitialized: false,
  //   })
  // );
  app.useGlobalPipes(new ValidationPipe());



  app.use(passport.initialize());
  app.use(passport.session());
  await app.listen(3000);
  Logger.log('Application running on: Http://localhost:3000');
}

bootstrap();
