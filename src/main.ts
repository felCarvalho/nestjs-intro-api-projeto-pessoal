import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import * as fs from 'fs';
import cookieParser from 'cookie-parser';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser());
  app.enableCors({
    origin: [
      configService.get<string>('LOCALHOST_CLIENT'),
      configService.get<string>('LOCALHOST_NGROK'),
    ].filter(Boolean),
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const config = new DocumentBuilder()
    .setTitle('NestJS Intro')
    .setDescription('API para gerenciamento projeto pessoal')
    .setVersion('1.0')
    .addTag('to-do')
    .build();
  const documentFactory = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(3000);

  const documentStringJson = JSON.stringify(documentFactory, null, 2);
  fs.writeFileSync('./swagger.json', documentStringJson);
}
bootstrap();
