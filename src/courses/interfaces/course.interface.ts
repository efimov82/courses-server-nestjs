import { Document } from 'mongoose';

export interface CourseInterface  extends Document {
  // id: Number,
  readonly slug: String,
  readonly authors: String,
  readonly dateCreation: Date,
  readonly description: String,
  readonly duration: Number,
  readonly title: String,
  readonly thumbnail: String,
  readonly thumbnailFile: String,//FileInput,
  readonly youtubeId: String,
  readonly topRated: Boolean,
  readonly ownerId: String,
}