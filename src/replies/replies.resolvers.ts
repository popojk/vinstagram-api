/* import { UseGuards } from "@nestjs/common";
import { Args, Mutation, Resolver, Query, ID } from "@nestjs/graphql";
import { GqlAuthGuard } from "src/auth/GqlAuth.guard";
import { GqlCurrentUser } from "src/decorators/currentUserDecorator";
import { Reply } from "src/schemas/reply.schema";
import { RequestUser } from "src/users/interface/user.interface";
import { LikeReplyInput } from "./input/likeReply.input";
import { RepliesService } from "./replies.service";


@UseGuards(GqlAuthGuard)
@Resolver(of => Reply)
export class RepliesResolver {
  constructor(private readonly repliesService: RepliesService) { };

  @Mutation(() => Reply)
  async likeReply(
    @Args('input') input: LikeReplyInput,
    @GqlCurrentUser() user: RequestUser
  ): Promise<Reply> {
    return this.repliesService.likeReply(user.id, input.replyId);
  }

  @Mutation(() => Reply)
  async unlikeReply(
    @Args('input') input: LikeReplyInput,
    @GqlCurrentUser() user: RequestUser
  ): Promise<Reply> {
    return this.repliesService.unlikeReply(user.id, input.replyId);
  }

} */