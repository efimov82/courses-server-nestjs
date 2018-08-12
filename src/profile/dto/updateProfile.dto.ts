import { ApiModelProperty } from '@nestjs/swagger';
export class UpdateProfileDto {

  @ApiModelProperty()
  readonly nickname: String;

  @ApiModelProperty()
  readonly email: String;

  @ApiModelProperty()
  readonly password: String;

  @ApiModelProperty()
  readonly newPassword: String;
}