import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from './user.schema';
import { Reply } from './reply.schema';

export type PostDocument = HydratedDocument<Post>;

@ObjectType()
@Schema()
export class Post {

  @Field(() => ID)
  _id: mongoose.Types.ObjectId;

  @Field(type => User)
  @Prop()
  author: User;

  @Field()
  @Prop()
  text: string;

  @Field()
  @Prop()
  image: string;

  @Field(type => [User])
  //@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }] })
  @Prop()
  likers: User[]

  @Field(type => [Reply])
  @Prop()
  replies: Reply[]

  @Field(() => String)
  @Prop()
  createdAt: Date;

  @Field()
  @Prop()
  isLiked?: boolean;
}

export const PostSchema = SchemaFactory.createForClass(Post);