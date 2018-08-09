import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  slug: String,
  email: String,
  password: String,
  nickname: String,
  roles: String,
  avatar: String,
});