import { Document } from 'mongoose';

export interface UserInterface extends Document {
  readonly _id: String,
  readonly slug: String,
  readonly nickname: String,
  readonly email: String,
  readonly password: String,
  readonly roleId: Number
}