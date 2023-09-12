import { Body, Controller, Post, Res, UploadedFile, UseGuards, UseInterceptors, Req } from '@nestjs/common';
import { PostsService } from './posts.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreatePostDto } from './dto/post.dto';
import { CurrentUser } from 'src/decorators/currentUserDecorator';
import { RequestUser } from 'src/users/interface/user.interface';
import { Response, Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {};

  @Post()
  @UseInterceptors(FileInterceptor('file', { dest: './upload' }))
  async createPost(
    @UploadedFile() file: Express.Multer.File,
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() user: RequestUser,
    @Res() res: Response,
  ){
    const post = await this.postsService.createPost(file, createPostDto, user);
    res.send(post);
  }
}
