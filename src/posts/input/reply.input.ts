import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class CreateReplyInput {

  @IsNotEmpty()
  @Field()
  postId: string

  @IsNotEmpty()
  @Field()
  text: string

}