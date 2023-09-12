import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CurrentUser } from 'src/decorators/currentUserDecorator';
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
  ) { };

  async findPosts(currentUser: RequestUser): Promise<Post[]> {
    // const posts: Post[] = await this.postModel.find();
    /*const posts: Post[] = await this.postModel.aggregate([
      {
        "$project": {
          "_id":1,
          "author":1,
          "text": 1,
          "image":1,
          "likers": 1,
          "replies": {
            "_id":1,
            "author": 1,
            "text": 1,
            "likers": 1,
            "isLiked": { "$in": [new mongoose.Types.ObjectId(currentUser.id), "$replies.likers._id"] }
          },
          "createdAt":1,
          "isLiked": { "$in": [new mongoose.Types.ObjectId(currentUser.id), "$likers._id"] }
        }
      }
    ]);
    console.log(posts);
    return posts;*/
    try {
      const currentUserObjectId = new mongoose.Types.ObjectId(currentUser.id);

      const posts: Post[] = await this.postModel.aggregate([
        {
          "$addFields": {
            "isLiked": { "$in": [currentUserObjectId, "$likers._id"] }
          }
        },
        {
          "$addFields": {
            "replies": {
              "$map": {
                "input": "$replies",
                "as": "reply",
                "in": {
                  "_id": "$$reply._id",
                  "author": "$$reply.author",
                  "text": "$$reply.text",
                  "likers": "$$reply.likers",
                  "isLiked": { "$in": [currentUserObjectId, "$$reply.likers._id"] }
                }
              }
            }
          }
        },
        {
          "$project": {
            "_id": 1,
            "author": 1,
            "text": 1,
            "image": 1,
            "likers": 1,
            "replies": {
              "_id": 1,
              "author": 1,
              "text": 1,
              "likers": 1,
              "isLiked": 1
            },
            "createdAt": 1,
            "isLiked": 1
          }
        },
        {
          "$sort": {
            "createdAt": -1 // 使用-1表示降序排序，1表示升序排序
          }
        }
      ]);

      if (!Array.isArray(posts)) {
        throw new Error('Failed to retrieve posts');
      }
      return posts;
    } catch (error) {
      // 处理错误，例如记录错误信息或者抛出自定义异常
      console.error('Error in findPosts:', error);
      throw new Error('Failed to retrieve posts');
    }
  }

  async findPostById(postId: string, currentUser: RequestUser) {
    // const post = await this.postModel.findById(postId);
    const post = await this.postModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(postId) } },
      { $limit: 1 },
      {
        "$project": {
          "_id": 1,
          "author": 1,
          "text": 1,
          "image": 1,
          "likers": 1,
          "replies": {
            "_id": 1,
            "author": 1,
            "text": 1,
            "likers": 1,
            "isLiked": { "$in": [new mongoose.Types.ObjectId(currentUser.id), "$replies.likers._id"] }
          },
          "createdAt": 1,
          "isLiked": { "$in": [currentUser.id, "$likers._id"] }
        }
      }
    ]);
    return post;
  }

  async createPost(file: any, createPostDto: CreatePostDto, currentUser: RequestUser) {
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
      { $pull: { likers: { _id: new mongoose.Types.ObjectId(currentUserId) } } },
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

  async likeReply(currentUserId: string, postId: string, replyId: string) {
    let currentUser = await this.usersService.findUserById(currentUserId);
    let post = await this.postModel.findById(postId);
    const updatedReplies = await Promise.all(post.replies.map(async (reply) => {
      if (reply._id.toString() === replyId) {
        reply.likers.push(currentUser);
      }
      return reply;
    }));
    post.replies = updatedReplies;

    if (updatedReplies.length > 0) {
      post.markModified('replies');
    }

    await post.save();
    return post;
  }

  async unlikeReply(currentUserId: string, postId: string, replyId: string) {
    let currentUser = await this.usersService.findUserById(currentUserId);
    let post = await this.postModel.findByIdAndUpdate(
      postId,
      {
        $pull: {
          "replies.$[elem].likers": { _id: new mongoose.Types.ObjectId(currentUserId) }
        }
      },
      {
        arrayFilters: [{ "elem._id": new mongoose.Types.ObjectId(replyId) }],
        new: true
      }
    );

    return post;
  }
}
