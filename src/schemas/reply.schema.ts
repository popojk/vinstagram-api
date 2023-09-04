import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { User } from './user.schema';

export type UserDocument = HydratedDocument<Reply>;

@ObjectType()
@Schema()
export class Reply {

  _id: mongoose.Types.ObjectId;

  @Field()
  @Prop()
  author: User;

  @Field()
  @Prop()
  text: string;


}

export const UserSchema = SchemaFactory.createForClass(User);