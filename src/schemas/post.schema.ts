import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { User } from './user.schema';
import { Reply } from './reply.schema';

export type UserDocument = HydratedDocument<Post>;

@ObjectType()
@Schema()
export class Post {

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
  @Prop()
  likers: User[]

  @Field(type => [Reply])
  @Prop()
  replies: Reply[]

  @Field()
  @Prop()
  createdAt: Date;

}

export const PostSchema = SchemaFactory.createForClass(Post);