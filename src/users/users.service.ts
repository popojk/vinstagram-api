import { Body, HttpException, HttpStatus, Injectable, UploadedFile } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User, UserSchema } from '../schemas/user.schema';
import { CreateUserInput } from './dto/create-user.dto';
import { imgurFileHandler } from 'src/helpers/file-helpers';
import { CurrentUser } from 'src/decorators/currentUserDecorator';
import { PostsService } from 'src/posts/posts.service';
import { Post } from 'src/schemas/post.schema';
const bcrypt = require('bcrypt');

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>
    ) {};

  async createUser(createUserInput: CreateUserInput, file: any): Promise<User> {
    const checkUser = await this.userModel.findOne({ username: createUserInput.username })
    if (checkUser) {
      throw new HttpException('帳號已存在', HttpStatus.BAD_REQUEST)
    }
    const avatar = await imgurFileHandler(file);
    const hash = await bcrypt.hash(createUserInput.password, 10);
    
    if(file !== undefined) {
      const createdUser = await new this.userModel({
        name: createUserInput.name,
        username: createUserInput.username,
        password: hash,
        avatar});
      return createdUser.save();
    } else {
      const createdUser = await new this.userModel({
        name: createUserInput.name,
        username: createUserInput.username,
        passord: hash
      });
      return createdUser.save();
    }
  }

  async findUserById(userId: string): Promise<User> {
    const user = await this.userModel.findById(userId);
    return user;
  }

  async findUserByUsername(username: string): Promise<User> {
    const user = await this.userModel.findOne({ username });
    return user;
  }

  async findRecommendUsers(currentUserId: string): Promise<User[]> {
    let currentUser = await this.userModel.findById(currentUserId);
    const users = await this.userModel.find({
      _id: {
        $ne: new mongoose.Types.ObjectId(currentUserId),
        $nin: currentUser.following
      },
    });
    return users;
  }

  async findUser(id: string): Promise<User> {
    const user = await this.userModel.findById({ _id: id })
    .populate({ path: 'follower', model: 'User' })
    .populate({ path: 'following', model: 'User' })
    .exec();

    return user;
  }

  // add following to a user
  async addFollowing(currentUserId: string ,followingId: string): Promise<User> {
    let currentUser = await this.userModel.findById(currentUserId);
    let followingUser = await this.userModel.findById(followingId);

    currentUser.following.push(followingUser);
    followingUser.follower.push(currentUser);

    currentUser.save();
    followingUser.save();

    return followingUser;
  }

  // cancel following an user
  async deleteFollowing(currentUserId: string, followingId: string): Promise<User> {
    let currentUser = await this.userModel.findByIdAndUpdate(currentUserId,
      { $pull: { following: followingId } },
      { new: true }
      );

    let followingUser = await this.userModel.findByIdAndUpdate(followingId,
      { $pull: { follower: currentUserId } },
      { new: true }
    );

    return followingUser;
  }

  
  

}
