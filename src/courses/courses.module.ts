import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesController } from './controllers/courses.controller';
import { CoursesService } from './services/courses.service';
import { CourseSchema } from './schemas/course.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Course', schema: CourseSchema }])],
  controllers: [
    CoursesController
  ],
  providers: [
    CoursesService
  ],
})
export class CoursesModule { }