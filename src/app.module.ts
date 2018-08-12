import { ProfileModule } from './profile/profile.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './authenticate/authenticate.module';
import { CoursesModule } from './courses/courses.module';

import { AppController } from './app.controller';

import * as dotenv from 'dotenv';
dotenv.config();

const DB_HOST = process.env.DB_HOST;

@Module({
  imports: [
    AuthModule,
    CoursesModule,
    ProfileModule,
    MongooseModule.forRoot(DB_HOST),
  ],
  controllers: [
    AppController,
  ],
  providers: [
  ],
})
export class AppModule {}
