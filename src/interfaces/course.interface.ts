export interface CourseInterface {
  id: Number,
  slug: String,
  authors: String,
  dateCreation: Date,
  description: String,
  duration: Number,
  title: String,
  thumbnail: String,
  thumbnailFile: String,//FileInput,
  youtubeId: String,
  topRated: Boolean,
  ownerId: String,
}