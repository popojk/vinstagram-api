import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Reply } from 'src/schemas/reply.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class RepliesService {
  constructor(
    @InjectModel(Reply.name) private replyModel: Model<Reply>,
    private usersService: UsersService
  ) { };

  async likeReply(currentUserId: string, replyId: string): Promise<Reply> {
    let currentUser = await this.usersService.findUserById(currentUserId);
    let reply = await this.replyModel.findById(replyId);

    reply.likers.push(currentUser);
    reply.save();

    return reply;
  }

  //unlike a post
  async unlikeReply(currentUserId: string, replyId: string): Promise<Reply> {

    let reply = await this.replyModel.findByIdAndUpdate(replyId,
      { $pull: { likers: { _id: new mongoose.Types.ObjectId(currentUserId) } } },
      { new: true }
    );

    return reply;
  }
}
