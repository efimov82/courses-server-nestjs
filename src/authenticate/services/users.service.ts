import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose';

import * as fs from 'fs';
import * as bcrypt from 'bcrypt-nodejs';

import { UserInterface } from "../interfaces";

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private readonly userModel: Model<UserInterface>) { }

  public async findOneByEmail(email: String): Promise<UserInterface> {
    return await this.userModel.findOne({ email }).exec();
  }

  public async findOneBySlug(slug: String): Promise<UserInterface> {
    return await this.userModel.findOne({ slug }).exec();
  }

  public async findOneById(id: String): Promise<UserInterface> {
    return await this.userModel.findOne({ '_id': id }).exec();
  }

  public async updateProfile(userId: String, data: any): Promise<any | Error> {
    let user = await this.findOneById(userId);

    if (data.avatarFile) {
      user.avatar = await this.uploadAvatar(user.slug, data.avatarFile);
    }

    if (data.newPassword) {
      user.password = bcrypt.hashSync(data.newPassword);
    }

    user.nickname = data.nickname;

    if (data.email && (user.email != data.email)) {
      const userByEmail = await this.findOneByEmail(data.email);
      if (!userByEmail) {
        user.email = data.email;
      } else {
        return new Error('Email already exist.');
      }
    }

    return await user.save();;
  }

  /**
   * @param slug
   * @param avatar UploadedFile{ fieldname: String,
   *       originalname: String,
   *       encoding: '7bit',
   *       mimetype: 'image/png',
   *       buffer: Buffer
   *       size: Number }
   *     }
   */
  private async uploadAvatar(slug: String, avatar: any) { // UploadedFile
    const filename = slug + '.' + avatar['originalname'].slice(-3);
    const buffer = <Buffer>avatar.buffer;

    // TODO check Mimetype
    await fs.writeFile(__dirname + '/../../../public/images/avatars/'+filename, buffer, null, (error) => {
      // TODO check error upload
      if (error) {
        console.log('Error copy uploaded file:' + error);
        return '';
      }
    });

    return filename;
  }
}