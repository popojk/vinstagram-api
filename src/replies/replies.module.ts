import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Reply, ReplySchema } from 'src/schemas/reply.schema';
import { UsersModule } from 'src/users/users.module';
import { RepliesController } from './replies.controller';
import { RepliesResolver } from './replies.resolvers';
import { RepliesService } from './replies.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Reply.name, schema: ReplySchema }]),
    UsersModule,
  ],
  controllers: [RepliesController],
  providers: [RepliesService, RepliesResolver]
})
export class RepliesModule {}
