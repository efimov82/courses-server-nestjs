import { HttpStrategy } from './../authenticate/http.strategy';
import { AuthService } from './../authenticate/services/auth.service';
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { ProfileController } from './controllers/profile.controller';
import { UserService } from './../authenticate/services/users.service';
import { UserSchema } from './../authenticate/schemas/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [
    ProfileController
  ],
  providers: [
    AuthService,
    HttpStrategy,
    UserService,
  ],
})
export class ProfileModule { }