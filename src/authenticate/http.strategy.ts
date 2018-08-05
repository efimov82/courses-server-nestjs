import { Strategy } from 'passport-http-bearer';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UserInterface} from './interfaces';

@Injectable()
export class HttpStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(token: any, done: Function) {
    const user = await this.authService.validateToken(token);

    if (!user || user instanceof Error) {
      return done(new UnauthorizedException(), false);
    }

    done(null, user);
  }
}