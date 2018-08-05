import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { join } from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import * as https from 'https';
import * as express from 'express';

dotenv.config();
const port = process.env.LISTEN_PORT || 3000;

const SwaggerOptions = new DocumentBuilder()
    .setTitle('Courses REST API')
    .setDescription('The courses API description')
    .setVersion('2.0')
    .addTag('courses')
    .build();

const corsOptions = {
  origin: process.env.ACCESS_CONTROL_ALLOW_ORIGIN,
  methods: 'GET, POST, OPTIONS, PUT, PATCH, DELETE'
};

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, server);

  app.enableCors(corsOptions);
  app.useStaticAssets(join(__dirname, '/../public'));
  app.init();

  const document = SwaggerModule.createDocument(app, SwaggerOptions);
  SwaggerModule.setup('api', app, document);

  if (process.env.DEVELOPMENT_MODE == 'true') { // Develop HTTP server
    await app.listen(port);
    console.log(`Server listining: http:${process.env.HOST_NAME}:${port}`);

  } else { // Production Server HTTPS
    const privateKey = fs.readFileSync(process.env.SSL_PRIVATE_KEY, 'utf8');
    const certificate = fs.readFileSync(process.env.SSL_PUBLIC_KEY, 'utf8');

    const credentials = { key: privateKey, cert: certificate };
    https.createServer(credentials, server).listen(443, () => {
      console.log(`Server listining: https:${process.env.HOST_NAME}:${port}`);
    });
  }
}
bootstrap();
