import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from './user.schema';

export type ReplyDocument = HydratedDocument<Reply>;

@ObjectType()
@Schema()
export class Reply {

  @Field(() => ID)
  _id: mongoose.Types.ObjectId;

  @Field()
  @Prop()
  author: User;

  @Field()
  @Prop()
  text: string;

  @Field(type => [User])
  //@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }] })
  @Prop()
  likers: User[];

  @Field()
  @Prop()
  isLiked?: boolean;

}

export const ReplySchema = SchemaFactory.createForClass(Reply);