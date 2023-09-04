import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { GqlAuthGuard } from 'src/auth/GqlAuth.guard';
import { GqlCurrentUser } from 'src/decorators/currentUserDecorator';
import { User } from 'src/schemas/user.schema';
import { FollowInput } from './input/follow.input';
import { RequestUser } from './interface/user.interface';
import { UsersService } from './users.service';

@UseGuards(GqlAuthGuard)
@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UsersService) {};

  @Query(() => User)
  async user(
    @Args('id', { type: () => ID }) id: string, 
    @GqlCurrentUser() user: User): Promise<User> {
    return this.userService.findUser(id);
  }

  @Mutation(() => User)
  async follow(
    @Args('input') input: FollowInput,
    @GqlCurrentUser() user: RequestUser
  ): Promise<User> {
    return this.userService.addFollowing(user.id, input.followId);
  }

  @Mutation(() => User)
  async unFollow(
    @Args('input') input: FollowInput,
    @GqlCurrentUser() user: RequestUser
  ): Promise<User> {
    return this.userService.deleteFollowing(user.id, input.followId);
  }

}