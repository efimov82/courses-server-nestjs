import { ApiModelProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber } from "class-validator";
// import { IsInt, IsString, IsNumber } from 'class-validator';

export class CreateCourseDto {

  @ApiModelProperty()
  readonly title: String;

  @ApiModelProperty()
  readonly description: String;

  @ApiModelProperty()
  readonly authors?: String;

  // @ApiModelProperty()
  // readonly slug: String;

  @ApiModelProperty()
  readonly dateCreation: Date;

  // @ApiModelProperty()
  // readonly ownerId: String;

  @ApiModelProperty()
  // @IsNumber()
  readonly duration: Number;

  @ApiModelProperty()
  readonly thumbnail?: string;
  // thumbnailFile: FileInput;
  @ApiModelProperty()
  readonly youtubeId: String;

  @ApiModelProperty()
  readonly topRated: Boolean = false;
}