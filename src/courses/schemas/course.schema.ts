import * as mongoose from 'mongoose';

export const CourseSchema = new mongoose.Schema({
  id: Number,
  slug: String,
  ownerId: String,
  authors: String,
  dateCreation: Date,
  description: String,
  duration: Number,
  title: String,
  thumbnail: String,
  thumbnailFile: String,//FileInput,
  youtubeId: String,
  topRated: Boolean,
});