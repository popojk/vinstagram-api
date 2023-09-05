import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver, Query, ID } from "@nestjs/graphql";
import { GqlAuthGuard } from "src/auth/GqlAuth.guard";
import { GqlCurrentUser } from "src/decorators/currentUserDecorator";
import { Post } from "src/schemas/post.schema";
import { Reply } from "src/schemas/reply.schema";
import { RequestUser } from "src/users/interface/user.interface";
import { LikePostInput } from "./input/post.input";
import { CreateReplyInput } from "./input/reply.input";
import { PostsService } from "./posts.service";


@UseGuards(GqlAuthGuard)
@Resolver(of => Post)
export class PostResolver {
  constructor(private readonly postsService: PostsService) { };

  @Query(() => [Post])
  async findPosts(): Promise<Post[]> {
    return this.postsService.findPosts();
  }

  @Query(() => Post)
  async findPost(@Args('post_id', { type: () => ID }) postId: string): Promise<Post> {
    return this.postsService.findPostById(postId);
  }

  @Mutation(() => Post)
  async likePost(
    @Args('input') input: LikePostInput,
    @GqlCurrentUser() user: RequestUser
  ): Promise<Post> {
    return this.postsService.likePost(user.id, input.postId);
  }

  @Mutation(() => Post)
  async unlikePost(
    @Args('input') input: LikePostInput,
    @GqlCurrentUser() user: RequestUser
  ): Promise<Post> {
    return this.postsService.unlikePost(user.id, input.postId);
  }

  @Mutation(() => Reply)
  async createReply(
    @Args('input') input: CreateReplyInput,
    @GqlCurrentUser() user: RequestUser
  ): Promise<Reply> {
    return this.postsService.createReply(user.id, input.postId, input);
  }

}