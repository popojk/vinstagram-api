import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    UsersModule, 
    PostsModule,
    MongooseModule.forRoot('mongodb://root:password@localhost:27016/vinstagram?authSource=admin')
  ],
  //controllers: [AppController, UsersController, PostsController],
  //providers: [AppService, UsersService],
})
export class AppModule {}
