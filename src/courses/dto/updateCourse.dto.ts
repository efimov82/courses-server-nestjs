import { ApiModelProperty } from "@nestjs/swagger";

export class UpdateCourseDto {

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