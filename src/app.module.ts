import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './authenticate/authenticate.module';
import { CoursesModule } from './courses/courses.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    AuthModule,
    CoursesModule,
    MongooseModule.forRoot('mongodb://localhost:27017/db_courses'),
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
  ],
})
export class AppModule {}
