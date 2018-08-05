import { Injectable } from "@nestjs/common";
import { Model } from 'mongoose';
import { InjectModel } from "@nestjs/mongoose";
import { UserInterface } from "../interfaces";

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<UserInterface>) { }

  public async findOneByEmail(email: String): Promise<UserInterface> {
    return await this.userModel.findOne({ email }).exec();
  }

}