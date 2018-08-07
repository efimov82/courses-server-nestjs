import { UserSchema } from './../authenticate/schemas/user.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CoursesController } from './controllers/courses.controller';
import { CoursesService } from './services/courses.service';
import { CourseSchema } from './schemas/course.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Course', schema: CourseSchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
],
  controllers: [
    CoursesController
  ],
  providers: [
    CoursesService
  ],
})
export class CoursesModule { }