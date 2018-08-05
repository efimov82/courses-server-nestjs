import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import * as fs from 'fs';

import { UserInterface } from './../../authenticate/interfaces';
import { CourseInterface } from '../interfaces';
import { CreateCourseDto } from '../dto/createCourse.dto';

@Injectable()
export class CoursesService {
  constructor(@InjectModel('Course') private readonly courseModel: Model<CourseInterface>) { }

  async create(owner: UserInterface, data: CreateCourseDto): Promise<CourseInterface | Error> {
    try {
      const slug = await this.getUnicSlug();

      if (data.thumbnailFile) {
        data.thumbnail = await this.uploadFile(slug, data.thumbnailFile);
        delete data.thumbnailFile;
      }

      const course = new this.courseModel(data);
      course.slug = slug;
      course.ownerId = owner['_id'];
      return await course.save();

    } catch (exception) {

      const errors = [];
      console.log(exception);

      Object.keys(exception.errors).forEach(field => {
        errors.push(field);
      })
      console.log('Catch error. Wrong values for fileds:', errors);
      // TODO find way for return all errors to client
      return new Error(errors[0]);
    }
  }

  async find(search: string = '', limit: Number = 10, offset: Number = 0): Promise<any> {
    let query = null;
    if (search) {
      const regexp = new RegExp(search, 'i');
      query = {
        $or: [
          { 'title': regexp },
          { 'description': regexp }
        ],
      };
    }

    const items = await this.courseModel.find(query).limit(limit).skip(offset).exec();
    const path = '/images/courses/';
    items.forEach(item => {
      item.thumbnail = path + (item.thumbnail ? item.thumbnail : 'default.png');
    });
    const res = {
      items: items,
      count: items.length,
      all: items.length
    };

    return res;
  }

  public async delete(slug: String) {
    return await this.courseModel.findOneAndDelete({ slug }).exec();
  }

  public async findBySlug(slug: String): Promise<CourseInterface> {
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

  /**
   * @param slugLength Number
   * @return String
   */
  private generateSlug(slugLength: Number = 8) {
    let res = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < slugLength; i++)
      res += possible.charAt(Math.floor(Math.random() * possible.length));

    return res;
  }

  /**
   * @param slug
   * @param thumbnail UploadedFile{ fieldname: String,
   *       originalname: String,
   *       encoding: '7bit',
   *       mimetype: 'image/png',
   *       buffer: Buffer
   *       size: Number }
   *     }
   */
  private async uploadFile(slug: String, thumbnail: any) { // UploadedFile
    const filename = slug + '.' + thumbnail['originalname'].slice(-3);
    const buffer = <Buffer>thumbnail.buffer;

    // TODO check Mimetype
    await fs.writeFile(__dirname + '/../../../public/images/courses/'+filename, buffer, null, (error) => {
      // TODO check error upload
      if (error) {
        console.log('Error copy uploaded file:' + error);
        return '';
      }
    });

    return filename;
  }
}