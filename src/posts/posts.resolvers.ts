import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver, Query } from "@nestjs/graphql";
import { GqlAuthGuard } from "src/auth/GqlAuth.guard";
import { GqlCurrentUser } from "src/decorators/currentUserDecorator";
import { Post } from "src/schemas/post.schema";
import { RequestUser } from "src/users/interface/user.interface";
import { LikePostInput } from "./input/post.input";
import { PostsService } from "./posts.service";


@UseGuards(GqlAuthGuard)
@Resolver(of => Post)
export class PostResolver {
  constructor(private readonly postsService: PostsService) { };

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

}