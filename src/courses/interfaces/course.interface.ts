import { Document } from 'mongoose';

export interface CourseInterface  extends Document {
  readonly _id: Number,
  readonly slug: String,
  readonly dateCreation: Date,
  readonly thumbnailFile: String,//FileInput,

  authors: String,
  description: String,
  duration: Number,
  title: String,
  thumbnail: String,
  youtubeId: String,
  topRated: Boolean,
  ownerId: String,
  owner: any,

  save();
}