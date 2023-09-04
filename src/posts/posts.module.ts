import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from 'src/schemas/post.schema';
import { UsersModule } from 'src/users/users.module';
import { PostsController } from './posts.controller';
import { PostResolver } from './posts.resolvers';
import { PostsService } from './posts.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    UsersModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, PostResolver]
})
export class PostsModule {}
