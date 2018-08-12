import { UserInterface } from 'authenticate/interfaces';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import {
  Controller, Get, Param, Put,
  UseGuards, FileInterceptor,
  UseInterceptors, Req, Body,
  UploadedFile, HttpException, HttpStatus
} from '@nestjs/common';

import { UserService } from './../../authenticate/services/users.service';
import { AuthService } from './../../authenticate/services/auth.service';
import { UpdateProfileDto } from './../dto/updateProfile.dto';


@Controller('profile')
export class ProfileController {
  pathToImages = '/images/avatars/';

  constructor(private authService: AuthService,
    private userService: UserService) {}

  @Get(':slug')
  async findOne(@Param('slug') slug) {
    const user = await this.userService.findOneBySlug(slug);
    return this.createResponce(user);
  }

  @Put()
  @UseGuards(AuthGuard('bearer'))
  @UseInterceptors(FileInterceptor('avatar'))

  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: 'Profile successfully updated.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async update(
    @Req() request,
    @Body() {nickname, email, password, newPassword}: UpdateProfileDto,
    @UploadedFile() avatarFile
  ){
    const userId = request.user['_id'];
    if (await this.authService.isPasswordValid(userId, password)) {
      const payload = {
        nickname,
        email,
        newPassword,
        avatarFile
      };

      const user = await this.userService.updateProfile(userId, payload);
      return this.createResponce(user);
    } else {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'Wrong password.',
      }, 403);
    }
  }

  private createResponce(user: UserInterface): any {
    return {
      avatar: this.pathToImages + user['avatar'],
      slug: user['slug'],
      email: user['email'],
      nickname: user['nickname'],
      roles: user['roles'],
    }
  }
}