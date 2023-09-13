import { Body, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { Response } from 'express';
import { User } from 'src/schemas/user.schema';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {

  constructor(private usersService: UsersService) {};

  @Get(':id')
  async getAccount(
    @Param('id') id: string,
    @Res() res: Response){
      const user = await this.usersService.findUser(id);
      res.send(user);
  }
  
  @Post()
  @UseInterceptors(FileInterceptor('file', { dest: './upload' }))
  async createUser(
    @Body() createUserInput: CreateUserInput,
    @UploadedFile() file: Express.Multer.File,
    @Res() res: Response) {
    const createdUser = await this.usersService.createUser(createUserInput, file)
    res.send(createdUser);
  }

}
