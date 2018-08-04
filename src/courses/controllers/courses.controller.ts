import { Controller, Get, Req, Post, Param, Body, UsePipes, ValidationPipe } from '@nestjs/common';
import { CoursesService } from '../services/courses.service';
import { CreateCourseDto } from '../dto/createCourse.dto';
import { ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ValidPipe } from './valid.pipe';
// import { PropertyValidationPipe } from './propertyValidationPipe';

@Controller('courses')
export class CoursesController {

  constructor(private courseService: CoursesService) { }

  @Get()
  findAll(@Req() request) {
    return this.courseService.findAll();
  }

  @Get(':slug')
  async findOne(@Param('slug') slug) {
    return await this.courseService.findBySlug(slug);
  }

  @Post()
  @ApiBearerAuth()
  @ApiResponse({ status: 201, description: 'The Course has been successfully created.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  // ERROR and not work -> @UsePipes(new ValidationPipe()) // { transform: true, forbidUnknownValues: true }
  async create(@Body() { authors, description, dateCreation, duration, youtubeId, topRated, title }: CreateCourseDto) {
    // TODO find better solution
    const payload = { authors, description, dateCreation, duration, youtubeId, topRated, title };

    return await this.courseService.create(payload);
  }
}