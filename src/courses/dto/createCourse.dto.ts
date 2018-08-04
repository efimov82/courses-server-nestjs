import { ApiModelProperty } from "@nestjs/swagger";
// import { Transform } from "class-transformer";
// import { IsNumber } from "class-validator";
// import { IsInt, IsString, IsNumber } from 'class-validator';

export class CreateCourseDto {

  @ApiModelProperty()
  readonly title: String;

  @ApiModelProperty()
  readonly description: String;

  @ApiModelProperty()
  readonly authors?: String = '';

  @ApiModelProperty()
  readonly dateCreation: Date = new Date();

  @ApiModelProperty()
  readonly duration: Number = 0;

  @ApiModelProperty()
  thumbnail?: string = '';

  @ApiModelProperty()
  thumbnailFile?: any = null; // BinaryType? Blob?

  @ApiModelProperty()
  readonly youtubeId: String = '';

  @ApiModelProperty()
  readonly topRated: Boolean = false;
}