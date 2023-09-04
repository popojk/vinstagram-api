import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true
    }),
    UsersModule, 
    PostsModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot('mongodb://root:password@localhost:27016/vinstagram?authSource=admin'),
    AuthModule
  ],
  //controllers: [AppController, UsersController, PostsController],
  //providers: [AppService, UsersService],
})
export class AppModule {}
