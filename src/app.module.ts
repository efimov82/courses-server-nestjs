import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CoursesModule } from './courses/courses.module';
// import { CoursesController } from 'controllers/courses.controller';
// import { CoursesService } from 'services/courses.service';
// import { CourseSchema } from 'schemas/course.schema';

@Module({
  imports: [
    CoursesModule,
    MongooseModule.forRoot('mongodb://localhost:27017/db_courses'),
    // MongooseModule.forFeature([{ name: 'Course', schema: CourseSchema }])
  ],
  controllers: [
    AppController,
    // CoursesController
  ],
  providers: [
    AppService,
    // CoursesService
  ],
})
export class AppModule {}
