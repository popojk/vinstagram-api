import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';

export type UserDocument = HydratedDocument<User>;

@ObjectType()
@Schema()
export class User {

  @Field(() => ID)
  //@Prop()
  _id: mongoose.Types.ObjectId;
  
  @Field()
  @Prop()
  name: string;

  @Field()
  @Prop()
  username: string;

  @Field()
  @Prop()
  password: string;

  @Field()
  @Prop()
  avatar?: string;

  @Field(type => [User])
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }] })
  following: User[];

  @Field(type => [User])
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: User.name }] })
  follower: User[];

}

export const UserSchema = SchemaFactory.createForClass(User);