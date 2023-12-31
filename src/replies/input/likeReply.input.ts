import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class LikeReplyInput {

  @IsNotEmpty()
  @Field()
  replyId: string

  @IsNotEmpty()
  @Field()
  postId: string

}