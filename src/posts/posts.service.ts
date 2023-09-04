import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { imgurFileHandler } from 'src/helpers/file-helpers';
import { Post } from 'src/schemas/post.schema';
import { RequestUser } from 'src/users/interface/user.interface';
import { UsersService } from 'src/users/users.service';
import { CreatePostDto } from './dto/post.dto';

@Injectable()
export class PostsService {

  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    private usersService: UsersService
    ) {};

  async findPosts (){
    
  }

  async createPost(file: any, createPostDto: CreatePostDto, currentUser: RequestUser){
    if (file === undefined) throw new Error('必須上傳照片')
    const image = await imgurFileHandler(file);
    const author = await this.usersService.findUserByUsername(currentUser.username);
    const createdPost = await new this.postModel({
      author,
      text: createPostDto.text,
      image,
      createdAt: Date.now()
    })
    return createdPost.save();
  }
}
