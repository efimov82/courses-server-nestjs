import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import * as fs from 'fs';

import { UserInterface } from './../../authenticate/interfaces';
import { CourseInterface } from '../interfaces';
import { CreateCourseDto } from '../dto/createCourse.dto';
import { isObject } from 'util';

@Injectable()
export class CoursesService {
  pathToImages = '/images/courses/';

  constructor(
    @InjectModel('Course') private readonly courseModel: Model<CourseInterface>,
    @InjectModel('User') private readonly userModel: Model<UserInterface>
  ) { }

  async create(data: CreateCourseDto): Promise<CourseInterface | Error> {
    try {
      const slug = await this.getUnicSlug();

      if (data.thumbnailFile) {
        data.thumbnail = await this.uploadFile(slug, data.thumbnailFile);
        delete data.thumbnailFile;
      }

      const course = new this.courseModel(data);
      course.slug = slug;
      await course.save();

      course.thumbnail = this.getThumbmailPath(course.thumbnail);
      return course;

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

  async update(slug: String, data: CreateCourseDto): Promise<CourseInterface | Error> {
    const course = await this.findBySlug(slug);
    if (!course) {
      return new Error('Course not found.');
    }

    if (data.thumbnailFile) {
      course.thumbnail = await this.uploadFile(course.slug, data.thumbnailFile);
      delete data.thumbnailFile;
    }

    // TODO find better way
    course.authors = data.authors;
    course.description = data.description;
    course.duration = data.duration;
    course.title = data.title;
    course.youtubeId = data.youtubeId;
    course.topRated = data.topRated;

    await course.save();
    course.thumbnail = this.getThumbmailPath(course.thumbnail);

    return course;
  }

  async find(search: string = '', limit: Number = 10, skip: Number = 0): Promise<any> {
    const query = this.createQuery(search);
    const countAll = await this.courseModel.find(query).count().exec();
    const courses = await this.courseModel.aggregate([
      {
        $lookup:{
          from: 'users',
          localField: 'ownerId',
          foreignField: '_id',
          as: 'owners'
        }
      },
      {
        $project:{
          _id: 0,
          slug: 1,
          authors: 1,
          dateCreation: 1,
          description: 1,
          duration: 1,
          title: 1,
          thumbnail: 1,
          youtubeId: 1,
          topRated: 1,
          ownerId: 1,
          owners: {
            _id: 1,
            email: 1,
            nickname: 1,
          }
        }
      },
      {
        $match: query
      },
      { $skip: skip },
      { $limit : limit }

    ])
    .exec();

    courses.forEach(course => {
      course.thumbnail = this.getThumbmailPath(course.thumbnail);
      course.owner = course.owners[0] || null;
      delete course.owners;
    });

    return {
      items: courses,
      all: countAll
    };
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

  private createQuery(search: string): Object {
    if (search == '') {
      return {};
    }

    const regexp = new RegExp(search, 'i');
    return {
        $or: [
          { 'title': regexp },
          { 'description': regexp }
        ]
      }
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

  private getThumbmailPath(name: String): String {
    return this.pathToImages + (name ? name : 'default.png');
  }
}