import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { RepliesModule } from './replies/replies.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      path: '/api/graphql',
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true
    }),
    UsersModule, 
    PostsModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URL as string),
    AuthModule,
    RepliesModule
  ],
  //controllers: [AppController, UsersController, PostsController],
  //providers: [AppService, UsersService],
})
export class AppModule {}
