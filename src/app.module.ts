import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { UsersModule } from './users/users.module';
import { PostsController } from './posts/posts.controller';
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
