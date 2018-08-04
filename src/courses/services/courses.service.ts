import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';
import { CourseInterface } from "../interfaces/course.interface";
import { CreateCourseDto } from "../dto/createCourse.dto";

@Injectable()
export class CoursesService {
  constructor(@InjectModel('Course') private readonly courseModel: Model<CourseInterface>) { }

  // data: CreateCourseDto - in real don't matter 'any' or 'someDtoType'
  async create(data: CreateCourseDto): Promise<CourseInterface | Error> {
    // let data2 = <CourseInterface>data;
    // console.log(data2);

    const course = new this.courseModel(data);

    try {
      course.slug = await this.getUnicSlug();
      await course.save();

    } catch (exception) {
      const errors = [];
      Object.keys(exception.errors).forEach(field => {
        errors.push(field);
      })
      console.log('Catch error. Wrong values for fileds:', errors);
      // TODO find way for return all errors to client
      return new Error(errors[0]);
    }

    return course;
  }

  async findAll(): Promise<CourseInterface[]> {
    return await this.courseModel.find().exec();
  }

  async findBySlug(slug): Promise<CourseInterface> {
    return await this.courseModel.findOne({ slug }).exec();
  }

  private async getUnicSlug() {
    let slug = '';
      do {
        slug = this.generateSlug();
        let course = await this.findBySlug(slug);
        if (!course) {
          break;
        }
      } while (true);

    return slug;
  }

  private generateSlug(slugLength = 8) {
    let res = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < slugLength; i++)
      res += possible.charAt(Math.floor(Math.random() * possible.length));

    return res;
  }
}