import { Document } from 'mongoose';

export interface UserInterface extends Document {
  readonly _id: String,
  readonly slug: String,

  avatar: String,
  email: String,
  password: String,
  roles: String,
  nickname: String,

  save();
}