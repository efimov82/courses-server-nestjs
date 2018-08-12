import { Injectable } from "@nestjs/common";
import { UserInterface } from "../interfaces";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt-nodejs';
import { UserService } from "./users.service";

@Injectable()
export class AuthService {
  secret: String;
  constructor(private usersService: UserService) {
    this.secret = process.env.JWT_SECRET;
   }

  public async login(email: String = '', password: String): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      return false;
    }

    try {
      if (bcrypt.compareSync(password, user.password)) {
        const token = await this.createToken(user);
        return { user, token }
      } else {
        return false;
      }
    } catch(exception) {
      console.log('Exception: '+exception);
      return false;
    }
  }

  public async validateToken(jwtToken: String): Promise<any> {
    let decoded: JwtPayload = null;
    try {
      decoded = jwt.verify(jwtToken, this.secret);
    } catch (err) {
      return new Error(err.message);
    }

    if (decoded) {
      return await this.usersService.findOneByEmail(decoded.email);
    } else {
      return false;
    }
  }

  public async isPasswordValid(id: String = '',password: String): Promise<any> {
    const user = await this.usersService.findOneById(id);

    if (!user) {
      return false;
    }

    try {
      return bcrypt.compareSync(password, user.password);
    } catch(exception) {
      console.log('Exception: '+exception);
      return false;
    }
  }

  protected async createToken(user: UserInterface): Promise<String> {
    const data = <JwtPayload>{
      id: user._id,
      email: user.email,
      nickname: user.nickname,
      roles: user.roles
    };
    const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

    return jwt.sign(data, this.secret, { expiresIn });
  }

}