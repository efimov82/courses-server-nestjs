import { Controller, Get, Req, Post, Param, Body } from '@nestjs/common';
import { CoursesService } from '../services/courses.service';

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
  async create(@Body() data: any) {
    return await this.courseService.create(data);
  }
}