import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthController } from "./controllers/auth.controller";
import { AuthService } from "./services/auth.service";
import { UserSchema } from "./schemas/user.schema";
import { UserService } from "./services/users.service";
import { HttpStrategy } from "./http.strategy";

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  controllers: [
    AuthController
  ],
  providers: [
    AuthService,
    HttpStrategy,
    UserService,
  ],
})
export class AuthModule { }