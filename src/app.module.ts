import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './authenticate/authenticate.module';
import { CoursesModule } from './courses/courses.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import * as dotenv from 'dotenv';
dotenv.config();

const DB_HOST = process.env.DB_HOST;

@Module({
  imports: [
    AuthModule,
    CoursesModule,
    MongooseModule.forRoot(DB_HOST),
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
  ],
})
export class AppModule {}
