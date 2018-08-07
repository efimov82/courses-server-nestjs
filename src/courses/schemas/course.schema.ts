import * as mongoose from 'mongoose';

export const CourseSchema = new mongoose.Schema({
  slug: String,
  ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true
    },
  authors: String,
  dateCreation: Date,
  description: String,
  duration: Number,
  title: String,
  thumbnail: String,
  thumbnailFile: String,
  youtubeId: String,
  topRated: Boolean,
});