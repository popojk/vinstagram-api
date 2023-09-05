import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { imgurFileHandler } from 'src/helpers/file-helpers';
import { Post } from 'src/schemas/post.schema';
import { Reply } from 'src/schemas/reply.schema';
import { RequestUser } from 'src/users/interface/user.interface';
import { UsersService } from 'src/users/users.service';
import { CreatePostDto } from './dto/post.dto';
import { CreateReplyInput } from './input/reply.input';

@Injectable()
export class PostsService {

  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(Reply.name) private replyModel: Model<Reply>,
    private usersService: UsersService
    ) {};

  async findPosts(): Promise<Post[]> {
    const posts: Post[] = await this.postModel.find();
    return posts;
  }

  async findPostById (postId: string) {
    const post = await this.postModel.findById(postId);
    return post;
  }

  async createPost(file: any, createPostDto: CreatePostDto, currentUser: RequestUser){
    if (file === undefined) throw new HttpException('必須上傳照片', HttpStatus.BAD_REQUEST)
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

  //like a post
  async likePost(currentUserId: string, postId: string): Promise<Post> {
    let currentUser = await this.usersService.findUserById(currentUserId);
    let post = await this.postModel.findById(postId);

    post.likers.push(currentUser);
    post.save()

    return post;
  }

  //unlike a post
  async unlikePost(currentUserId: string, postId: string): Promise<Post> {

    let post = await this.postModel.findByIdAndUpdate(postId,
      { $pull: { likers: currentUserId } },
      { new: true }
      );

    return post;
  }

  //create reply
  async createReply(currentUserId: string, postId: string, createReplyInput: CreateReplyInput): Promise<Reply> {
    let author = await this.usersService.findUserById(currentUserId);
    let reply = await new this.replyModel({
      author,
      text: createReplyInput.text
    }).save()
    let post = await this.postModel.findById(postId);

    post.replies.push(reply)
    post.save()
    return reply;
  }
}
