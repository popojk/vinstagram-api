import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { User } from './user.schema';

export type UserDocument = HydratedDocument<Post>;

@ObjectType()
@Schema()
export class Post {

  _id: mongoose.Types.ObjectId;

  @Field()
  @Prop()
  author: User;

  @Field()
  @Prop()
  text: string;

  @Field()
  @Prop()
  image: string;

  @Field()
  @Prop()
  createdAt: Date;

}

export const UserSchema = SchemaFactory.createForClass(User);