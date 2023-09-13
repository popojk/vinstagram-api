import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver, Query, ID } from "@nestjs/graphql";
import { GqlAuthGuard } from "src/auth/GqlAuth.guard";
import { GqlCurrentUser } from "src/decorators/currentUserDecorator";
import { LikeReplyInput } from "src/replies/input/likeReply.input";
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
  async findPosts(@GqlCurrentUser() user: RequestUser): Promise<Post[]> {
    return this.postsService.findPosts(user);
  }

  @Query(() => [Post])
  async findPost(
    @Args('post_id', { type: () => ID }) postId: string,
    @GqlCurrentUser() user: RequestUser
    ) {
    return this.postsService.findPostById(postId, user);
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

  @Mutation(() => Post)
  async likeReply(
    @Args('input') input: LikeReplyInput,
    @GqlCurrentUser() user: RequestUser
  ): Promise<Reply> {
    return this.postsService.likeReply(user.id, input.postId ,input.replyId);
  }

  @Mutation(() => Post)
  async unlikeReply(
    @Args('input') input: LikeReplyInput,
    @GqlCurrentUser() user: RequestUser
  ): Promise<Reply> {
    return this.postsService.unlikeReply(user.id, input.postId, input.replyId);
  }


}