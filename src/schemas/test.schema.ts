import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Field, ObjectType } from '@nestjs/graphql';

export type TestDocument = HydratedDocument<Test>;

@ObjectType()
@Schema()
export class Test {

  @Field()
  @Prop()
  text: string;

}

export const TestSchema = SchemaFactory.createForClass(Test);