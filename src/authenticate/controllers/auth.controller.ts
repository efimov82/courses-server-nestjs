import { Controller, Post, Req } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { AuthService } from '../services/auth.service';

@Controller('auth')
export class AuthController {
  pathToImages = '/images/avatars/';
  defaultAvatar = 'default.png';

  constructor(private authService: AuthService) { }

  @Post('signin')
  @ApiResponse({ status: 200, description: 'Authorization successfully.' })
  @ApiResponse({ status: 401, description: 'Authorization fails.' })
  async signin(@Req() request) {
    const email = request.body['email'];
    const password = request.body['password'];

    const data = await this.authService.login(email, password);
    if (data) {
      return {
        success: true,
        nickname: data.user['nickname'],
        avatar: this.pathToImages + ( data.user['avatar'] || this.defaultAvatar ),
        token: "Bearer " + data.token,
      }
    } else {
      return {
        success: false,
        message: 'Authentication failed.'
      }
    }
  }
}