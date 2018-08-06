import { UpdateCourseDto } from './../dto/updateCourse.dto';
import { Controller, Get, Req, Post, Param, Body, FileInterceptor,
  UseInterceptors, UploadedFile, Delete, UseGuards, HttpException, HttpStatus, Put, Query
} from '@nestjs/common';
import { ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

import { CoursesService } from '../services/courses.service';
import { CreateCourseDto } from '../dto/createCourse.dto';
import { UserInterface } from 'authenticate/interfaces';

@Controller('courses')
export class CoursesController {

  constructor(private courseService: CoursesService) { }

  @Get()
  findAll(@Req() request) {
    const query = request.query['search'];
    const offset = +request.query['start'] || 0;
    const limit = +request.query['count'] || 10;

    return this.courseService.find(query, limit, offset);
  }

  @Get(':slug')
  async findOne(@Param('slug') slug) {
    return await this.courseService.findBySlug(slug);
  }

  @Post()
  @UseGuards(AuthGuard('bearer'))
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'The Course has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  // ERROR and not work -> @UsePipes(new ValidationPipe()) // { transform: true, forbidUnknownValues: true }
  @UseInterceptors(FileInterceptor('thumbnail'))
  async create(@Req() request, @UploadedFile() thumbnailFile, @Body() { authors, description, dateCreation, duration, youtubeId, topRated, title }: CreateCourseDto) {
    // TODO find better solution control input params
    let payload = {
      authors,
      description,
      dateCreation,
      duration,
      youtubeId,
      topRated,
      title,
      thumbnailFile
    };

    payload['ownerId'] = request.user['_id'];

    return await this.courseService.create(payload);
  }


  @Put(':slug')
  @UseGuards(AuthGuard('bearer'))
  @UseInterceptors(FileInterceptor('thumbnail'))

  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'The Course has been successfully updated.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async update(@Param('slug') slug, @Req() request, @Body() {authors, description, dateCreation, duration, youtubeId, topRated, title}: UpdateCourseDto, @UploadedFile() thumbnailFile){
    let payload = {
      authors,
      description,
      dateCreation,
      duration,
      youtubeId,
      topRated,
      title,
      thumbnailFile
    };

    const canEdit = await this.isUserOwner(request.user, slug);
    if (canEdit === true) {
      return await this.courseService.update(slug, payload);
    } else {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'Permission denied.',
      }, 403);
    }
  }

  @Delete(':slug')
  @UseGuards(AuthGuard('bearer'))
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'The Course has been successfully deleted.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async delete(@Req() request, @Param('slug') slug)
  {
    const canDelete = await this.isUserOwner(request.user, slug);
    if (canDelete === true) {
      await this.courseService.delete(slug);
      return {result: 'deleted'};
    } else {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'Permission denied.',
      }, 403);
    }
  }

  protected async isUserOwner(user: UserInterface, slug: String): Promise<Boolean>
  {
    const course = await this.courseService.findBySlug(slug);
    if (course && course.ownerId == user['_id']) {
      return true;
    }

    return false;
  }
}